import fs from "node:fs";
import path from "node:path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { getPageLinks, urlToFilename } from "./utils.js";

export function saveFile(filename, contents, cb) {
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

function spiderLinks(currentUrl, body, nesting, queue) {
  if (nesting === 0) {
    return;
  }

  const links = getPageLinks(currentUrl, body);

  if (!links.length) {
    return;
  }

  links.forEach((link) => spider(link, nesting - 1, queue));

  // This was implementes sequential execution.
  // function iterate(index) {
  //   if (index === links.length) {
  //     return cb(null, currentUrl, true);
  //   }

  //   spider(links[index], nesting - 1, function (err) {
  //     if (err) {
  //       return cb(err);
  //     }
  //     iterate(index + 1);
  //   });
  // }

  // iterate(0);
}

const spidering = new Set();

export function spider(url, nesting, queue) {
  if (spidering.has(url)) {
    return;
  }

  spidering.add(url);

  queue.pushTask((done) => {
    spiderTask(url, nesting, queue, done);
  });
}

function spiderTask(url, nesting, queue, cb) {
  const filename = urlToFilename(url);

  fs.readFile(filename, "utf8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") return cb(err);

      // the file doesn't exist, download it
      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }

        spiderLinks(url, requestContent, nesting, queue);
        return cb();
      });
    }

    spiderLinks(url, fileContent, nesting, queue);
    return cb();
  });
}
