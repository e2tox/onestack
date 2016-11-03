import { Server } from './server';
import * as path from 'path';

describe('server', () => {

  let testRoot: string;

  beforeAll(() => {
    // resolve from process.cwd()
    testRoot = path.resolve('test/full_customized');
  });

  describe('# should able to', () => {

    it('start', () => {
      const server = new Server();
      console.log('Keys', Object.keys(server), server);
      server.start({ root: testRoot });
    });

  });

});
