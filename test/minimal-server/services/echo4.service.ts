import { Stream, PassThrough } from 'stream';
import { service, implementation } from '../../../src/lib/engine/service';
import { IEachBidiStreamService } from '../sdk/echo.service';
import { Duplex } from 'stream';

@service('onestack.test.services.EchoService')
export class Echo4Service implements IEachBidiStreamService {

  @implementation()
  public echoBidiStream(stream: Stream): Stream {

    // console.log('got stream', stream);

    const duplex = stream as Duplex;

    let echoStream = new PassThrough({ objectMode: true });

    duplex.on('error', (err) => {
      echoStream.emit('error', err);
    });

    duplex.on('data', (data) => {
      console.log('server got => ', data);
      echoStream.write({ content: JSON.stringify(data) });
    });

    // resolve promise
    duplex.on('end', () => {
      console.log('server got end');
      echoStream.end();
    });

    return echoStream;
  }

}
