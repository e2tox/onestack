import * as path from 'path'
import * as callsite from 'callsite'
import {
  AgentAttribute,
  decorateClass,
  decorateClassMethod,
  IAttribute,
  IInterceptor,
  IInvocation
} from 'agentframework';
import { Metadata } from 'grpc-typed';
import { Builder } from './builder';
import { Readable } from 'stream';
import { ParseFunctionArguments } from '../utils/utils';

const CLIENT_PROPERTY_KEY = Symbol('service.client');
const TIMEOUT_PROPERTY_KEY = Symbol('service.client.timeout');
const METADATA_PROPERTY_KEY = Symbol('service.client.metadata');

export class ServiceClient {

  constructor(private port: string) {
  }

  get metadata(): Metadata {
    return Reflect.get(this, METADATA_PROPERTY_KEY) as Metadata;
  }

}

/**
 * an method
 */
export function client(identifier: string) {
  const source = path.dirname(callsite()[1].getFileName());
  return decorateClass(new ClientAgentAttribute(identifier, source));
}

export class ClientAgentAttribute extends AgentAttribute {

  constructor(identifier: string, private searchDir: string) {
    super(identifier);
  }

  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {

    // call original constructor
    const agent = super.intercept(invocation, parameters);

    // parameters[0] is port
    const client = Builder.BuildProtocolClient(parameters[0], this.identifier, this.searchDir);

    Reflect.set(agent, CLIENT_PROPERTY_KEY, client);
    Reflect.set(agent, METADATA_PROPERTY_KEY, new Metadata());

    return agent;
  }

}

/**
 * an method
 */
export function timeout(timeout: number) {
  return decorateClass(new TimeoutAttribute(timeout));
}

export class TimeoutAttribute implements IAttribute, IInterceptor {

  constructor(private _timeout: number) {
  }

  get timeout(): number {
    return this._timeout;
  }

  getInterceptor(): IInterceptor {
    return this;
  }

  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {
    const agent = invocation.invoke(parameters);
    Reflect.set(agent, TIMEOUT_PROPERTY_KEY, this.timeout);
    return agent;
  }
}

/**
 * an method
 */
export function method(...parameterNames) {
  return decorateClassMethod(new MethodAttribute(parameterNames));
}

export class MethodAttribute implements IAttribute, IInterceptor {

  constructor(private _params: Array<string>) {
  }

  getInterceptor(): IInterceptor {
    return this;
  }

  /**
   * Request -> Promise
   */
  handleUnaryRequest(client, targetFunction, metadata, options, invocation, parameters) {

    const parameterNames = !this._params.length ? ParseFunctionArguments(invocation.method) : this._params;
    const innerParameter = {};
    // convert method parameter to object
    Array.from(parameters).map((v, k) => {
      innerParameter[parameterNames[k]] = v;
    });

    // create promise and bind to below callback
    let callback;
    const promise = new Promise(function (resolve, reject) {
      callback = function callback2promise(err, value) {
        if (err) {
          return reject(err);
        }
        return resolve(value);
      }
    });

    // gRPC will got error if we put callback at rpc of stream response
    // so we need check targetFunction.length.
    Reflect.apply(targetFunction, client, [innerParameter, metadata, options, callback]);

    // return the promise we created
    return promise;
  }

  /**
   * Request -> Stream
   */
  handleServerStreamRequest(client, targetFunction, metadata, options, invocation, parameters) {

    const parameterNames = !this._params.length ? ParseFunctionArguments(invocation.method) : this._params;
    const innerParameter = {};

    // convert method parameter to object
    Array.from(parameters).map((v, k) => {
      innerParameter[parameterNames[k]] = v;
    });

    return Reflect.apply(targetFunction, client, [innerParameter, metadata, options]);
  }

  /**
   * Stream -> Promise
   */
  handleClientStreamRequest(client, targetFunction, metadata, options, invocation, parameters) {

    const incomingStream = parameters[0] as Readable;

    let callback;
    const promise = new Promise(function (resolve, reject) {
      callback = function callback2promise(err, value) {
        if (err) {
          return reject(err);
        }
        return resolve(value);
      }
    });

    const outgoingStream = Reflect.apply(targetFunction, client, [metadata, options, callback]);
    incomingStream.pipe(outgoingStream);

    return promise;
  }

  /**
   * Stream -> Stream
   */
  handleBidiStreamRequest(client, targetFunction, metadata, options, invocation, parameters) {

    const incomingStream = parameters.length ? parameters[0] as Readable : null;

    const duplexStream = Reflect.apply(targetFunction, client, [metadata, options]);

    if (incomingStream != null) {
      incomingStream.pipe(duplexStream);
    }

    return duplexStream;
  }

  /**
   * Interceptor
   */
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {

    const timeout = Reflect.get(invocation.target, TIMEOUT_PROPERTY_KEY) as number;
    const client = Reflect.get(invocation.target, CLIENT_PROPERTY_KEY);
    const targetFunction = Reflect.get(client, invocation.method.name);
    const metadata = Reflect.get(invocation.target, METADATA_PROPERTY_KEY) as Metadata;

    // request options for all kind request
    const options = {
      deadline: Date.now() + timeout // 10 sec
    };

    switch (targetFunction.name) {
      case 'makeUnaryRequest':
        return this.handleUnaryRequest(client, targetFunction, metadata, options, invocation, parameters);
      case 'makeServerStreamRequest':
        return this.handleServerStreamRequest(client, targetFunction, metadata, options, invocation, parameters);
      case 'makeClientStreamRequest':
        return this.handleClientStreamRequest(client, targetFunction, metadata, options, invocation, parameters);
      case 'makeBidiStreamRequest':
        return this.handleBidiStreamRequest(client, targetFunction, metadata, options, invocation, parameters);
      default:
        throw new TypeError(`Not Supported Request: ${targetFunction.name}`);
    }
  }
}
