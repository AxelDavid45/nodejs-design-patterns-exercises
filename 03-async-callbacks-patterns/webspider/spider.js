import fs from "node:fs";
import path from "node:path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename } from "./utils.js";

function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) {
      return cb(err);
    }

    fs.writeFile(filename, contents, cb);
  });
}

function download(url, filename, cb) {
  console.log(`Downloading ${url} into ${filename}`);

  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err);
    }

    saveFile(filename, res.text, (err) => {
      if (err) {
        return cb(err);
      }

      console.log(`Downloaded and saved: ${url}`);
      cb(null, res.text);
    });
  });
}

export function spider(url, cb) {
  const filename = urlToFilename(url);

  fs.access(filename, (err) => {
    // ERROR No Entity/Entry
    if (!err || err.code !== "ENOENT") {
      return cb(null, filename, false);
    }

    download(url, filename, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, filename, true);
    });
  });
}
