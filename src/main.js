import Satellite from './data/Satellite.js';
import SatelliteTracker from './data/SatelliteTracker.js';
import City from './data/City.js';
import * as Cesium from "cesium";
import satellitesInfo from './data/satellitePanelInfo.js';

const CESIUM_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY4OGE0MS0xMmYxLTQwY2YtYTg4OC1kNDUxZmIyODU0NTYiLCJpZCI6Mjc4MzY3LCJpYXQiOjE3NDAzMDE3NzB9._w_PncfjQM56FZ69RBqUTHRu7iM4Iz7xU93cZjuRM_w";
const URIsatellite = 3159015
const URIsatellite2 = 3363411
const satButtons = document.querySelectorAll('.add-satellite')

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
const satellite2 = new Satellite(URIsatellite2, 49260)
await satellite2.parseTLEData();

const newYork = new City('New York', -74.0060, 40.7128)
const minsk = new City('Minsk', 27.5674, 53.8930)

await tracker.addSatellite(satellite, start, stop, satellite.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));
tracker.createAreaUnderSatellite(satellite.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));

await tracker.addSatellite(satellite2 ,start, stop, satellite2.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));
tracker.createAreaUnderSatellite(satellite2.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));
tracker.addCity(newYork)
tracker.addCity(minsk)

console.log(tracker.entities)
console.log(tracker.getEntityById(URIsatellite))
tracker.toggleEntityVisibility(URIsatellite2, false);



