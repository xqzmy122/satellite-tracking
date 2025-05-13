import {timestepInSeconds, totalSeconds, start} from './timeSetting.js'

export default async function checkAndUpdateSatellite(satellites) {
  console.log(satellites)
  for (const sat of satellites) {
    const [newTleLine1, newTleLine2] = await sat.instance.getTLEData()

    if ([newTleLine1, newTleLine2].toString() !== [sat.instance.tleLine1, sat.instance.tleLine2].toString()) {
      sat.instance.satrec = sat.instance.twoline2satrec(newTleLine1, newTleLine2)
      sat.instance.calculatePositionOverTime(totalSeconds, timestepInSeconds, start)
    }
  }
}