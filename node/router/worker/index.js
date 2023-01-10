import express from 'express';
import formidable from 'formidable';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs, { stat } from 'fs';
import { readFile, appendFile } from 'fs/promises';
import { Buffer } from 'buffer';


const router = new express.Router();
const arrayBufferMapping = {};
const __dirname = dirname(fileURLToPath(import.meta.url));

const getType = (value) => {
  return ({}).toString.apply(value);
}

let flag = true;

class FileHelper {
  static getAllFilesPath(filePath) {
    const fileSplitter = '\\';
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
    return new Promise((resolve, reject) => {
      const [id, index, total, extension] = fileName.split('.');
      const fileStatus = Array
        .apply(undefined, { length: total })
        .map(() => ({ checked: false }));
      let finished = false;
      let hasError = false;
      const onSegmentChecked = () => {
        if (finished) return;
        finished = fileStatus.every((stateInfo) => {
          hasError = stateInfo.status === false;
          return stateInfo.checked;
        });
        if (hasError) finished = true;
        if (finished) hasError ? reject() : resolve();
      };
      fileStatus.forEach((status, index) => {
        stat(path.join(__dirname, `../../file/${fileName}`), (err, stats) => {
          fileStatus[index].status = true;
          fileStatus[index].checked = true;
          onSegmentChecked();
        });
      });

    });
  }

  static mergeFiles(files, newFileName) {
    const promises = [];
    files.forEach(filePath => {
      promises.push(readFile(filePath));
    });
    Promise.all(promises)
      .then((res) => {
        console.log('read file success ----------', res)
        const length = res.reduce((total, buffer) => {
          total += buffer.length;
          return total;
        }, 0);
        const fileBuffer = Buffer.concat(res, length);
        appendFile(newFileName, fileBuffer);
      })
      .catch(err => {
        console.log('read file err', err);
      });
  }
}

router.post('/upload', function(req, res, next) {
  console.log('in upload');
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
    const { total, index, id } = fields;

    // console.log('files', files)

    FileHelper.checkSegmentsAllUploaded(files.blob.newFilename)
      .then(result => {
        console.log('success');
        // console.log(FileHelper.getAllFilesPath(files.blob.filepath));
        if (!flag) return;
        flag = false;
        FileHelper.mergeFiles(FileHelper.getAllFilesPath(files.blob.filepath), path.join(__dirname, '../../file/test.jpg'));
      })
      .catch(err => {
        console.log('fail');
      })
      .finally(() => {
        res.send('success');
      });

    // const { blob } = files;
    // if (!arrayBufferMapping[id]) arrayBufferMapping[id] = {};
    // arrayBufferMapping[id][index] = blob[0];
    //
    // const isFileLoaded = Array.apply(undefined, { length: total }).every((item, index) => !!arrayBufferMapping[id][index]);
    // if (isFileLoaded) {
    //   const file = new Blob(arrayBufferMapping[id], { type: 'image/png' });
    // }
  });
});

export default router;
