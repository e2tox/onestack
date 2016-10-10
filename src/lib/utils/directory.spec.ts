import * as fs from 'fs'
import * as path from 'path'
import { Directory } from './directory';

describe('Directory', () => {
  
  let testRoot: string;
  
  beforeAll(() => {
    // resolve test folder
    testRoot = path.resolve('test');
    // update test file permission
    fs.chmodSync(path.join(testRoot, 'readonly/readonly.md'), '400');
    // update test folder permission
    fs.chmodSync(path.join(testRoot, 'readonly'), '500');
  });
  
  describe('# not allow to', () => {
    
    it('call resolve with absolute path', () => {
      const directory = Directory.withReadPermission(testRoot);
      expect(() => {
        directory.resolve('/absolute_path')
      }).toThrowError(`'/absolute_path' is not a relative path`)
    });
    
    it('call file with absolute path', () => {
      const directory = Directory.withReadPermission(testRoot);
      expect(() => {
        directory.resolve('/absolute_file.xml')
      }).toThrowError(`'/absolute_file.xml' is not a relative path`)
    });
    
    it('get readonly file with read/write permission', () => {
      expect(() => {
        const dir = Directory.withReadWritePermission(testRoot);
        dir.file('readonly/readonly.md');
      }).toThrowError(`EACCES: permission denied, access '${testRoot}/readonly/readonly.md'`)
    });
    
    it('get readonly folder with read/write permission', () => {
      const dir = Directory.withReadWritePermission(testRoot);
      expect(() => {
        dir.resolve('readonly')
      }).toThrowError(`EACCES: permission denied, access '${testRoot}/readonly'`)
    });
    
    it('resolve directory with absolute path', () => {
      expect(() => {
        const dir = Directory.withReadWritePermission(testRoot);
        dir.resolve('/absolute-path');
      }).toThrowError(`'/absolute-path' is not a relative path`)
    });
    
    it('resolve directory with file path', () => {
      const dir = Directory.withReadWritePermission(testRoot);
      expect(() => {
        dir.resolve('file.txt');
      }).toThrowError(`'${testRoot}/file.txt' is not a directory`)
    });
    
    it('get file with directory path', () => {
      expect(() => {
        const dir = Directory.withReadPermission(testRoot);
        dir.file('readonly');
      }).toThrowError(`'${testRoot}/readonly' is not a file`)
    });
    
    it('get file with absolute path', () => {
      expect(() => {
        const dir = Directory.withReadWritePermission(testRoot);
        dir.file('/readonly/absolute/file');
      }).toThrowError(`'/readonly/absolute/file' is not a relative path`)
    });
    
    it('get non-exist file', () => {
      expect(() => {
        const dir = Directory.withReadWritePermission(testRoot);
        dir.file('./file-not-exists.txt');
      }).toThrowError(`File '${testRoot}/file-not-exists.txt' is not exist`)
    });
    
  });
  
  describe('# should able to', () => {
    
    it('get cwd()', () => {
      const cwd = Directory.cwd();
      expect(cwd.path).toBe(process.cwd());
    });
    
    it('get directory with read access', () => {
      const readonlyDir = path.join(testRoot,'readonly');
      const directory = Directory.withReadPermission(readonlyDir);
      expect(directory).toBeDefined();
      expect(directory.path).toBe(readonlyDir);
    });
    
    it('get directory with read/write access', () => {
      const directory = Directory.withReadWritePermission(testRoot);
      expect(directory).toBeDefined();
      expect(directory.path).toBe(testRoot);
    });
    
    it('get file with read access', () => {
      const readonlyDir = path.join(testRoot,'readonly');
      const directory = Directory.withReadPermission(readonlyDir);
      const file = directory.file('readonly.md');
      expect(file).toBeDefined();
      expect(file.path).toBe(path.join(readonlyDir, 'readonly.md'));
      expect(file.permission).toBe(fs.constants.R_OK);
    });
    
    it('get file with read/write access', () => {
      const directory = Directory.withReadWritePermission(testRoot);
      const file = directory.file('file.txt');
      expect(file).toBeDefined();
      expect(file.path).toBe(path.join(testRoot, 'file.txt'));
      expect(file.permission).toBe(fs.constants.R_OK | fs.constants.W_OK);
    });
    
  });
  
});
