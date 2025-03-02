import * as Cesium from "cesium"; 
import * as satellite from 'satellite.js'
import "cesium/Build/Cesium/Widgets/widgets.css"; 

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY4OGE0MS0xMmYxLTQwY2YtYTg4OC1kNDUxZmIyODU0NTYiLCJpZCI6Mjc4MzY3LCJpYXQiOjE3NDAzMDE3NzB9._w_PncfjQM56FZ69RBqUTHRu7iM4Iz7xU93cZjuRM_w";

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: await Cesium.createWorldTerrainAsync(),
});

viewer.scene.globe.enableLighting = true;
const tleLine1 = '1 25544U 98067A   21121.52590485  .00001448  00000-0  34473-4 0  9997',
    tleLine2 = '2 25544  51.6435 213.5204 0002719 305.2287 173.7124 15.48967392281368'; 

const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

const positionAndVelocity = satellite.propagate(satrec, new Date())
const gmst = satellite.gstime(new Date())
const coordinatesGeo = satellite.eciToGeodetic(positionAndVelocity.position, gmst)
const lat = satellite.degreesLat(coordinatesGeo.latitude); // to radians
const lon = satellite.degreesLong(coordinatesGeo.longitude);
const alt = coordinatesGeo.height * 1000; // Высота в метрах

const totalSeconds = 60 * 60 * 8;
const timestepInSeconds = 10;
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.timeline.zoomTo(start, stop);
viewer.clock.multiplier = 40;
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

const positionsOverTime = new Cesium.SampledPositionProperty();
  for (let i = 0; i < totalSeconds; i+= timestepInSeconds) {
    const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
    const jsDate = Cesium.JulianDate.toDate(time);
    const positionAndVelocity = satellite.propagate(satrec, jsDate);
    const gmst = satellite.gstime(jsDate);
    const p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
    const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
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
  // Load the glTF model from Cesium ion.
  const satelliteUri = await Cesium.IonResource.fromAssetId(3159015);
  console.log("Модель загружена:", satelliteUri); // Проверяем, загружается ли ресурс

  const satelliteEntity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ]),
    position: positionsOverTime,
    // Attach the 3D model instead of the green point.
    model: { uri: satelliteUri, scale: 10000 },
    // Automatically compute the orientation from the position.
    orientation: new Cesium.VelocityOrientationProperty(positionsOverTime),    
    path: new Cesium.PathGraphics({ width: 1 })
  });
  
  viewer.trackedEntity = satelliteEntity
}

loadModel();

// viewer.trackedEntity = satellitePoint;
