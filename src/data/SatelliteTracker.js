import * as Cesium from "cesium";
import { CallbackProperty } from "cesium";
import { JulianDate } from "cesium";
import { Quaternion } from "cesium";
import { Cartesian3 } from "cesium";
import Satellite from "./Satellite";

export default class SatelliteTracker {
    constructor(cesiumToken, containerId) {
        this.cesiumToken = cesiumToken
        this.containerId = containerId
        this.viewer = null
        this.entities = new Map()
    }

    async init() {
        await this.initViewer();
        return this;
    }

    async initViewer() {
        Cesium.Ion.defaultAccessToken = this.cesiumToken
        this.viewer = new Cesium.Viewer(this.containerId, {
            terrainProvider: await Cesium.createWorldTerrainAsync(),
        });

        this.viewer.scene.globe.enableLighting = true
    }

    setupClock(start, stop, multiplier = 40) {
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.timeline.zoomTo(start, stop);
        this.viewer.clock.multiplier = multiplier;
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    }

    async addSatellite(satellite, start, stop, position, scale = 10) {
        const satelliteUri = await Cesium.IonResource.fromAssetId(satellite.satelliteURI);

        const satelliteEntity = this.viewer.trackedEntity = this.viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
            position: position,
            model: { uri: satelliteUri, scale: scale },
            orientation: new Cesium.VelocityOrientationProperty(position),
            path: new Cesium.PathGraphics({ width: 1 }),
        });

        this.entities.set(satellite.satelliteURI, satelliteEntity)
        this.setSatelliteRotation(satelliteEntity, start)
    }

    createAreaUnderSatellite(position) {
        this.viewer.entities.add({
            position: position,
            name: "Red ellipse on surface",
            ellipse: {
                semiMinorAxis: 400000.0,
                semiMajorAxis: 400000.0,
                material: Cesium.Color.RED.withAlpha(0.5),
            },
        });
    }

    setSatelliteRotation(entity, start, rpm = 10) {
        const spinRate = (rpm * 2 * Math.PI) / 60;

        entity.orientation = new CallbackProperty(time => {
            const angle = spinRate * JulianDate.secondsDifference(time, start);
            return Quaternion.fromAxisAngle(Cartesian3.UNIT_X, angle);
        }, false);
    }

    addCity(city) {
        this.viewer.entities.add({
            name: city.name, 
            position: Cesium.Cartesian3.fromDegrees(city.longtitude, city.latitude),
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED,
                outlineWidth: 2,
            },
            label: {
                text: city.name,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -15)
            }
        })
    }

    // Метод для получения entity по ID
    getEntityById(satelliteId) {
        return this.entities.get(satelliteId);
    }

    // Метод для скрытия/показа
    toggleEntityVisibility(satelliteId, isVisible) {
        const entity = this.getEntityById(satelliteId);
        if (entity) entity.show = isVisible;
    }
}
