import { join } from 'path';
import { readFile } from './filesystem';
import { CLI_TEMPLATES_PATH } from './flags';
import { Dictionary } from './types';
import Handlebars = require('handlebars');

export interface Template extends TemplateSpecification { };

export const Renderer = {
  build(template: Template, variables: Dictionary = {}): string {
    return Handlebars.template(template)(variables);
  }
}

export function objToList(obj: Dictionary): Array<Dictionary> {
  return Object.entries(obj).map(([key, value]) => {
    return { key, value };
  });
}
