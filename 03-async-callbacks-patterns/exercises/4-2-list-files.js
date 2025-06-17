/* 4.2 List files recursively
Write a listNestedFiles(), a callback-style function 
that takes, as the input, the path to a directory in the local
filesystem and that asynchronously iterates over all the subdirectories
to eventually return a list of all the files discovered.
Bonus: avoid callback hell
*/
import { opendir, Dir } from "fs";

function startReadingDirectory(dir, cb) {
  opendir(dir, { encoding: "utf-8" }, (err, dirent) => {
    if (err) {
      return cb(err);
    }

    readNextDir(dirent, cb);
  });
}

/**
 *
 * @param {Dir} parent
 * @param {*} cb
 * @returns
 */
function readNextDir(parent, cb) {
  parent.read((err, next) => {
    if (err) {
      return cb(err);
    }

    if (!next) {
      return parent.close((err) => {
        if (err) {
          return cb(err);
        }

        return cb();
      });
    }

    if (next.isFile()) {
      console.log(`file: ${next.name}`);
      return readNextDir(parent, cb);
    }

    if (next.isDirectory()) {
      if (next.name !== "node_modules") {
        console.log(`${next.parentPath}/${next.name}`);
        return startReadingDirectory(`${next.parentPath}/${next.name}`, () => {
          return readNextDir(parent, cb);
        });
      }
      return readNextDir(parent, cb);
      // return readNextDir(parent, cb);

      // Here we need to iterate over recursive
    }
  });
}

function listNestedFiles(dir, cb, maxNested) {
  if (typeof dir !== "string") {
    return process.nextTick(() => cb(new Error("Expected dir to be a string")));
  }

  startReadingDirectory(dir, cb);
}

listNestedFiles(process.argv[2], (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
