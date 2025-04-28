import * as Cesium from "cesium";
import * as satellite from "satellite.js";

function trackPosition(satrec, totalSeconds, timestepInSeconds, start) {
  const positionsOverTime = new Cesium.SampledPositionProperty();
  for (let i = 0; i < totalSeconds; i += timestepInSeconds) {
    const time = Cesium.JulianDate.addSeconds(
      start,
      i,
      new Cesium.JulianDate()
    );
    const jsDate = Cesium.JulianDate.toDate(time);
    const positionAndVelocity = satellite.propagate(satrec, jsDate);
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
    positionsOverTime.addSample(time, position);
  }

  return positionsOverTime
}

export default trackPosition;
