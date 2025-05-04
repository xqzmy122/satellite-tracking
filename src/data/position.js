import trackPosition from "./trackPosition.js";
import {timestepInSeconds, totalSeconds, start} from "./trackTime.js"
import satrec from "./satrec.js";

const position = trackPosition(satrec, totalSeconds, timestepInSeconds, start)

export default position