import express from 'express';
import multiparty from 'multiparty';


const router = new express.Router();

router.post('/upload', function(req, res) {
  const form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {

    res.send('upload');
  });
});

export default router;
