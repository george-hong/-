import express from 'express';
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path';
const app = express();
const port = 3002;
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use('/examples', express.static(path.join(__dirname, '../examples')));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
