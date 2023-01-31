import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import expressWs from 'express-ws';
import workerRouter from './router/worker/index.js';
import getSocketRouter from './router/socket/index.js';

const app = express();
const wsApp = expressWs(app);
const port = 3002;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/examples', express.static(path.join(__dirname, '../examples')));

app.get('/', (req, res) => {

  res.send('Hello World!')

});

app.use('/worker', workerRouter);

app.ws('/socket', getSocketRouter(wsApp));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
