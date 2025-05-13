import Satellite from "./data/Satellite.js";
import SatelliteTracker from "./data/SatelliteTracker.js";
import City from "./data/City.js";
import satellitesInfo from "./data/satellitePanelInfo.js";
import {timestepInSeconds, totalSeconds, start, stop} from './data/timeSetting.js'
import { CallbackProperty } from "cesium";
import checkAndUpdateSatellite from "./data/checkAndUpdateSatellite.js";

const CESIUM_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY4OGE0MS0xMmYxLTQwY2YtYTg4OC1kNDUxZmIyODU0NTYiLCJpZCI6Mjc4MzY3LCJpYXQiOjE3NDAzMDE3NzB9._w_PncfjQM56FZ69RBqUTHRu7iM4Iz7xU93cZjuRM_w";
const URIsatellite = 3159015;
const URILandsat9 = 3363411;
const satButtons = document.querySelectorAll(".add-satellite");

async function initSatellites(satellite) {
  await satellite.parseTLEData();
  await tracker.addSatellite(satellite, start, stop, satellite.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));
}

const satellitesToInit = [
  { instance: new Satellite(URIsatellite), id: URIsatellite },
  { instance: new Satellite(URILandsat9, 49260), id: URILandsat9 },
  { instance: new Satellite(URIsatellite, 40075), id: URIsatellite }
];

const tracker = new SatelliteTracker(CESIUM_TOKEN, "cesiumContainer");
await tracker.init();

await Promise.all(satellitesToInit.map(sat => {
  initSatellites(sat.instance)
}))

tracker.setupClock(start, stop);

const newYork = new City("New York", -74.006, 40.7128);
const minsk = new City("Minsk", 27.5674, 53.893);
tracker.addCity(newYork);
tracker.addCity(minsk);

satButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parent = button.closest("li");
    const satelliteName = parent.className
    const satelliteObj = satellitesInfo.find(
      (obj) => obj.name === satelliteName
    );

    if(satelliteObj) {
        satelliteObj.added = !satelliteObj.added;
        console.log(satelliteObj);
        tracker.toggleEntityVisibility(satelliteObj.id, !satelliteObj.added, button);
    } 
  });
});

async function runSatelliteUpdates() {
  await checkAndUpdateSatellite(satellitesToInit)
  setTimeout(runSatelliteUpdates, 1000)
}

runSatelliteUpdates()