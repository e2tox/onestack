// a unique, global symbol name
// -----------------------------------
const nsDomain = Symbol.for('agent.framework.domain');


export class Domain {
  
  /**
   * Get default domain of this application
   * @returns {Domain}
   */
  public static get instance(): Domain {

    // check if the global object has this symbol
    // add it if it does not have the symbol, yet
    // ------------------------------------------
    const globalSymbols = Object.getOwnPropertySymbols(global);

    if (globalSymbols.indexOf(nsDomain) === -1) {
      global[nsDomain] = new Domain();
    }

    return global[nsDomain] as Domain;

  }
  
  // /**
  //  * Create and register an agent to the domain
  //  * @param type
  //  * @param args
  //  * @returns {T}
  //  */
  // public static createAgentFromType<T>(type: IActivatable<T>, ...args): T {
  //
  //   let attributes = Reflection.getAttributes(type).filter(attribute => attribute instanceof AgentAttribute);
  //
  //   if (!attributes.length) {
  //     throw new TypeError('Agent Decoration Not Found')
  //   }
  //
  //   if (attributes.length > 1) {
  //     throw new TypeError('Not Support Multiple Agent Decoration')
  //   }
  //
  //   // for(const key in attrs) {
  //   //   const agentAttr = attrs[key] as AgentAttribute;
  //   //   console.log(`Create and register agent '${agentAttr.identifier}'`)
  //   // }
  //
  //   return ProxyInterceptor.construct<T>(type, args);
  //
  // }
  
  
}
