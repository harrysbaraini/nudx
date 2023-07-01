import { Listr, ListrContext, ListrRendererFactory, ListrTask, ListrTaskObject, ListrTaskWrapper } from 'listr2'

export type TaskContext = ListrContext
export type TaskListRenderer = 'simple' | 'verbose'
export type Task<Ctx = TaskContext> = ListrTask<Ctx>
export type TaskObject<Ctx = TaskContext> = ListrTaskWrapper<Ctx, ListrRendererFactory>

export class TaskList<Ctx = TaskContext> {
  private tasks: Task<Ctx>[];
  private isVerbose = false;
  private isConcurrent = false;
  protected parentTask?: TaskObject<Ctx>;

  constructor(tasks: Task<Ctx>[]) {
    this.tasks = tasks
  }

  static subTasks<Ctx = TaskContext>(parent: TaskObject<Ctx>, tasks: Task<Ctx>[]) {
    return (new TaskList<Ctx>(tasks)).parent(parent)
  }

  parent(parent: TaskObject<Ctx>) {
    this.parentTask = parent
    return this
  }

  verbose() {
    this.isVerbose = true;
    return this;
  }

  concurrent() {
    this.isConcurrent = true
    return this
  }

  run() {
    return this.build().run();
  }

  build() {
    if (this.parentTask) {
      return this.parentTask.newListr<Ctx>(this.tasks, {
        concurrent: this.isConcurrent,
      })
    }

    return new Listr<Ctx, TaskListRenderer, TaskListRenderer>(this.tasks, {
      concurrent: this.isConcurrent,
      renderer: this.isVerbose
        ? 'verbose'
        : 'simple',
      fallbackRenderer: this.isVerbose
        ? 'simple'
        : 'verbose',
    });
  }
}
