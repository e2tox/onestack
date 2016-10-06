import { Kernel } from './kernel'

// createGetterInterceptor a unique, global symbol name
// -----------------------------------
const sblKernel = Symbol.for('onestack.kernel');

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------
const globalSymbols = Object.getOwnPropertySymbols(global);

if (globalSymbols.indexOf(sblKernel) === -1) {
  global[sblKernel] = Kernel.getInstance(); // Object.freeze(kernel); - this will break istanbul test
}

export default global[sblKernel] as Kernel;
