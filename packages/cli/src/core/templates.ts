import { Dictionary } from './interfaces/generic';

import Handlebars = require('handlebars');

export type Template = TemplateSpecification;

export const Renderer = {
  build(template: Template, variables: Dictionary = {}): string {
    return Handlebars.template(template)(variables);
  },
};

export function objToList(obj: Dictionary): Array<Dictionary> {
  return Object.entries(obj).map(([key, value]) => {
    return { key, value };
  });
}
