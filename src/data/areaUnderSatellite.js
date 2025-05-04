import * as Cesium from "cesium";

function createAreaUnderSatellite(viewer, positionsOverTime) {
    const redEllipse = viewer.entities.add({
        position: positionsOverTime,
        name: "Red ellipse on surface",
        ellipse: {
          semiMinorAxis: 400000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.RED.withAlpha(0.5),
        },  
      });

      return redEllipse
}

export default createAreaUnderSatellite