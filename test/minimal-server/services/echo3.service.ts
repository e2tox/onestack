import { Stream } from 'stream';
import { service, implementation } from '../../../src/lib/engine/service';
import { IEchoService } from '../sdk/echo.service';

@service('onestack.test.services.EchoService')
export class Echo3Service implements IEchoService {

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
  public echoStream(content: string): Stream {
    return null;
  }

}
