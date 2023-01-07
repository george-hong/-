import express from 'express';
import formidable from 'formidable';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';


const router = new express.Router();
const arrayBufferMapping = {};
const __dirname = dirname(fileURLToPath(import.meta.url));

const getType = (value) => {
  return ({}).toString.apply(value);
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

    console.log('files', files)
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
