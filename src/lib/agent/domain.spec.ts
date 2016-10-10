import { agent } from './agent';
import { Domain } from './domain';

class Foo {
  hello(): string {
    return 'Foo.hello()';
  }
}

@agent('foo')
class AgentFoo {
  
  constructor() {
    if (this.hello() !== 'AgentFoo.hello()') {
      throw new TypeError(this.hello())
    }
  }
  
  hello(): string {
    return 'AgentFoo.hello()';
  }
}

@agent('foo')
class AgentFooWithParameters {
  constructor(private name: string) {
  }
  
  hello(): string {
    return `AgentFooWithParameters.hello(${this.name})`;
  }
}

@agent('multifoo')
@agent('multifoobar')
class MultipleAgentFoo {
  count: number = 0;
  
  hello(): string {
    this.count++;
    return 'MultipleAgentFoo.hello()';
  }
}

describe('Domain', () => {
  
  describe('# createAgentFromType', () => {
    
    it('able to create normal object', () => {
      const foo: Foo = new Foo();
      expect(foo.hello()).toBe('Foo.hello()');
    });
    
    it('able to create agent', () => {
      const foo: AgentFoo = new AgentFoo();
      expect(foo.hello()).toBe('AgentFoo.hello()');
    });
    
    it('able to create agent with paramenter', () => {
      const foo: AgentFooWithParameters = new AgentFooWithParameters('foo');
      expect(foo.hello()).toBe('AgentFooWithParameters.hello(foo)');
    });
    
    it('origin method should only called once', () => {
      const foo = new MultipleAgentFoo();
      expect(foo.hello()).toBe('MultipleAgentFoo.hello()');
      expect(foo.count).toBe(1); // this method should only called once
    });
    
  });
  
});
