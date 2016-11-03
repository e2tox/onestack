import { Stream, PassThrough } from 'stream';
import { service, implementation } from '../../../src/lib/engine/service';
import { IEchoService } from '../sdk/echo.service';

@service('onestack.test.services.EchoService')
export class EchoService implements IEchoService {

  @implementation()
  public echo(content: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(`Hello, ${content}`);
    });
  }

  @implementation()
  public echoError(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      reject(new Error('not allowed'));
    });
  }

  @implementation()
  public echoStream(content: string): Stream {
    let echoStream = new PassThrough({ objectMode: true });
    for (let n = 1; n <= 10; n++) {
      echoStream.write({ content: `Hello, ${content}, ${n}` });
    }
    echoStream.end();
    echoStream.on('drain', function () {
      console.log('done');
    });
    return echoStream;
  }

}

// import * as fs from 'fs'
//
// @service('sw.engine.storage.StorageEngine')
// export class DownloaderService {
//   @implementation()
//   public download(name: string, metadata?: Metadata): Stream {
//     return fs.createReadStream('filename.mp3');
//   }
// }
//
// const engine = new Engine();
// engine.addService(DownloaderService);
// engine.bind('0.0.0.0', 3000);
// engine.start();
//
//
// //////////////////
//
// @client('sw.engine.storage.StorageEngine')
// @timeout(10000)
// export class DownloaderClient extends ServiceClient {
//   @method()
//   public download(): Stream {
//     return null;
//   }
// }
//
// const downloader = new DownloaderClient('127.0.0.1:3000');
//
// downloader.metadata.add('username', 'ling');
// downloader.metadata.add('password', '123');
//
// express.get('/download', function (req, res) {
//   res.pipe(downloader.download());
// });
