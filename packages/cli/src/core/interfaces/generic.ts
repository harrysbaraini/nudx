import { Listr, ListrContext, ListrTask, ListrOptions, ListrRendererValue } from 'listr2'

export interface Dictionary<T = unknown> {
  [key: string]: T
}

export type Json = Dictionary<unknown> | Array<unknown>

export type TaskContext = ListrContext
export type TaskList<Ctx = TaskContext> = Listr<Ctx>
export type TaskListOptions<Ctx = TaskContext> = ListrOptions<Ctx>
export type TaskListRenderer = ListrRendererValue
export type Task<Ctx = TaskContext> = ListrTask<Ctx>
