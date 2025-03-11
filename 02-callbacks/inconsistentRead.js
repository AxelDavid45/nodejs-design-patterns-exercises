import { readFile } from "fs";
const cache = new Map();

function inconsistentRead(filename, cb) {
  if (cache.has(filename)) {
    console.log("Reading from cache");
    // setImmediate(() => cb(cache.get(filename)));
    cb(cache.get(filename));
  } else {
    readFile(filename, "utf-8", (err, data) => {
      console.log("Reading file:", filename);
      cache.set(filename, data);
      cb(data);
    });
  }
}

function createFileReader(filename) {
  const listeners = [];
  inconsistentRead(filename, (value) => {
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
