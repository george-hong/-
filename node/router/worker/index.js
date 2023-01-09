import express from 'express';
import formidable from 'formidable';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs, { stat } from 'fs';


const router = new express.Router();
const arrayBufferMapping = {};
const __dirname = dirname(fileURLToPath(import.meta.url));

const getType = (value) => {
  return ({}).toString.apply(value);
}

class FileHelper {
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
    const { total, index, id } = fields;

    // console.log('files', files)

    FileHelper.checkSegmentsAllUploaded(files.blob.newFilename)
      .then(result => {
        console.log('success');
      })
      .catch(err => {
        console.log('fail');
      });

    // const { blob } = files;
    // if (!arrayBufferMapping[id]) arrayBufferMapping[id] = {};
    // arrayBufferMapping[id][index] = blob[0];
    //
    // const isFileLoaded = Array.apply(undefined, { length: total }).every((item, index) => !!arrayBufferMapping[id][index]);
    // if (isFileLoaded) {
    //   const file = new Blob(arrayBufferMapping[id], { type: 'image/png' });
    // }
    res.send('success');
  });
});

export default router;
