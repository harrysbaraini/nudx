import { Dictionary } from './interfaces/generic.js'
import Handlebars from 'handlebars'

export type Template = TemplateSpecification

export const Renderer = {
  build(template: Template, variables: Dictionary = {}): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return Handlebars.template(template)(variables) as string
  },
}

export function objToList(obj: Dictionary): Array<Dictionary> {
  return Object.entries(obj).map(([key, value]) => {
    return { key, value }
  })
}
