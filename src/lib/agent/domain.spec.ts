
import { agent } from './agent';
import { Domain } from './domain';

@agent('foo')
class Foo {
  hello():string {
    return 'Foo.hello()';
  }
}

class Bar {
  hello():string {
    return 'Bar.hello()';
  }
}

describe('Domain', () => {
  
  describe('# createAgentFromType', () => {
  
    it('able to create agent', () => {
      const foo: Foo = Domain.createAgentFromType(Foo);
      expect(foo.hello()).toBe('Foo.hello()');
    });
    
    it('not allow to create agent', () => {
      expect(() => {
        Domain.createAgentFromType(Bar)
      }).toThrow(new TypeError('Agent Decoration Not Found'))
    });
  
  });
  
});
