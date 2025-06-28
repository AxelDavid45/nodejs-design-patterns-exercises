/* 4.2 List files recursively
Write a listNestedFiles(), a callback-style function 
that takes, as the input, the path to a directory in the local
filesystem and that asynchronously iterates over all the subdirectories
to eventually return a list of all the files discovered.
Bonus: avoid callback hell
*/
import { opendir, Dir } from "fs";

const GLOBAL_EXCLUSIONS = ["node_modules"];
const filesFound = [];

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
      // On error, close handle then propagate
      return parent.close(() => cb(err));
    }

    if (!next) {
      return parent.close((err) => {
        if (err) {
          return cb(err);
        }

        return cb(null, filesFound);
      });
    }

    if (next.isFile()) {
      filesFound.push(next.name);
      return readNextDir(parent, cb);
    }

    if (next.isDirectory()) {
      if (!GLOBAL_EXCLUSIONS.includes(next.name)) {
        return startReadingDirectory(
          `${next.parentPath}/${next.name}`,
          (err) => {
            if (err) return cb(err);
            return readNextDir(parent, cb);
          }
        );
      }
      return readNextDir(parent, cb);
    }
  });
}

function listNestedFiles(dir, cb, maxNested) {
  if (typeof dir !== "string") {
    return process.nextTick(() => cb(new Error("Expected dir to be a string")));
  }

  startReadingDirectory(dir, cb);
}

listNestedFiles(process.argv[2], (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Files Array", filesFound);
});
