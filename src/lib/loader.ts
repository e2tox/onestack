import * as fs from 'fs';
import * as path from 'path';
import { parseYAML, parseJSON } from './utils/parser';
import { Directory, File } from './utils/directory';
import { ObjectEntries } from './utils/utils';
import { LogLevel } from './log';
import { IBasicSettings } from './settings';

export class Loader<T extends IBasicSettings> {

  private _settings: T;

  private constructor(private _env: string, private _root: Directory, private _conf: Directory) {
    this._settings = {
      NAME: 'app',
      VERSION: '0.0.0',
      ENV: _env,
      HOME_DIR: _root.path,
      LOG_DIR: 'logs',
      LOG_CONSOLE: true,
      LOG_CONSOLE_LEVEL: LogLevel.Debug,
      LOG_ROTATE: true,
      LOG_ROTATE_LEVEL: LogLevel.Warn,
      LOG_ROTATE_PERIOD: '1d',
      LOG_ROTATE_MAX: 30
    } as T;
  };

  public static LoadSettings<T extends IBasicSettings>(root: Directory, confDir: string, autoCreateDir: boolean): T {

    console.log();

    /**
     * Ensure NODE_ENV is present
     */
    const env = this.CheckEnvironment();
    const conf = root.resolve(confDir);
    const loader = new Loader<T>(env, root, conf);

    /**
     * Load default settings
     */
    loader.applyFileSettings('settings.yaml');

    /**
     * Validate NODE_ENV and path default settings with environment settings
     */
    loader.applyFileSettings(env + '.yaml');

    /**
     * Load local environment settings
     */
    loader.applyFileSettings(env + '.local.yaml');

    /**
     * Load app version
     */
    loader.applyPackageInfo();

    /**
     * Apply missing settings from environment
     */
    loader.applyEnvironmentSettings();

    /**
     * Resolve _DIR to absolute path
     */
    loader.resolveAbsolutePath(autoCreateDir);

    /**
     * Resolve _FILE to absolute path
     */
    loader.resolveAbsoluteFile();

    console.log();

    // freeze the settings
    return Object.freeze(loader._settings);
  }

  public static CheckEnvironment(): string {
    if (!process.env['NODE_ENV']) {
      console.error('\x1b[33m', 'NODE_ENV is not defined! Using default production environment', '\x1b[0m');
      process.env['NODE_ENV'] = 'production';
    }
    else {
      console.log('\x1b[7m', 'Application loaded using the "' + process.env['NODE_ENV'] + '" configuration', '\x1b[0m');
    }
    return process.env['NODE_ENV'];
  }

  applyFileSettings(filename: string): boolean {

    let localSettingsFile;
    let environmentSettings;

    try {
      localSettingsFile = this._conf.file(filename);
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
    for (let [key, value] of ObjectEntries(environmentSettings)) {
      this._settings[key] = value;
      keys.push(key);
    }
    console.log(`INFO: Applied ${keys.length} key(s) from '${localSettingsFile.path}'`);
    return true;
  }

  applyPackageInfo() {

    let packageFile;

    try {
      packageFile = this._root.file('package.json');
      try {
        const pkg = parseJSON(packageFile);
        this._settings.VERSION = pkg.version || this._settings.VERSION;
        this._settings.NAME = pkg.name || this._settings.NAME;
      }
      catch (err) {
        console.log(`WARN: Package file '${packageFile}' parsing error, ignoring...`);
      }
    }
    catch (err) {
      console.log(`WARN: Package file '${err.file}' is not found, ignoring...`);
    }

  }

  applyEnvironmentSettings() {

    let fulfilled = true;

    for (let [key, value] of ObjectEntries(this._settings)) {
      if (process.env[key] != null) {
        console.log('Applying ' + key + ' from environment value `' + process.env[key] + '`');
        this._settings[key] = process.env[key];
      } else if (value == null) {
        fulfilled = false;
        console.error('ERROR: Missing environment variable: ' + key);
      }
    }

    if (!fulfilled) {
      const err = new Error('ERROR: Prerequisite environment variable is missing, exiting...');
      console.error(err.message);
      throw err;
    }

  }

  resolveAbsolutePath(autoCreateDir: boolean) {

    const postfix = '_DIR';

    if (autoCreateDir) {
      console.log('WARN: Auto create directory is ON, all missing directory in the configuration ' +
        'will be created automatically.');
    }

    for (let [key, value] of ObjectEntries(this._settings)) {
      /**
       * Convert all relative path to absolute path
       */
      if (key.indexOf(postfix, key.length - postfix.length) !== -1 && value.split) {
        const dirs = value.split(':');
        const pathname = dirs[0];
        const permission = dirs[1] === 'rw' ? 'rw' : 'ro';
        const absolutePathname = path.resolve(this._root.path, pathname);
        // create dir if not exists
        if (autoCreateDir && Directory.mkdir(absolutePathname)) {
          console.log(`INFO: Created directory '${absolutePathname}'`);
        }
        // resolve this directory with permission
        if (permission === 'rw') {
          this._settings[key] = Directory.withReadWritePermission(absolutePathname).path;
        }
        else {
          this._settings[key] = Directory.withReadPermission(absolutePathname).path;
        }
      }
    }

  }

  resolveAbsoluteFile() {
    const postfix = '_FILE';

    for (let [key, value] of ObjectEntries(this._settings)) {
      /**
       * Convert all relative file path to absolute path
       */
      if (key.indexOf(postfix, key.length - postfix.length) !== -1 && value.split) {

        const dirs = value.split(':');
        const pathname = dirs[0];
        const permission = dirs[1];
        if (permission === 'rw') {
          this._settings[key] = File.resolve(this._root, pathname, fs.constants.R_OK | fs.constants.W_OK);
        }
        else if (permission === 'ro') {
          this._settings[key] = File.resolve(this._root, pathname, fs.constants.R_OK);
        }
        else {
          this._settings[key] = path.resolve(this._root.path, pathname);
        }
      }
    }

  }
}
