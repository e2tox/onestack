import { Stream } from 'stream';
import { service, implementation } from '../../../src/lib/engine/service';
import {
  IEchoService, IEachRequestStreamService, IEachBidiStreamService,
  IEachStreamResponseService
} from '../sdk/echo.service';
import { Duplex } from 'stream';

@service('onestack.test.services.EchoService')
export class Echo3Service implements IEchoService, IEachStreamResponseService,
  IEachRequestStreamService, IEachBidiStreamService {

  @implementation()
  public echo(content: string): Promise<string> {
    return {} as Promise<string>;
  }

  @implementation()
  public echoError(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      reject(new Error('not allowed'));
    });
  }

  @implementation()
  public echoClientStream(stream: Stream): Promise<string> {
    return new Promise((resolve, reject) => {
      reject(new Error('not allowed'));
    });
  }

  @implementation()
  public echoStream(content: string): Stream {
    return null;
  }

  @implementation()
  public echoBidiStream(stream: Stream): Stream {

    // console.log('got stream', stream);
    const duplex = stream as Duplex;

    duplex.on('error', (err) => {
      duplex.emit('error', err);
    });

    duplex.on('data', (data) => {
      console.log('server got => ', data);
      duplex.write({ content: JSON.stringify(data) });
    });

    // resolve promise
    duplex.on('end', () => {
      console.log('server got end');
      duplex.end();
    });

    return duplex;
  }

}
