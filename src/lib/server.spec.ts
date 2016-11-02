import { Server } from './server';

describe('server', () => {

  describe('# should able to', () => {

    it('start', () => {
      const server = new Server();
      console.log('Keys', Object.keys(server), server);
      server.start();
    });

  });

});
