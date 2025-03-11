import { readFile } from "fs";
const cache = new Map();

function consistentReadAsync(filename, cb) {
  if (cache.has(filename)) {
    // deferred execution
    process.nextTick(() => cb(cache.get(filename)));
  } else {
    readFile(filename, "utf-8", (err, data) => {
      cache.set(filename, data);
      cb(data);
    });
  }
}

function createFileReader(filename) {
  const listeners = [];
  consistentReadAsync(filename, (value) => {
    listeners.forEach((listener) => {
      listener(value);
    });
  });

  return {
    onDataReady: (listener) => {
      listeners.push(listener);
    },
  };
}

const reader1 = createFileReader("test.txt");
reader1.onDataReady((data) => {
  console.log("First call data:", data);

  const reader2 = createFileReader("test.txt");
  reader2.onDataReady((data) => {
    console.log("Second call data:", data);
  });
});
