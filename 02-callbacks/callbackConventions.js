import { readFile } from "fs";
/**
 * Error as first argument
 * callback as last argument
 *
 * example: read json file
 */

function readJSON(filename, callback) {
  readFile(filename, "utf-8", (err, data) => {
    let parsed;
    if (err) {
      // propagate the error and exit the current function
      return callback(err);
    }

    try {
      parsed = JSON.parse(data);
    } catch (error) {
      // propagate error if it is thrown
      return callback(error);
    }

    // no errors, propagate just the data
    callback(null, parsed);
  });
}

function readJSONThrows(filename, callback) {
  readFile(filename, "utf-8", (err, data) => {
    if (err) {
      return callback(err);
    }
    // if there is an error, this will never be catched by the try-catch block
    // because it is executed in a different context
    // the process will exit with an uncaught exception
    callback(null, JSON.parse(data));
  });
}


// example anti-pattern
try {
  readJSONThrows(import.meta.dirname + "/data/example.json", (err, data) =>
    console.error("Error from reading file", err)
  );
} catch (error) {
  console.error("THIS will never catch the JSON parsing exception");
}
