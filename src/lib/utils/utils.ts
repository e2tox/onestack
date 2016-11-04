export function IsUndefined(x: any): boolean {
  return x === undefined
}

export function* ObjectEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

/**
 * Parse name of arguments from Function.toString()
 * @param func
 * @returns {string[]}
 */
export function ParseFunctionArguments(func) {
  // First match everything inside the function argument params.
  const args = func.toString().match(/\.*?\(([^)]*)\)/)[1];
  // Split the arguments string into an array comma delimited.
  return args.split(',').map(function (arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter(arg => !!arg); // Ensure no undefined values are added.
}
