import { Stream, PassThrough } from 'stream';
import { service, implementation } from '../../../src/lib/engine/service';
import { IEachBidiStreamService } from '../sdk/echo.service';

@service('onestack.test.services.EchoService')
export class Echo4Service implements IEachBidiStreamService {
  
  @implementation()
  public echoBidiStream(stream: Stream): Stream {
    
    let echoStream = new PassThrough({ objectMode: true });
    
    stream.on('error', (err)=> {
      echoStream.emit('error', err);
    });
    
    stream.on('data', (data) => {
      console.log('server got', data);
      echoStream.write({ content: JSON.stringify(data) });
    });
    
    // resolve promise
    stream.on('end', () => {
      console.log('server got end');
      echoStream.end();
    });
    
    return echoStream;
  }
}
