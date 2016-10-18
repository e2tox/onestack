import * as path from 'path'
import { Kernel } from './lib/kernel';

const testRoot = path.resolve('test');

const k1 = new Kernel();
k1.init(testRoot);
console.time('Agent v1 ==> 500k calls');
for (let n1 = 0; n1 < 500000; n1++) {
  const p = k1.root.path;
}
console.timeEnd('Agent v1 ==> 500k calls');

var init = true;
function v3() {
  if (!init) {
    throw new TypeError()
  }
  return 'asdasdasdasd';
}
console.time('Agent v3 ==> 500k calls');
for (let n1 = 0; n1 < 500000; n1++) {
  const p = v3();
}
console.timeEnd('Agent v3 ==> 500k calls');
