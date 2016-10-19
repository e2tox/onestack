export function IsUndefined(x: any): boolean {
  return x === undefined
}

export function* ObjectEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}
