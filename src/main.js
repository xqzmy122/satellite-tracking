import * as Cesium from "cesium";
import * as satellite from "satellite.js";
import "cesium/Build/Cesium/Widgets/widgets.css";
import getTLEData from "./data/getTLEData.js";
// import loadModel from "./data/loadModel.js";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY4OGE0MS0xMmYxLTQwY2YtYTg4OC1kNDUxZmIyODU0NTYiLCJpZCI6Mjc4MzY3LCJpYXQiOjE3NDAzMDE3NzB9._w_PncfjQM56FZ69RBqUTHRu7iM4Iz7xU93cZjuRM_w";

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: await Cesium.createWorldTerrainAsync(),
});
// разнести по функциям
// Создать абстракцию типа Data gateway (отдельная функция, которая вам выдает данные для визуализации)
viewer.scene.globe.enableLighting = true;

const tleData = await getTLEData();
const [tleLine1, tleLine2] = tleData;

const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

const positionAndVelocity = satellite.propagate(satrec, new Date());
const gmst = satellite.gstime(new Date());
const coordinatesGeo = satellite.eciToGeodetic(
  positionAndVelocity.position,
  gmst
);
const lat = satellite.degreesLat(coordinatesGeo.latitude); // to radians
const lon = satellite.degreesLong(coordinatesGeo.longitude);
const alt = coordinatesGeo.height * 1000; // Высота в метрах

const totalSeconds = 60 * 60 * 8;
const timestepInSeconds = 10;
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(
  start,
  totalSeconds,
  new Cesium.JulianDate()
);
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.timeline.zoomTo(start, stop);
viewer.clock.multiplier = 40;
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

const positionsOverTime = new Cesium.SampledPositionProperty();
for (let i = 0; i < totalSeconds; i += timestepInSeconds) {
  const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
  const jsDate = Cesium.JulianDate.toDate(time);
  const positionAndVelocity = satellite.propagate(satrec, jsDate);
  const gmst = satellite.gstime(jsDate);
  const p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
  const position = Cesium.Cartesian3.fromRadians(
    p.longitude,
    p.latitude,
    p.height * 1000
  );
  positionsOverTime.addSample(time, position);
}

// const satEntity = viewer.entities.add({
//   name: 'MKS(ISS)',
//   position: positionsOverTime,
//   point: {
//   pixelSize: 10,
//   color: Cesium.Color.RED
//   },
//   label: {
//   text: "satellite",
//   font: "20px sans-serif",
//   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//   pixelOffset: new Cesium.Cartesian2(0, -10),
//  },
// })

async function loadModel() {
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

  viewer.trackedEntity = satelliteEntity;
}

loadModel()


// viewer.trackedEntity = satellitePoint;
