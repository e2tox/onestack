import { Stream } from 'stream';

/**
 * Service interface
 */
export interface IEchoService {
  echo(content: string): Promise<string>;
  echoError(content: string): Promise<string>;
}

export interface IEachRequestStreamService {
  echoStream(content: string): Stream;
}

export interface IEachStreamResponseService {
  echoClientStream(stream: Stream): Promise<string>;
}

export interface IEachBidiStreamService {
  echoBidiStream(stream: Stream): Stream;
}
