import * as Cesium from "cesium";
import * as satellite from "satellite.js";
import "cesium/Build/Cesium/Widgets/widgets.css";
import getTLEData from "./data/getTLEData.js";
import loadModel from "./data/loadModel.js";
import createViewer from "./data/viewer.js";
import trackPosition from "./data/trackPosition.js";
import clockSetting from "./data/clockSetting.js";

// Tasks:
// Создать абстракцию типа Data gateway ы(отдельная функция, которая вам выдает данные для визуализации) 
const viewer = await createViewer()
const tleData = await getTLEData();
const [tleLine1, tleLine2] = tleData;

const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

const totalSeconds = 60 * 60 * 8;
const timestepInSeconds = 10;
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(
  start,
  totalSeconds,
  new Cesium.JulianDate()
);

clockSetting(viewer, start, stop)

await loadModel(viewer, start, stop, trackPosition(satrec, totalSeconds, timestepInSeconds, start))
