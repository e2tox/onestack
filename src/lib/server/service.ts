import {
  decorateClassMethod, decorateClass,
  IAttribute, IInterceptor, IInvocation, AgentAttribute
} from 'agentframework';
import { Stream } from 'stream';

/**
 * an method
 */
export function service(identifier: string) {
  return decorateClass(new AgentAttribute(identifier));
}

/**
 * an method
 */
export function implementation() {
  return decorateClassMethod(new ServiceAttribute());
}

/**
 * Interceptor for service calls
 */
class ServiceAttribute implements IAttribute, IInterceptor {

  getInterceptor(): IInterceptor {
    return this;
  }

  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {

    // make parameters more friendly
    const call = parameters[0];
    const expandedParameters = Object.getOwnPropertyNames(call.request).map(name => call.request[name]);
    expandedParameters.push(call.metadata);
    const res = invocation.invoke(expandedParameters);

    if (parameters.length === 1) {
      if (res instanceof Stream || res.pipe) {
        const stream = res as Stream;
        stream.pipe(call);
      }
      else {
        throw new TypeError('Implementation must return a Stream');
      }
    }
    else if (parameters.length === 2) {
      if (res instanceof Promise || (res.then && res.catch)) {
        const sendUnaryData = parameters[1];
        res.then(result => {
          sendUnaryData(null, result);
        }).catch(err => {
          sendUnaryData(err, null);
        })
      }
      else {
        throw new TypeError('Implementation must return a Promise');
      }
    }

    // not used by grpc, for unit test code which run locally.
    return res;
  }
}
