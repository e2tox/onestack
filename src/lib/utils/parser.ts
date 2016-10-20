import { File } from './directory'
import * as yaml from 'js-yaml';

export function parseYAML(file: File) {
  return yaml.load(file.readAll());
}

export function parseJSON(file: File) {
  return JSON.parse(file.readAll());
}
