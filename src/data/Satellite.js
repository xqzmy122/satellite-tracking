import * as Cesium from "cesium";
import * as satellite from "satellite.js";

export default class Satellite {
  constructor(satelliteURI, satelliteId = 25544) {
    this.tleLine1 = null
    this.tleLine2 = null
    this.satrec = null
    this.satelliteURI = satelliteURI
    this.position = null
    this.requestLink = `https://tle.ivanstanojevic.me/api/tle/${satelliteId}`
  }

  async getTLEData() {
    try {
      const response = await fetch(this.requestLink)
      const data = await response.json()

      return [data.line1, data.line2]
    }
    catch (error) {
      console.error('Error in getTLEData: ', error)
    }
  }

  async parseTLEData() {
    [this.tleLine1, this.tleLine2] = await this.getTLEData()
    this.satrec = satellite.twoline2satrec(this.tleLine1, this.tleLine2)
  }

  calculatePositionOverTime(totalSeconds, timestepInSeconds, start) {
    this.position = new Cesium.SampledPositionProperty();
    for (let i = 0; i < totalSeconds; i += timestepInSeconds) {
      const time = Cesium.JulianDate.addSeconds(
        start,
        i,
        new Cesium.JulianDate()
      );
      const jsDate = Cesium.JulianDate.toDate(time);
      const positionAndVelocity = satellite.propagate(this.satrec, jsDate);
      const gmst = satellite.gstime(jsDate);
      const positionGeo = satellite.eciToGeodetic(
        positionAndVelocity.position,
        gmst
      );
      const position = Cesium.Cartesian3.fromRadians(
        positionGeo.longitude,
        positionGeo.latitude,
        positionGeo.height * 1000
      );
      this.position.addSample(time, position);
    }
    
    return this.position
  }
}