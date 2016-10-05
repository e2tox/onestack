import * as path from 'path'
import { Directory } from './directory';

describe('Directory', () => {
  
  let testRoot: string;
  
  beforeEach(() => {
    testRoot = path.resolve('test');
  });
  
  describe('# not allow to', () => {
    
    it('call resolve with absolute path', () => {
      const directory = Directory.withReadPermission(testRoot)
      expect(() => {
        directory.resolve('/absolute_path')
      }).toThrowError(`'/absolute_path' is not a relative path`)
    });
    
    it('call file with absolute path', () => {
      const directory = Directory.withReadPermission(testRoot)
      expect(() => {
        directory.resolve('/absolute_file.xml')
      }).toThrowError(`'/absolute_file.xml' is not a relative path`)
    });
  
    it('get readonly folder with read/write permission', () => {
      const dir = Directory.withReadWritePermission(testRoot);
      expect(() => {
        dir.resolve('readonly')
      }).toThrowError(`EACCES: permission denied, access '${testRoot}/readonly'`)
    });
    
    it('get readonly file with read/write permission', () => {
      expect(() => {
        const dir = Directory.withReadWritePermission(testRoot);
        dir.file('readonly.txt');
      }).toThrowError(`EACCES: permission denied, access '${testRoot}/readonly.txt'`)
    });
    
    it('resolve directory with absolute path', () => {
      expect(() => {
        const dir = Directory.withReadWritePermission(testRoot);
        dir.resolve('/absolute-path');
      }).toThrowError(`'/absolute-path' is not a relative path`)
    });
    
    it('resolve directory with file path', () => {
      expect(() => {
        const dir = Directory.withReadWritePermission(testRoot);
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
        dir.file('/readonly.txt');
      }).toThrowError(`'/readonly.txt' is not a relative path`)
    });
    
    it('get non-exist file', () => {
      expect(() => {
        const dir = Directory.withReadWritePermission(testRoot);
        dir.file('./file-not-exists.txt');
      }).toThrowError(`ENOENT: no such file or directory, access '${testRoot}/file-not-exists.txt'`)
    });
    
  });
  
  describe('# should able to', () => {
    
    it('get directory with read access', () => {
      const directory = Directory.withReadPermission(testRoot);
      expect(directory).toBeDefined();
      expect(directory.path).toBe(testRoot);
    });
    
    it('get directory with read/write access', () => {
      const directory = Directory.withReadWritePermission(testRoot);
      expect(directory).toBeDefined();
      expect(directory.path).toBe(testRoot);
    });
    
    it('get file with read access', () => {
      const directory = Directory.withReadPermission(testRoot);
      const file = directory.file('conf/settings.yml');
      expect(file).toBeDefined();
      expect(file).toBe(path.join(testRoot, 'conf/settings.yml'));
    });
    
    it('get file with read/write access', () => {
      const directory = Directory.withReadWritePermission(testRoot);
      const file = directory.file('conf/settings.yml');
      expect(file).toBeDefined();
      expect(file).toBe(path.join(testRoot, 'conf/settings.yml'));
    });
    
  });
  
});
