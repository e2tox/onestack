import * as fs from 'fs'
import * as path from 'path'

export class Directory {
  
  private constructor(private _directory: string, private _permission: number) {
  }
  
  public static withReadPermission(directory: string): Directory {
    return Directory.resolve(process.cwd(), directory, fs.constants.R_OK);
  }
  
  public static withReadWritePermission(directory: string): Directory {
    return Directory.resolve(process.cwd(), directory, fs.constants.R_OK | fs.constants.W_OK);
  }
  
  private static resolve(root: string, directory: string, permission: number): Directory {
  
    // resolve directory from root
    directory = path.resolve(root, directory);
    
    // must directory
    let stat = fs.statSync(directory);
    if (!stat.isDirectory()) {
      throw new Error(`'${directory}' is not a directory`)
    }
  
    // make sure we can perform `cd` command
    fs.accessSync(directory, permission | fs.constants.X_OK);
    
    return new Directory(directory, permission);
  }
  
  private static file(root: string, filePath: string, permission: number): string {
    
    // resolve file from root
    filePath = path.resolve(root, filePath);
    
    // must be a file
    let stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      throw new Error(`'${filePath}' is not a file`)
    }
  
    // make sure we can have the permission
    fs.accessSync(filePath, permission);
    
    return filePath;
  }
  
  public get path(): string {
    return this._directory;
  }
  
  public resolve(relativePath: string): Directory {
    if (path.isAbsolute(relativePath)) {
      throw new Error(`'${relativePath}' is not a relative path`);
    }
    return Directory.resolve(this._directory, relativePath, this._permission);
  }
  
  public file(relativeFilePath: string): string {
    if (path.isAbsolute(relativeFilePath)) {
      throw new Error(`'${relativeFilePath}' is not a relative path`);
    }
    return Directory.file(this._directory, relativeFilePath, this._permission);
  }
  
}
