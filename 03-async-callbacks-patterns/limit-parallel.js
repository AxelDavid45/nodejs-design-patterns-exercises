// Example limit parallel async tasks because it can be an issue if
// we run a lot of async tasks at the same time. We might starve the
// system of resources. This is a simple implementation of a limit
const tasks = [];
const concurrency = 2;
let running = 0;
let completed = 0;
let index = 0;

function next() {
  while (running < concurrency && index < tasks.length) {
    const task = tasks[index++];
    task(() => {
      if (++completed === tasks.length) {
        return finish();
      }
      running--;
      next();
    });
    running++;
  }
}

function finish() {}
