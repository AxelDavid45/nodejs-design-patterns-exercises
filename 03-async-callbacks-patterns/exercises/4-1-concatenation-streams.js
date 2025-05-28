import { createReadStream, createWriteStream } from "fs";

/**
 * Concatenates multiple files using streams (callback-style)
 * @param {Array<string>} files - Array of file paths to concatenate
 * @param {string} dest - Destination file path
 * @param {Function} cb - Callback function (err) => void
 */
function concatFiles(files, dest, cb) {
  if (!files || files.length === 0) {
    return cb(new Error("No files provided"));
  }

  const writeStream = createWriteStream(dest);
  let currentIndex = 0;
  let hasErrored = false;

  // Handle write stream errors
  writeStream.on("error", (err) => {
    if (!hasErrored) {
      hasErrored = true;
      cb(err);
    }
  });

  // Called when all files are processed successfully
  writeStream.on("finish", () => {
    if (!hasErrored) {
      cb(null);
    }
  });

  function processNextFile() {
    if (currentIndex >= files.length) {
      // All files processed, close the write stream
      writeStream.end();
      return;
    }

    const currentFile = files[currentIndex];
    const readStream = createReadStream(currentFile);

    // Handle read stream errors
    readStream.on("error", (err) => {
      if (!hasErrored) {
        hasErrored = true;
        writeStream.destroy(); // Clean up write stream
        cb(err);
      }
    });

    // When this file is completely read, move to the next one
    readStream.on("end", () => {
      currentIndex++;
      processNextFile();
    });

    // Pipe to write stream without ending it
    readStream.pipe(writeStream, { end: false });
  }

  // Start processing the first file
  processNextFile();
}

// Test the implementation
concatFiles(["./data/file5.jpg"], "output_streams.jpg", (err) => {
  if (err) {
    console.error("Error concatenating files:", err.message);
    process.exit(1);
  }
  console.log("Files concatenated successfully using streams!");
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err.message, err.stack);
  process.exit(1);
});
