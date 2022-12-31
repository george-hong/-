import express from 'express';

const router = new express.Router();

router.post('/upload', function(req, res) {
  res.send('upload');
});

export default router;
