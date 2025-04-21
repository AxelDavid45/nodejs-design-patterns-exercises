import { saveFile } from "./webspider/spider.js";

function iterateSeries(collection, iteratorCallback, finalCallback) {
  if (!Array.isArray(collection)) {
    return process.nextTick(() =>
      finalCallback(new TypeError("First argument must be an array"))
    );
  }

  if (!collection.length) {
    return process.nextTick(finalCallback);
  }

  // let counter = 0;

  function iterate(index) {
    if (index === collection.length) {
      return finalCallback();
    }

    // change beetween setImmediate and process.nextTick
    iteratorCallback(collection[index], function (err) {
      if (err) {
        return finalCallback(err);
      }

      // counter++
      // if (counter % 1000 === 0) { setImmediate(() => iterate(index + 1)) }
      // else { process.nextTick(() => iterate(index + 1)); }
      process.nextTick(() => iterate(index + 1));
    });
  }

  process.nextTick(() => iterate(0));
}

const listOfFiles = ["readme.md", "augost.md", "mybook.md"];

iterateSeries(
  listOfFiles,
  (filename, cb) => saveFile(filename, "mitexto", cb),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log("files stored");
  }
);
