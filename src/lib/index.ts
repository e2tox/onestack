import { Kernel } from './kernel'
import { IBasicSettings } from './settings';

// createGetterInterceptor a unique, global symbol name
// -----------------------------------
const key = Symbol.for('onestack');

export { Kernel } from './kernel'
export { IBasicSettings } from './settings';

export function onestack<T extends IBasicSettings>(): Kernel<T> {

  // check if the global object has this symbol
  // add it if it does not have the symbol, yet
  // ------------------------------------------
  const globalSymbols = Object.getOwnPropertySymbols(global);

  // ensure all version using the same instance
  if (globalSymbols.indexOf(key) === -1) {
    global[key] = new Kernel<T>(); // Object.freeze(kernel); - this will break istanbul test
  }

  return global[key] as Kernel<T>;
}
