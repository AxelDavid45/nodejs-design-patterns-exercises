import { EventEmitter } from "node:events";

// This was my solution but i think it's not the best one
// because i dont use setTimeout and the book says to use it
// even though this works
function Ticker(number, callback) {
  const emitter = new EventEmitter();

  process.nextTick(() => {
    emitter.emit("tick", "starts");
  });

  let ticksEmitted = 0;

  const idInterval = setInterval(() => {
    if (ticksEmitted < number) {
      ticksEmitted++;
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
}).on("tick", () => {
  console.log("Tick");
});
