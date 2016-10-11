import * as path from 'path';
import { parseYAML, parseJSON } from './utils/parser';
import { Directory } from './utils/directory';
import { IsUndefined } from './utils/utils';

export const NODE_ENV = 'NODE_ENV';

export function loadSettings(root: Directory) {
  
  let settings;
  
  console.log();
  
  /**
   * Load default settings
   */
  try {
    const defaultSettingsFile = root.file('conf/settings.yaml');
    settings = parseYAML(defaultSettingsFile);
    if (IsUndefined(settings)) {
      console.error(`ERROR: Main setting file '${defaultSettingsFile.path}' is empty, exiting...`);
      process.exit(1);
    }
  }
  catch (err) {
    console.error(`ERROR: Main setting file '${err.file}' is not found, exiting...`);
    process.exit(2);
  }
  
  /**
   * Validate NODE_ENV and load environment settings
   */
  if (testEnvironment(root)) {
    const environmentSettingsFile = root.file('conf/' + process.env[NODE_ENV] + '.yaml');
    const environmentSettings = parseYAML(environmentSettingsFile);
    for (var k in environmentSettings) {
      if (environmentSettings.hasOwnProperty(k)) {
        if (environmentSettings[k] !== null) {
          settings[k] = environmentSettings[k];
        }
      }
    }
  }
  
  /**
   * Load local environment settings
   */
  try {
    const environmentSettingsFile = root.file('conf/' + process.env[NODE_ENV] + '.local.yaml');
    const environmentSettings = parseYAML(environmentSettingsFile);
    for (var k in environmentSettings) {
      if (environmentSettings.hasOwnProperty(k)) {
        if (environmentSettings[k] !== null) {
          settings[k] = environmentSettings[k];
        }
      }
    }
  }
  catch (err) {
    console.log(`INFO: Local environment setting file '${err.file}' is not found, ignoring...`);
  }
  
  /**
   * Load app version
   */
  
  let packageFile;
  
  try {
    packageFile = root.file('package.json');
    try {
      const pkg = parseJSON(packageFile);
      settings.VERSION = pkg.version;
    }
    catch (err) {
      console.log(`INFO: Package file '${err.file}' parsing error, ignoring...`);
    }
  }
  catch (err) {
    console.log(`INFO: Package file '${err.file}' is not found, ignoring...`);
  }
    
  /**
   * This is the last chance to get mandatory configurations from environment variables.
   */
  var fulfilled = true;
  
  var dirPostfix = '_DIR';
  for (var key in settings) {
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
      if (key.indexOf(dirPostfix, key.length - dirPostfix.length) !== -1) {
        var dir = settings[key];
        if (dir.length && dir[0] === '/') {
          settings[key] = path.resolve(dir);
        } else {
          settings[key] = root.resolve(dir).path;
        }
      }
      
    }
  }
  
  if (!fulfilled) {
    throw Error('Prerequisite environment variable is missing');
  }
  
  // set home dir to root
  settings.HOME_DIR = root.path;
  
  console.log();
  
  // freeze the settings
  return Object.freeze(settings);
}


function testEnvironment(root: Directory): boolean {
  
  // Check NODE_ENV
  if (!process.env[NODE_ENV]) {
    console.error('\x1b[33m', 'NODE_ENV is not defined! Using default production environment', '\x1b[0m');
    process.env[NODE_ENV] = 'production';
  }
  
  /**
   * Before we begin, lets set the environment variable
   * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
   */
  try {
    root.file('conf/' + process.env[NODE_ENV] + '.yaml');
    console.log('\x1b[7m', 'Application loaded using the "' + process.env[NODE_ENV] + '" environment configuration', '\x1b[0m');
    return true;
  }
  catch (err) {
    console.log('\x1b[33m', 'No configuration file found for "' + process.env[NODE_ENV] + '", using environment variables instead', '\x1b[0m');
    return false;
  }
  
}
