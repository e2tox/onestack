import { agent } from './agent';
import { Domain } from './domain';

@agent('foo')
class Foo {
  hello():string {
    return 'Foo.hello()';
  }
}

@agent('foo')
class AdvancedFoo {
  constructor(private name: string) {
  }
  hello():string {
    return `AdvancedFoo.hello(${this.name})`;
  }
}

class Bar {
  hello():string {
    return 'Bar.hello()';
  }
}

@agent('foo')
@agent('foobar')
class FooBar {
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
    
    it('able to create agent with paramenter', () => {
      const foo: AdvancedFoo = Domain.createAgentFromType(AdvancedFoo, 'foo');
      expect(foo.hello()).toBe('AdvancedFoo.hello(foo)');
    });
  
    it('not allow to create agent', () => {
      expect(() => {
        Domain.createAgentFromType(Bar)
      }).toThrow(new TypeError('Agent Decoration Not Found'))
    });
    
    it('not allow to create agent', () => {
      expect(() => {
        Domain.createAgentFromType(FooBar)
      }).toThrow(new TypeError('Not Support Multiple Agent Decoration'))
    });
  
  });
  
});
