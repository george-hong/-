import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path';

const customPath = {
  join(pathJoined) {
    console.log('fileURLToPath(import.meta.url)', fileURLToPath(import.meta.url))
    const __dirname = dirname(fileURLToPath(import.meta.url));
    return path.join(__dirname, pathJoined);
  }
};

export default customPath;
