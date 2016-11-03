import { Stream } from 'stream';

/**
 * Service interface
 */
export interface IEchoService {
  echo(content: string): Promise<string>;
  echoError(content: string): Promise<string>;
  echoStream(content: string): Stream;
}
