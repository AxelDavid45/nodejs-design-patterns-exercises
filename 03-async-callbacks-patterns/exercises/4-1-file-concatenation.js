/* Write the implementation of concatFiles(),
a callback-style function that takes two or more paths to text files in
the filesystem and a destination file:

this function must copy the contents of every source file into the destination file
respecting the order of the files, as provided by the arguments list. 

Example: If a file contains foo and the second file contains bar, 
the function should write foobar. 
*/

import { open, close, appendFile, readFile } from "fs";

function appendData(files, index, fd, cb) {
  readFile(files[index], (readFileErr, data) => {
    console.debug("reading file", files[index]);

    if (readFileErr) {
      return cb(readFileErr);
    }

    appendFile(fd, data, (appendErr) => {
      if (appendErr) {
        return cb(appendErr);
      }

      if (index === files.length - 1) {
        close(fd, (err) => {
          if (err) {
            throw err;
          }
          return cb(null);
        });
      } else {
        appendData(files, index + 1, fd, cb);
      }
    });
  });
}

/**
 *
 * @param {Array} files
 * @param {String} dest
 * @param {Function} cb
 */
function concatFiles(files, dest, cb) {
  // create dest file.
  open(dest, "w", (err, fd) => {
    if (err) {
      console.warn("Error al abrir el archivo");
      return cb(err);
    }

    appendData(files, 0, fd, cb);
  });
}

concatFiles(
  [
    "./data/file1.txt",
    "./data/file2.txt",
    "./data/file3.txt",
    "./data/file4.txt",
    "./data/file1.txt",
    "./data/file2.txt",
    "./data/file3.txt",
    "./data/file4.txt",
    "./data/file1.txt",
    "./data/file2.txt",
    "./data/file3.txt",
    "./data/file4.txt",
    "./data/file1.txt",
    "./data/file2.txt",
    "./data/file3.txt",
    "./data/file4.txt",
  ],
  "output.txt",
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log("Archivo output generado");
  }
);
