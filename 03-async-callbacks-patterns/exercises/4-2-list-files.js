/* 4.2 List files recursively
Write a listNestedFiles(), a callback-style function 
that takes, as the input, the path to a directory in the local
filesystem and that asynchronously iterates over all the subdirectories
to eventually return a list of all the files discovered.
Bonus: avoid callback hell
*/
import { opendir, Dir } from "fs";

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
      console.log(`${next.name}`);
      return readNextDir(parent, cb);
    }

    if (next.isDirectory()) {
      console.log(`${next.name}`);
      // Here we need to iterate over recursive
      return readNextDir(parent, cb);
    }
  });
}

function listNestedFiles(dir, cb, maxNested) {
  if (typeof dir !== "string") {
    return process.nextTick(() => cb(new Error("Expected dir to be a string")));
  }

  opendir(dir, (err, dirent) => {
    if (err) {
      return cb(err);
    }

    console.log(dirent.path);
    readNextDir(dirent, cb);
  });
}

listNestedFiles(process.argv[2], (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Read Succesfully");
});
