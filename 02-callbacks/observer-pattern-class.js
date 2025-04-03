import { EventEmitter } from "node:events";
import { readFile } from "node:fs";
import { join } from "node:path";

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    setImmediate(() => this.emit("start", this.files));
    for (const file of this.files) {
      readFile(file, "utf-8", (err, content) => {
        if (err) {
          return this.emit("error", err);
        }

        this.emit("fileread", file);

        const match = content.match(this.regex);
        if (match) {
          match.forEach((elem) => this.emit("found", file, elem));
        }
      });
    }
    return this;
  }
}

const findFileRegex = new FindRegex(/hello \w+/g);

findFileRegex
  .addFile(join(import.meta.dirname, "data", "hello-world.txt"))
  .addFile(join(import.meta.dirname, "data", "example.json"))
  .find()
  .on("fileread", (file) => console.log(`${file} was read`))
  .on("found", (file, match) => console.log(`Matched "${match}" in ${file}`))
  .on("error", (err) => console.error(`Error emitted ${err.message}`))
  .on("start", (files) => {
    files.forEach((file) => console.log(`Searching in ${file}`));
  });
