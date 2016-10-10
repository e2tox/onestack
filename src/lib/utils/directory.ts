import * as fs from 'fs'
import * as path from 'path'

export class Directory {
  
  private constructor(private _directory: string, private _permission: number) {
  }
  
  public static cwd(): Directory {
    return Directory.resolve(process.cwd(), '.', fs.constants.R_OK);
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
    let stat;
    
    try {
      // make sure this file exists
      stat = fs.statSync(directory);
  
      // make sure we can perform `cd` command
      fs.accessSync(directory, permission | fs.constants.X_OK);
    }
    catch(err) {
      err.file = directory;
      throw err;
    }
    
    if (!stat.isDirectory()) {
      throw new Error(`'${directory}' is not a directory`)
    }
    
    return new Directory(directory, permission);
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
  
  public file(relativeFilePath: string): File {
    if (path.isAbsolute(relativeFilePath)) {
      throw new Error(`'${relativeFilePath}' is not a relative path`);
    }
    return File.resolve(this, relativeFilePath, this._permission);
  }
  
}

export class File {
  
  private constructor(private _file: string, private _permission: number) {
  }
  
  public static resolve(root: Directory, filePath: string, permission: number): File {
    
    // resolve file from root
    filePath = path.resolve(root.path, filePath);
    
    // must be a file
    let stat;
    
    try {
      // make sure this file exists
      stat = fs.statSync(filePath);

      // make sure we can have the permission
      fs.accessSync(filePath, permission);
    }
    catch(err) {
      err.file = filePath;
      throw err;
    }
    
    if (!stat.isFile()) {
      throw new Error(`'${filePath}' is not a file`)
    }
    
    return new File(filePath, permission);
  }
  
  public get path(): string {
    return this._file;
  }
  
  public get permission(): number {
    return this._permission;
  }
  
  public readAll(): string {
    return fs.readFileSync(this._file, 'utf8');
  }
  
}
