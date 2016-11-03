import * as grpc from 'grpc-typed'
import { Kernel } from './kernel';
import { IEngineSettings } from './engineSettings';
export { IEngineSettings } from './engineSettings';
import { agent, Agent, AgentAttribute, Reflection, prerequisite, success, conditional } from 'agentframework';
import { IKernelOptions } from './kernelOptions';
import { Builder } from './engine/builder';
import { IsUndefined } from './utils/utils';
import { ExceptionHandler } from './engine/exception';
import { IDisposable } from './utils/disposable';

export declare type Service = Agent;

/**
 * Make strong typed settings
 */
@agent('OneStack.Server')
export class Engine<T extends IEngineSettings> extends Kernel<T> implements IDisposable {

  private _services: Map<string, any>;
  private _server: grpc.Server;
  private _port: string;
  private _exceptionHandler: ExceptionHandler;

  constructor(opts?: IKernelOptions) {
    super();
    super.init(opts);
    this._services = new Map<string, any>();
    this._server = new grpc.Server();
    this._exceptionHandler = new ExceptionHandler(this);
    this._port = `${super.settings.HOST}:${super.settings.PORT}`;
    this._server.bind(this._port, grpc.ServerCredentials.createInsecure());
  }

  @prerequisite('started', false, 'Engine already started')
  @success('started', true)
  public start() {
    this._server.start();
    this.logger.info(`Engine started at http://${this._port}`);
  }

  @conditional('started', true)
  public stop(callback?: Function) {
    this._server.tryShutdown((err) => {
      if (!IsUndefined(callback)) {
        callback(err);
      }
    });
  }

  @conditional('started', true)
  public forceStop() {
    this._server.forceShutdown();
  }

  @prerequisite('started', true, 'Engine not started. Please call start() first!')
  public get port(): string {
    return this._port;
  }

  public addService(serviceType: Service, searchDir?: string) {

    // get agent identifiers for a Class
    const identifiers = Object.getOwnPropertySymbols(serviceType)
      .map(t => serviceType[t])
      .filter(t => Reflection.hasAttributes(t))
      .map(t => Reflection.getAttributes(t))
      .reduce((ax, ay) => ax.concat(ay), [])
      .filter(a => a instanceof AgentAttribute)
      .map(a => (a as AgentAttribute).identifier);

    if (!identifiers.length) {
      throw new TypeError(`${serviceType.name} is not a service`);
    }

    // one agent may implement multiple services
    identifiers.forEach((identifier: string) => {
      if (this._services.has(identifier)) {
        throw new TypeError(`Duplicate service identifier: ${identifier}`);
      }
      else {
        // load protocol
        const protocol = Builder.LoadProtocolFromFile(identifier, searchDir || this.root.path);

        // create and register agent instance
        const instance = Reflect.construct(serviceType, [this]);
        this._server.addProtoService(protocol.service, instance);

        // register service to directory for future use
        this._services.set(identifier, instance);

        // display information
        this.logger.info(`Service created: ${identifier}`);
      }
    });

  }

  public hasService(identifier: string) {
    return this._services.has(identifier);
  }

  public dispose(disposing: boolean): void {
    this._server.forceShutdown();
    this._server = null;
    this._services.clear();
    this._services = null;
    this._exceptionHandler.dispose(disposing);
    this._exceptionHandler = null;
  }
}
