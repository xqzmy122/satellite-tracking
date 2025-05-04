import { CallbackProperty } from "cesium";
import { JulianDate } from "cesium";
import { Quaternion } from "cesium";
import { Cartesian3 } from "cesium";

function setSatelliteRotation(entity, start) {
  const rpm = 10; // Оборотов в минуту
  const spinRate = (rpm * 2 * Math.PI) / 60; // В радианах/сек
  
  entity.orientation = new CallbackProperty(time => {
      const angle = spinRate * JulianDate.secondsDifference(time, start);
      return Quaternion.fromAxisAngle(Cartesian3.UNIT_X, angle);
  }, false);
}

export default setSatelliteRotation