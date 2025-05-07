// import "cesium/Build/Cesium/Widgets/widgets.css";
// import trackPosition from "./data/trackPosition.js";
// import loadModel from "./data/loadSatelliteModel.js";
// import createViewer from "./data/viewer.js";
// import clockSetting from "./data/clockSetting.js";
// import createAreaUnderSatellite from "./data/areaUnderSatellite.js";
// import getTLEData from "./data/getTLEData";
// import { twoline2satrec } from "satellite.js";
// import { JulianDate } from "cesium";

// const tleData = await getTLEData();
// const [tleLine1, tleLine2] = tleData;
// const satrec = twoline2satrec(tleLine1, tleLine2);
// const viewer = await createViewer()

// const timestepInSeconds = 10;
// const totalSeconds = 60 * 60 * 8;
// const start = JulianDate.fromDate(new Date());
// const stop = JulianDate.addSeconds(
//   start,
//   totalSeconds,
//   new JulianDate()
// )

// clockSetting(viewer, start, stop)
// createAreaUnderSatellite(viewer, trackPosition(satrec, totalSeconds, timestepInSeconds, start))
// await loadModel(viewer, start, stop, trackPosition(satrec, totalSeconds, timestepInSeconds, start))

// main.js (использование классов)
import Satellite from './data/Satellite.js';
import SatelliteTracker from './data/SatelliteTracker.js';
import City from './data/City.js';
import * as Cesium from "cesium";

const CESIUM_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY4OGE0MS0xMmYxLTQwY2YtYTg4OC1kNDUxZmIyODU0NTYiLCJpZCI6Mjc4MzY3LCJpYXQiOjE3NDAzMDE3NzB9._w_PncfjQM56FZ69RBqUTHRu7iM4Iz7xU93cZjuRM_w";
const URIsatellite = 3159015
const URIsatellite2 = 3363411

const timestepInSeconds = 10;
const totalSeconds = 60 * 60 * 8;
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(
    start,
    totalSeconds,
    new Cesium.JulianDate()
);

const tracker = new SatelliteTracker(CESIUM_TOKEN, 'cesiumContainer');
await tracker.init();

tracker.setupClock(start, stop);

const satellite = new Satellite(URIsatellite);
await satellite.parseTLEData();
// const satellite2 = new Satellite(URIsatellite2, 49260)
// await satellite2.parseTLEData();

const newYork = new City('New York', -74.0060, 40.7128)
const minsk = new City('Minsk', 27.5674, 53.8930)

await tracker.addSatellite(satellite, start, stop, satellite.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));
tracker.createAreaUnderSatellite(satellite.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));

// await tracker.addSatellite(satellite2 ,start, stop, satellite2.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));
// tracker.createAreaUnderSatellite(satellite2.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));
tracker.addCity(newYork)
tracker.addCity(minsk)

tracker.viewer.entities.add({
    name: 'New York', 
    position: Cesium.Cartesian3.fromDegrees(-74.0060, 40.7128),
    point: {
        pixelSize: 2,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.YELLOW,
    }
})
