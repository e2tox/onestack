import * as fs from 'fs'
import * as grpc from 'grpc-typed'
import * as path from 'path'

export class Builder {

  static protocols = {};
  private static files: Set<string> = new Set<string>();

  /**
   * Load protocol from file
   * @param identifier
   * @param searchDir
   * @returns {{}}
   * @constructor
   */
  static LoadProtocolFromFile(identifier: string, searchDir: string): any {

    const pkg = identifier.slice(0, identifier.lastIndexOf('.'));
    const dirs = searchDir.split(path.sep);
    const searched = [];
    let n = dirs.length + 1;

    while (n--) {
      const dir = dirs.slice(0, n).join(path.sep);
      const file = path.resolve(dir, `protos/${pkg}.proto`);
      let stats;

      try {
        stats = fs.statSync(file);
      }
      catch (err) {
        searched.push(file);
      }

      if (stats && stats.isFile()) {

        // only load one time for one protocol file
        if (!this.files.has(file)) {
          const protocol = grpc.load(file);
          Object.assign(this.protocols, protocol);
          this.files.add(file);
        }

        // get service object from identifier
        const ns = identifier.split('.');
        let current = this.protocols;
        for (let i = 0; i < ns.length; i++) {
          current = current[ns[i]];
          if (!current) {
            throw new TypeError(`Service '${identifier}' not found in protocol file: '${file}'`);
          }
        }

        return current;
      }

      if (dir.length <= process.cwd().length) {
        break;
      }
    }

    throw new TypeError(`Protocol file '${pkg}.proto' not found at: ${searched}`);
  }

  /**
   * Build client for Protocol
   * @param port
   * @param identifier
   * @param searchDir
   * @returns {any}
   * @constructor
   */
  static BuildProtocolClient(port: string, identifier: string, searchDir: string): any {
    const protocol = Builder.LoadProtocolFromFile(identifier, searchDir);
    return Reflect.construct(protocol, [port, grpc.credentials.createInsecure()]);
  }

}
