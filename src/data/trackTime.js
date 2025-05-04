import { JulianDate } from "cesium";

const timestepInSeconds = 10;
const totalSeconds = 60 * 60 * 8;
const start = JulianDate.fromDate(new Date());
const stop = JulianDate.addSeconds(
  start,
  totalSeconds,
  new JulianDate()
)

export {timestepInSeconds, totalSeconds, start, stop}