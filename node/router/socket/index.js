function getSocketRouter(wsApp) {
  return (ws, req, next) => {
    ws.on('message', (message) => {
      switch (message) {
        case 'getTime':
          ws.send(Date.now());
          break;
        case 'getRandomMessage':
          ws.send('random message');
          break;
        default:
          ws.send('default message');
      }
    });

    next();
  }
}

export default getSocketRouter;
