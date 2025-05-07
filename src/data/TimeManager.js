import * as Cesium from "cesium";

export default class TimeManager {
    constructor(totalHours = 8, timeStep = 10) {
        this.totalSeconds = totalHours * 8
        this.timeStep = timeStep
        this.start = null
        this.stop = null

        this.initTime()
    }

    initTime() {
        this.start = JulianDate.fromDate(new Date());
        this.stop = JulianDate.addSeconds(
          this.start,
          this.totalSeconds,
          new CesiumJulianDate()
        )
    }
}