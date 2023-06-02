export interface Dictionary<T = unknown> {
  [key: string]: T;
}

export type Json = Dictionary<unknown> | Array<unknown>;
