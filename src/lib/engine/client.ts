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

  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {

    const client = Reflect.get(invocation.target, CLIENT_PROPERTY_KEY);
    const timeout = Reflect.get(invocation.target, TIMEOUT_PROPERTY_KEY) as number;
    const metadata = Reflect.get(invocation.target, METADATA_PROPERTY_KEY) as Metadata;
    const targetFunction = Reflect.get(client, invocation.method.name);
    // in current release of gRPC. targetFunction.length === 3 mean reply stream response
    // and length === 4 means reply Promise
    const shouldReplyPromise = targetFunction.length === 4;
    const parameterNames = !this._params.length ? parseFunctionArguments(invocation.method) : this._params;
    const innerParameter = {};
    const options = {
      deadline: Date.now() + timeout // 10 sec
    };

    // convert method parameter to object
    Array.from(parameters).map((v, k) => {
      innerParameter[parameterNames[k]] = v;
    });

    // TODO: need check new implementation if upgrade to new gRPC library
    if (shouldReplyPromise) {

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
    else {
      // stream response, can not put callback here
      return Reflect.apply(targetFunction, client, [innerParameter, metadata, options]);
    }
  }
}

////////////////////////////////////

/**
 * Parse name of arguments from Function.toString()
 * @param func
 * @returns {string[]}
 */
function parseFunctionArguments(func) {
  // First match everything inside the function argument params.
  const args = func.toString().match(/\.*?\(([^)]*)\)/)[1];

  // Split the arguments string into an array comma delimited.
  return args.split(',').map(function (arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter(function (arg) {
    // Ensure no undefined values are added.
    return arg;
  });
}
