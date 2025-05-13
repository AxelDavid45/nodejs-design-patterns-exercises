import { spider } from "./spider.js";
import { TaskQueue } from "./taskQueue.js";
const url = process.argv[2];
const nesting = Number(process.argv[3], 10) || 1;
const concurrency = Number.parseInt(process.argv[4], 10) || 1;

const spiderQueue = new TaskQueue(concurrency);

spiderQueue.on("error", console.error);
spiderQueue.on("empty", () => console.log("Download Complete"));

spider(url, nesting, spiderQueue);
