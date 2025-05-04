import "cesium/Build/Cesium/Widgets/widgets.css";
import loadModel from "./data/loadSatelliteModel.js";
import createViewer from "./data/viewer.js";
import clockSetting from "./data/clockSetting.js";
import createAreaUnderSatellite from "./data/areaUnderSatellite.js";
import {start, stop} from "./data/trackTime.js"
import position from "./data/position.js";

// Создать абстракцию типа Data gateway ы(отдельная функция, которая вам выдает данные для визуализации) 
const viewer = await createViewer()

clockSetting(viewer, start, stop)
createAreaUnderSatellite(viewer, position)
await loadModel(viewer, start, stop, position)


