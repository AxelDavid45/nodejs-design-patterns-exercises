import { EventEmitter } from "node:events";

export class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.queue = [];
    this.running = 0;
    this.concurrency = concurrency;
  }

  pushTask(task) {
    this.queue.push(task);
    process.nextTick(this.next.bind(this));
    return this;
  }

  next() {
    if (this.running === 0 && this.queue.length === 0) {
      return this.emit("empty");
    }

    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();

      if (task) {
        task((err) => {
          if (err) {
            this.emit("error", err);
          }

          this.running--;
          process.nextTick(this.next.bind(this));
        });
        this.running++;
      }
    }
  }
}
