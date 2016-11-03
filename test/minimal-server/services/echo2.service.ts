import { Stream, PassThrough } from 'stream';
import { service, implementation } from '../../../src/lib/engine/service';
import { IEchoService } from '../sdk/echo.service';

@service('onestack.test.services.Echo2Service')
export class Echo2Service implements IEchoService {

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
