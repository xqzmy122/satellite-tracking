import { twoline2satrec } from "satellite.js";
import getTLEData from "./getTLEData";

const tleData = await getTLEData();
const [tleLine1, tleLine2] = tleData;
const satrec = twoline2satrec(tleLine1, tleLine2);

export default satrec