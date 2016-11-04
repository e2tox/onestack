import {
  IEchoService, IEachRequestStreamService, IEachStreamResponseService,
  IEachBidiStreamService
} from './echo.service';
import { ServiceClient, client, timeout, method } from '../../../src/lib/engine/client';
import { Stream } from 'stream';

@client('onestack.test.services.EchoService')
@timeout(10000)
export class EchoServiceClient extends ServiceClient implements IEchoService, IEachRequestStreamService, IEachStreamResponseService, IEachBidiStreamService {
  
  @method()
  public echo(content: string): Promise<string> {
    throw new TypeError('Missing client decorator');
  }
  
  @method('content')
  public echoError(content: string): Promise<string> {
    throw new TypeError('Missing client decorator');
  }
  
  @method()
  public echoStream(content: string): Stream {
    throw new TypeError('Missing client decorator');
  }
  
  @method()
  public echoClientStream(stream: Stream): Promise<string> {
    throw new TypeError('Missing client decorator');
  }
  
  @method()
  public echoBidiStream(stream: Stream): Stream {
    throw new TypeError('Missing client decorator');
  }
  
}
