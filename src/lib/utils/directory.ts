import * as fs from 'fs'
import * as path from 'path'
import { agent } from 'agentframework';

@agent('directory')
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

  public static mkdir(dir: string, mode?: number) {
    const currentPaths: Array<string> = dir.split(path.sep);
    let n = 1;
    while (n++ < currentPaths.length) {
      const folder = currentPaths.slice(0, n).join(path.sep);
      try {
        fs.mkdirSync(folder, mode);
      }
      catch (err0) {
        let stat;
        try {
          stat = fs.statSync(folder);
        }
        catch (err1) {
          throw err0;
        }
        if (!stat.isDirectory()) {
          throw new Error(`'${folder}' is not a directory`);
        }
      }
    }
    return dir;
  }

  private static resolve(root: string, directory: string, permission: number): Directory {

    // resolve directory from root
    directory = path.resolve(root, directory);

    // must directory
    let stat;
    try {
      // make sure this file exists
      stat = fs.statSync(directory);
    }
    catch (err) {
      const newErr = new Error(`Directory '${directory}' is not exist`);
      newErr['file'] = directory;
      newErr['innerError'] = err;
      throw newErr;
    }

    if (!stat.isDirectory()) {
      const err = new Error(`'${directory}' is not a directory`);
      err['file'] = directory;
      throw err;
    }

    try {
      // make sure we can perform `cd` command
      fs.accessSync(directory, permission | fs.constants.X_OK);
    }
    catch (err) {
      err.file = directory;
      throw err;
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

@agent('file')
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
    }
    catch (err) {
      const newErr = new Error(`File '${filePath}' is not exist`);
      newErr['file'] = filePath;
      newErr['innerError'] = err;
      throw newErr;
    }

    if (!stat.isFile()) {
      throw new Error(`'${filePath}' is not a file`)
    }

    try {
      // make sure we can have the permission
      fs.accessSync(filePath, permission);
    }
    catch (err) {
      err.file = filePath;
      throw err;
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
