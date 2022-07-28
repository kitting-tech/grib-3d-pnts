import * as Cesium from 'cesium';
import "cesium/Widgets/widgets.css";
import "../src/css/main.css";
import {extendCesium3DTileset} from './temporal-3d-tileset';

function createStyles() {
    const styles = [];

    function addStyle(name, style) {
        style.pointSize = Cesium.defaultValue(style.pointSize, 10.0);
        styles.push({
            name: name,
            style: style,
        });
    }

    addStyle("Temperature color size", {
        color: {
            conditions: [
                ["${temperature} < 273", "color('#000099')"],
                ["${temperature} < 278", "color('#00cc99', 1.0)"],
                ["${temperature} < 283", "color('#66ff33', 0.5)"],
                ["${temperature} < 288", "rgba(255, 255, 0, 0.1)"],
                ["${temperature} < 293", "rgb(255, 128, 0)"],
                ["${temperature} < 298", "color('red')"],
                ["${temperature} < 303", "color('rgb(255, 102, 102)')"],
                ["${temperature} < 308", "hsl(0.875, 1.0, 0.6)"],
                ["${temperature} < 313", "hsla(0.83, 1.0, 0.5, 0.1)"],
                ["true", "color('#FFFFFF', 1.0)"],
            ],
        },
        // pointSize: " pow(((${temperature} - 273 + 30) / 80), 2) * 5",
        pointSize: " ((${temperature} - 273 + 30) / 80) * 5",
        // pointSize: "5",
    });

    addStyle("Temperature hide low", {
        color: {
            conditions: [
                ["${temperature} < 273", "color('#000099')"],
                ["${temperature} < 278", "color('#00cc99', 1.0)"],
                ["${temperature} < 283", "color('#66ff33', 0.5)"],
                ["${temperature} < 288", "rgba(255, 255, 0, 0.1)"],
                ["${temperature} < 293", "rgb(255, 128, 0)"],
                ["${temperature} < 298", "color('red')"],
                ["${temperature} < 303", "color('rgb(255, 102, 102)')"],
                ["${temperature} < 308", "hsl(0.875, 1.0, 0.6)"],
                ["${temperature} < 313", "hsla(0.83, 1.0, 0.5, 0.1)"],
                ["true", "color('#FFFFFF', 1.0)"],
            ],
        },
        show: "${temperature} > 283",
        // pointSize: " pow(((${temperature} - 273 + 30) / 80), 2) * 5",
        pointSize: " ((${temperature} - 273 + 30) / 80) * 5",
        // pointSize: "5",
    });

    addStyle("Temperature Interpolate Red/Blue", {
        color: "rgba(((${temperature} - 273 + 30) / 80) * 255, 0, (1.0 - ((${temperature} - 273 + 30) / 80)) * 255, ((${temperature} - 273 + 30) / 80))",
        pointSize: "pow(((${temperature} - 273 + 30) / 80), 2) * 20",
    });

    addStyle("Relative Humidity Gradient", {
        color: "color() * ${relativeHumidity}/100",
        pointSize: "pow(${relativeHumidity},2)/10000 * 10",
    });

    addStyle("Wind U Gradient", {
        color: "color() * (${u}+50)/100",
        pointSize: "5",
    });

    addStyle("Wind V Gradient", {
        color: "color() * (${v}+50)/100",
        pointSize: "5",
    });

    return styles;
}

function drawLatLon() {
    const entities = viewer.entities;

// draw a longitude line every 20°
    for (let lang = -180; lang <= 180; lang += 10) {
        let text = "";
        if (lang === 0) {
            text = "0";
        }
        text += lang === 0 ? "" : "" + lang + "°";
        if (lang === -180) {
            text = "";
        }
        entities.add({
            position: Cesium.Cartesian3.fromDegrees(lang, 0),
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    lang,
                    -90,
                    lang,
                    0,
                    lang,
                    90,
                ]),
                width: 1.0,
                material: Cesium.Color.WHITE,
            },
            label: {
                text: text,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                font: "12px sans-serif",
                fillColor: Cesium.Color.WHITE,
            },
        });
    }

    let langS = [];
    for (let lang = -180; lang <= 180; lang += 5) {
        langS.push(lang);
    }
// draw a latitude line every 10°
    for (let lat = -80; lat <= 80; lat += 10) {
        let text = "";
        text += "" + lat + "°";
        if (lat === 0) {
            text = "";
        }
        entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, lat),
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(
                    langS
                        .map((long) => {
                            return [long, lat].join(",");
                        })
                        .join(",")
                        .split(",")
                        .map((item) => Number(item))
                ),
                width: 1.0,
                material: Cesium.Color.WHITE,
            },
            label: {
                text: text,
                font: "12px sans-serif",
                fillColor: Cesium.Color.WHITE,
            },
        });
    }
}

function addToolbarMenu(options) {
    const menu = document.createElement("select");
    menu.className = "cesium-button";
    menu.onchange = function () {
        const item = options[menu.selectedIndex];
        if (item && typeof item.onselect === "function") {
            item.onselect();
        }
    };
    document.getElementById("toolbar").appendChild(menu);

    for (let i = 0, len = options.length; i < len; ++i) {
        const option = document.createElement("option");
        option.textContent = options[i].text;
        option.value = options[i].value;
        menu.appendChild(option);
    }

    options[0].onselect();
}

function setStyle(style) {
    return function () {
        pointCloud.style = new Cesium.Cesium3DTileStyle(style);
        // tileset.style = new Cesium.Cesium3DTileStyle(style);
    };
}

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';

// const Temporal3DTileset = extendCesium3DTileset(Cesium);
// const clock = new Cesium.Clock({
//     startTime: Cesium.JulianDate.fromIso8601("2022-07-27T18:00:00Z"),
//     currentTime: Cesium.JulianDate.fromIso8601("2022-07-27T18:00:00Z"),
//     stopTime: Cesium.JulianDate.fromIso8601("2022-07-28T18:00:00Z"),
//     clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
//     clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
//     multiplier: 4000, // how much time to advance each tick
//     shouldAnimate: true, // Animation on by default
// });
//
// // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
// const viewer = new Cesium.Viewer('cesiumContainer', {
//     terrainProvider: Cesium.createWorldTerrain(),
//     clockViewModel: new Cesium.ClockViewModel(clock),
//     // shouldAnimate: true,
// });

// const tileset = new Temporal3DTileset({
//     url:
//         "/demo/data/grib/20220728_024258_GFS_1P0_.json",
// });

// // Add Cesium OSM Buildings, a global 3D buildings layer.
// viewer.scene.primitives.add(Cesium.createOsmBuildings());
// viewer.scene.primitives.add(tileset);
// // viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -90.0, 10000000.0));
// viewer.zoomTo(tileset);
// viewer.scene.globe.enableLighting = true;

// drawLatLon();

const viewer = new Cesium.Viewer("cesiumContainer", {
    shouldAnimate: true,
});

const dates = [
    "2022-07-27T18:00:00Z",
    "2022-07-27T21:00:00Z",
    "2022-07-28T00:00:00Z",
    "2022-07-28T03:00:00Z",
    "2022-07-28T06:00:00Z",
    "2022-07-28T09:00:00Z",
    "2022-07-28T12:00:00Z",
    "2022-07-28T15:00:00Z",
    "2022-07-28T18:00:00Z",
];

const uris = [
    "data/grib/20220728_024258_GFS_1P0_0_0_0.pnts",
    "data/grib/20220728_024258_GFS_1P0_3_0_0.pnts",
    "data/grib/20220728_024258_GFS_1P0_6_0_0.pnts",
    "data/grib/20220728_024258_GFS_1P0_9_0_0.pnts",
    "data/grib/20220728_024258_GFS_1P0_12_0_0.pnts",
    "data/grib/20220728_024258_GFS_1P0_15_0_0.pnts",
    "data/grib/20220728_024258_GFS_1P0_18_0_0.pnts",
    "data/grib/20220728_024258_GFS_1P0_21_0_0.pnts",
    "data/grib/20220728_024258_GFS_1P0_24_0_0.pnts",
];

function dataCallback(interval, index) {
    return {
        uri: uris[index],
    };
}

const timeIntervalCollection = Cesium.TimeIntervalCollection.fromIso8601DateArray(
    {
        iso8601Dates: dates,
        dataCallback: dataCallback,
    }
);

const pointCloud = new Cesium.TimeDynamicPointCloud({
    intervals: timeIntervalCollection,
    clock: viewer.clock,
    style: new Cesium.Cesium3DTileStyle({
        pointSize: 5,
    }),
});
viewer.scene.primitives.add(pointCloud);

const start = Cesium.JulianDate.fromIso8601(dates[0]);
const stop = Cesium.JulianDate.fromIso8601(dates[dates.length - 1]);

viewer.timeline.zoomTo(start, stop);

const clock = viewer.clock;
clock.startTime = start;
clock.currentTime = start;
clock.stopTime = stop;
clock.clockRange = Cesium.ClockRange.LOOP_STOP;
clock.multiplier = 30000;

viewer.zoomTo(
    pointCloud,
    new Cesium.HeadingPitchRange(0.0, -0.5, 5000000.0)
);

const styles = createStyles();

const styleOptions = [];
for (let i = 0; i < styles.length; ++i) {
    const style = styles[i];
    styleOptions.push({
        text: style.name,
        onselect: setStyle(style.style),
    });
}

addToolbarMenu(styleOptions);
