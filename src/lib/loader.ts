import * as path from 'path';
import { parseYAML, parseJSON } from './utils/parser';
import { Directory } from './utils/directory';
import { IsUndefined } from './utils/utils';

export function LoadSettings(root: Directory, confDir: string, autoCreateDir: boolean) {

  const loader = new Loader();

  console.log();

  /**
   * Ensure NODE_ENV is present
   */
  const env = loader.checkEnvironment();
  const conf = root.resolve(confDir);
  const settings = {};

  /**
   * Load default settings
   */
  loader.applyEnvironmentSettings(conf, settings, 'settings.yaml');

  /**
   * Validate NODE_ENV and path default settings with environment settings
   */
  loader.applyEnvironmentSettings(conf, settings, env + '.yaml');

  /**
   * Load local environment settings
   */
  loader.applyEnvironmentSettings(conf, settings, env + '.local.yaml');

  /**
   * Load app version
   */
  loader.loadPackageVersion(root, settings);

  /**
   * This is the last chance to get mandatory configurations from environment variables.
   */
  loader.resolveAbsolutePath(root, settings, autoCreateDir);

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

  applyEnvironmentSettings(root: Directory, settings: any, filename: string): boolean {

    let localSettingsFile;
    let environmentSettings;

    try {
      localSettingsFile = root.file(filename);
    }
    catch (err) {
      console.log(`WARN: Application settings file '${err.file}' is not found, ignoring...`);
      return false;
    }

    try {
      environmentSettings = parseYAML(localSettingsFile);
    }
    catch (err) {
      console.error(`ERROR: Error parsing '${localSettingsFile.path}', reason: '${err.message}', exiting...`);
      throw err;
    }

    if (typeof environmentSettings !== 'object') {
      const err = new Error(`'${localSettingsFile.path}' is not validate settings file`);
      console.error(err.message);
      throw err;
    }

    const keys = [];
    for (const key in environmentSettings) {
      if (environmentSettings.hasOwnProperty(key)) {
        if (environmentSettings[key] !== null) {
          settings[key] = environmentSettings[key];
          keys.push(key);
        }
      }
    }
    console.log(`INFO: Applied ${keys.length} key(s) from '${localSettingsFile.path}'`);
    return true;
  }

  loadPackageVersion(root: Directory, settings: any) {

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

  resolveAbsolutePath(root: Directory, settings: any, autoCreateDir: boolean) {

    let fulfilled = true;

    const postfix = '_DIR';

    for (const key in settings) {
      if (settings.hasOwnProperty(key)) {

        /**
         * Set undefined settings from environment
         */
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
          const value = settings[key].split(':');
          const pathname = value[0];
          const permission = value[1] === 'rw' ? 'rw' : 'ro';
          const absolutePathname = path.resolve(root.path, pathname);
          // create dir if not exists
          if (autoCreateDir) {
            Directory.mkdir(absolutePathname);
            console.log('mkdir', absolutePathname);
          }
          // resolve this directory with permission
          if (permission === 'rw') {
            settings[key] = Directory.withReadWritePermission(absolutePathname).path;
          }
          else if (permission === 'ro') {
            settings[key] = Directory.withReadPermission(absolutePathname).path;
          }
        }
      }
    }

    if (!fulfilled) {
      const err = new Error('ERROR: Prerequisite environment variable is missing, exiting....');
      console.error(err.message);
      throw err;
    }

  }

  setSystemVariable(root: Directory, settings: any, env: string) {
    // set home dir to root
    settings['HOME_DIR'] = root.path;
    settings['ENV'] = env;
  }

}
