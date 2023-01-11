import express from 'express';
import formidable from 'formidable';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFile, appendFile, rm as removeFile, stat } from 'fs/promises';
import { Buffer } from 'buffer';


const router = new express.Router();
const arrayBufferMapping = {};
const __dirname = dirname(fileURLToPath(import.meta.url));

const getType = (value) => {
  return ({}).toString.apply(value);
}

let flag = true;
const fileSplitter = '\\';

class FileHelper {
  static getAllFilesPath(filePath) {
    const segments = filePath.split(fileSplitter);
    const fileName = segments.pop();
    const path = segments.join(fileSplitter);
    const paths = [];
    const [id, index, total, extension] = fileName.split('.');
    Array
      .apply(undefined, { length: total })
      .forEach((item, index) => {
        paths.push(`${path}${fileSplitter}${id}.${index}.${total}.${extension}`);
      });
    return paths;
  }

  // file name rule `${id}.${segmentIndex}.${totalSegments}.{format}`
  static checkSegmentsAllUploaded(fileName) {
    const promises = [];
    const [id, index, total, extension] = fileName.split('.');
    Array
      .apply(undefined, { length: total })
      .forEach((item, index) => {
        promises.push(stat(path.join(__dirname, `../../file/${id}.${index}.${total}.${extension}`)));
      });
    return Promise.all(promises);
  }

  static mergeFiles(files, newFileName) {
    const promises = [];
    files.forEach(filePath => {
      promises.push(readFile(filePath));
    });
    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then((res) => {
          const fileBuffer = Buffer.concat(res);
          appendFile(newFileName, fileBuffer)
            .then(() => resolve())
            .catch(err => reject(err));
        })
        .catch(reject);
    });
  }

  static deleteFiles(filePaths) {
    const promises = [];
    filePaths.forEach(filePath => {
      promises.push(removeFile(filePath));
    });
    return Promise.all(promises);
  }
}

router.post('/upload', function(req, res, next) {
  const form = formidable({
    uploadDir: path.join(__dirname, '../../file'),
    filename(name, ext, part, form) {
      return part.originalFilename;
    }
  });
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log('err', err);
      next(err);
    }

    FileHelper.checkSegmentsAllUploaded(files.blob.newFilename)
      .then(result => {
        if (!flag) return;
        flag = false;
        const filePaths = FileHelper.getAllFilesPath(files.blob.filepath);
        const fileNameSegments = files.blob.filepath.split(fileSplitter).pop().split('.');
        const id = fileNameSegments.shift();
        const extension = fileNameSegments.pop();
        FileHelper.mergeFiles(filePaths, path.join(__dirname, `../../file/${id}.${extension}`))
          .then(() => FileHelper.deleteFiles(filePaths));
      })
      .catch(err => {
        console.log('fail', err);
      })
      .finally(() => {
        res.send('success');
      });
  });
});

export default router;
