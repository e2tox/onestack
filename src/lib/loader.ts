import * as path from 'path';
import { parseYAML, parseJSON } from './utils/parser';
import { Directory } from './utils/directory';
import { IsUndefined } from './utils/utils';

export function loadSettings(root: Directory) {
  
  const loader = new Loader();
  
  console.log();
  
  /**
   * Ensure NODE_ENV is present
   */
  const env = loader.checkEnvironment();
  const settings = {};
  
  /**
   * Load default settings
   */
  loader.applyEnvironmentSettings(root, settings, 'conf/settings.yaml');
  
  /**
   * Validate NODE_ENV and path default settings with environment settings
   */
  loader.applyEnvironmentSettings(root, settings, 'conf/' + env + '.yaml');
  
  /**
   * Load local environment settings
   */
  loader.applyEnvironmentSettings(root, settings, 'conf/' + env + '.local.yaml');
  
  /**
   * Load app version
   */
  loader.loadPackageVersion(root, settings);
  
  /**
   * This is the last chance to get mandatory configurations from environment variables.
   */
  loader.resolveAbsolutePath(root, settings);
  
  /**
   * Add system level settings
   */
  loader.setSystemVariable(root, settings, env);
  
  console.log();
  
  // freeze the settings
  return Object.freeze(settings);
}

class Loader {
  
  checkEnvironment() {
    if (!process.env['NODE_ENV']) {
      console.error('\x1b[33m', 'NODE_ENV is not defined! Using default production environment', '\x1b[0m');
      process.env['NODE_ENV'] = 'production';
    }
    else {
      console.log('\x1b[7m', 'Application loaded using the "' + process.env['NODE_ENV'] + '" configuration', '\x1b[0m');
    }
    return process.env['NODE_ENV'];
  }
  
  applyEnvironmentSettings(root, settings, filename) {

    let localSettingsFile;
  
    try {
    
      localSettingsFile = root.file(filename);

      try {
      
        let environmentSettings = parseYAML(localSettingsFile);
  
        console.log(`INFO: Applying local environment setting '${localSettingsFile.path}'...`);
        
        for (const key in environmentSettings) {
          if (environmentSettings.hasOwnProperty(key)) {
            if (environmentSettings[key] !== null) {
              settings[key] = environmentSettings[key];
            }
          }
        }
      }
      catch (err) {
        console.error(`ERROR: Error parsing '${err.file}', reason: '${err.message}', exiting...`);
        process.exit(1);
      }
    
    }
    catch (err) {
      console.log(`WARN: Local environment setting file '${err.file}' is not found, ignoring...`);
    }
    
  }
  
  loadPackageVersion(root, settings) {
    
    let packageFile;
  
    try {
      packageFile = root.file('package.json');
      try {
        const pkg = parseJSON(packageFile);
        settings.VERSION = pkg.version;
      }
      catch (err) {
        console.log(`WARN: Package file '${err.file}' parsing error, ignoring...`);
      }
    }
    catch (err) {
      console.log(`WARN: Package file '${err.file}' is not found, ignoring...`);
    }
    
  }
  
  resolveAbsolutePath(root, settings) {
    
    let fulfilled = true;
  
    const postfix = '_DIR';
    for (const key in settings) {
      if (settings.hasOwnProperty(key)) {
      
        if (!IsUndefined(process.env[key])) {
          console.log('Applying ' + key + ' from environment value `' + process.env[key] + '`');
          settings[key] = process.env[key];
        } else if (settings[key] === null) {
          fulfilled = false;
          console.error('ERROR: Missing environment variable: ' + key);
        }
      
        /**
         * Convert all relative path to absolute path
         */
        if (key.indexOf(postfix, key.length - postfix.length) !== -1) {
          const pathname = settings[key];
          if (pathname.length && pathname[0] === '/') {
            settings[key] = path.resolve(pathname);
          } else {
            settings[key] = root.resolve(pathname).path;
          }
        }
      
      }
    }
  
    if (!fulfilled) {
      console.error(`ERROR: Prerequisite environment variable is missing, exiting....`);
      process.exit(2);
    }
    
  }
  
  setSystemVariable(root, settings, env) {
    // set home dir to root
    settings['HOME_DIR'] = root.path;
    settings['ENV'] = env;
  }
  
}
