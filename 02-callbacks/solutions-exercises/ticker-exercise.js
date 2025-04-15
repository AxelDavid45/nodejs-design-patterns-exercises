import { EventEmitter } from "node:events";

//3.3 This was my solution but i think it's not the best one
// because i dont use setTimeout and the book says to use it
// even though this works

// 3.4 modify the function created in exercise 3-3 so that
// it produces an error if the timestamp at the moment of a tick is divisible by 5
function Ticker(number, callback) {
  const emitter = new EventEmitter();

  process.nextTick(() => {
    const timestamp = Date.now();
    if (timestamp % 5 === 0) {
      return emitter.emit("error", new Error("Timestamp is divisible by 5"));
    }

    emitter.emit("tick", "starts");
  });

  let ticksEmitted = 0;

  const idInterval = setInterval(() => {
    if (ticksEmitted < number) {
      ticksEmitted++;
      const timestamp = Date.now();
      const divisible = timestamp % 5 === 0;

      if (divisible) {
        const error = new Error("Timestamp is divisible by 5");
        callback(error);
        return emitter.emit("error", error);
      }

      emitter.emit("tick");
    } else {
      clearInterval(idInterval);
      callback(ticksEmitted);
    }
  }, 50);

  return emitter;
}

const TIME = 10;

Ticker(TIME, (ticksEmitted) => {
  console.log(`Emitted ${ticksEmitted} ticks`);
})
  .on("tick", () => {
    console.log("Tick");
  })
  .on("error", (err) => {
    console.error(`Error emitted ${err.message}`);
  });
