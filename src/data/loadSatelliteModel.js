// Load the glTF model from Cesium ion.
import * as Cesium from "cesium";
import setSatelliteRotation from "../SatelliteRotation";

async function loadModel(viewer, start, stop, positionsOverTime) {
  const satelliteUri = await Cesium.IonResource.fromAssetId(3159015); // Cделать в качестве передаваемого параметра (Проверить возможность импорта моделей в разных форматах)

  const satelliteEntity = viewer.entities.add({
   
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({ start: start, stop: stop }),
    ]),
    position: positionsOverTime,
    model: { uri: satelliteUri, scale: 10000 }, // Attach the 3D model instead of the green point.
    orientation: new Cesium.VelocityOrientationProperty(positionsOverTime), // Automatically compute the orientation from the position.
    path: new Cesium.PathGraphics({ width: 1 }),
  });

  setSatelliteRotation(satelliteEntity, start)
  viewer.trackedEntity = satelliteEntity;
}

export default loadModel
