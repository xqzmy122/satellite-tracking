import Satellite from "./data/Satellite.js";
import SatelliteTracker from "./data/SatelliteTracker.js";
import City from "./data/City.js";
import * as Cesium from "cesium";
import satellitesInfo from "./data/satellitePanelInfo.js";

const CESIUM_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY4OGE0MS0xMmYxLTQwY2YtYTg4OC1kNDUxZmIyODU0NTYiLCJpZCI6Mjc4MzY3LCJpYXQiOjE3NDAzMDE3NzB9._w_PncfjQM56FZ69RBqUTHRu7iM4Iz7xU93cZjuRM_w";
const URIsatellite = 3159015;
const URILandsat9 = 3363411;
const satButtons = document.querySelectorAll(".add-satellite");

async function initSatellites(satellite) {
  await satellite.parseTLEData();
  await tracker.addSatellite(satellite, start, stop, satellite.calculatePositionOverTime(totalSeconds, timestepInSeconds, start));
}

const timestepInSeconds = 10;
const totalSeconds = 60 * 60 * 8;
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(
  start,
  totalSeconds,
  new Cesium.JulianDate()
);

const tracker = new SatelliteTracker(CESIUM_TOKEN, "cesiumContainer");
await tracker.init();

tracker.setupClock(start, stop);

const satelliteZarya = new Satellite(URIsatellite);
const satelliteLandsat9 = new Satellite(URILandsat9, 49260);
const satelliteNauka = new Satellite(URIsatellite, 40075)
const newYork = new City("New York", -74.006, 40.7128);
const minsk = new City("Minsk", 27.5674, 53.893);

initSatellites(satelliteZarya)
initSatellites(satelliteLandsat9)
initSatellites(satelliteNauka)
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
