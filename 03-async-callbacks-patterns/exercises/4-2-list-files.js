/* 4.2 List files recursively
Write a listNestedFiles(), a callback-style function 
that takes, as the input, the path to a directory in the local
filesystem and that asynchronously iterates over all the subdirectories
to eventually return a list of all the files discovered.
Bonus: avoid callback hell
*/
import { readdir } from "fs";
import { basename } from "path";

const GLOBAL_EXCLUSIONS = ["node_modules", ".DS_Store", ".git"];

function readSubdirectory(dir, cb) {
  return readdir(dir, (err, files) => {
    if (err) {
      if (err.code === "ENOTDIR") {
        const getFileName = basename(dir);
        return cb(null, true, [getFileName]);
      }
      return cb(err);
    }

    const filesFiltered = files.filter((f) => !GLOBAL_EXCLUSIONS.includes(f));

    return cb(null, false, filesFiltered);
  });
}

function list(dir, cb) {
  console.log(`Reading ${dir}`);
  const tmpFiles = [];
  let parentReading = [];
  let parentPosition = 0;

  function readnext(parent, currFiles, position) {
    console.table({ position: position, currFiles: currFiles.length });

    if (position > currFiles.length - 1) {
      if (parentPosition > parentReading.length - 1) {
        console.log(`read all files ${dir}`);
        return cb(null, tmpFiles);
      } else {
        console.table({ parentPosition, parentReading });
        parentPosition = parentPosition + 1;
        return readnext(dir, parentReading, parentPosition);
      }
    }

    console.log(`Reading ${currFiles[position]}`);

    if (!GLOBAL_EXCLUSIONS.includes(currFiles[position])) {
      let currPath = `${parent}/${currFiles[position]}`;
      readSubdirectory(currPath, (err, isFile, sbFiles) => {
        if (err) {
          return cb(err);
        }

        if (isFile) {
          console.log(`file ${sbFiles[0]}`);
          tmpFiles.push(sbFiles[0]);
          return readnext(parent, currFiles, position + 1, cb);
        }

        console.log(`directory ${currPath} length ${sbFiles.length}`);

        if (sbFiles.length) {
          return readnext(currPath, sbFiles, 0, cb);
        }

        return readnext(parent, currFiles, position + 1, cb);
      });
    } else {
      console.log(`Skipping ${currFiles[position]}`);

      return readnext(parent, currFiles, position + 1, cb);
    }
  }

  readSubdirectory(dir, (err, isFile, files) => {
    if (err) {
      return cb(err);
    }

    if (isFile) {
      tmpFiles.push(files[0]);
      return cb(null, tmpFiles);
    }

    console.log(files);
    if (files.length) {
      parentReading = files;

      console.log("parentReading start", parentReading);

      return readnext(dir, parentReading, 0, cb);
    }
  });

  // readdir(dir, (errMainDirectory, files) => {
  //   if (errMainDirectory) {
  //     if (errMainDirectory.code === "ENOTDIR") {
  //       console.warn(`Is not DIR: ${dir}`);
  //       const getFileName = basename(dir);

  //       tmpFiles.push(getFileName);

  //       return readnext(parentDirectory);
  //     }
  //     return cb(errMainDirectory);
  //   }

  //   parentDirectory.concat(files);

  //   console.log(`is DIR ${dir}`);

  //   return readnext(files, cb);
  // });
}

function listNestedFiles(dir, cb) {
  if (typeof dir !== "string") {
    return process.nextTick(() => cb(new Error("Expected dir to be a string")));
  }
  list(dir, cb);
}

listNestedFiles(process.argv[2], (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Files Array", files);
});
