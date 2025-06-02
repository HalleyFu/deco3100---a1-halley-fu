const co2Div = document.getElementById("co2Chart");
const splDiv = document.getElementById("splChart");
const taDiv = document.getElementById("taChart");
const ppdDiv = document.getElementById("ppdChart");

let samba_data = [];
let currentMode = 'lines+markers';

// Utility function
const unpack = (data, key) => data.map(row => row[key]);

// Time filter utility
function filterDataByTime(startHour, endHour) {
    return samba_data.filter(row => {
        const time = row["time"];
        if (!time || typeof time !== "string" || !time.includes(":")) return false;
        const hour = parseInt(time.split(":")[0]);
        return hour >= startHour && hour < endHour;
    });
}

// Load CSV
d3.csv("average_data.csv").then(data => {
    // Parse and clean
    data.forEach(row => {
        row.time = row["time"];
        row.co2 = +row["co2"];
        row.ta = +row["ta"];
        row.tg = +row["tg"];
        row.rh = +row["rh"];
        row.spl = +row["spl"];
        row.ppd = +row["ppd"];
    });

    samba_data = data;

    // Initial draw
    drawCharts(filterDataByTime(9, 17));
});

// Main function to draw all charts
function drawCharts(filteredData) {
    const time = unpack(filteredData, 'time');
    const co2 = unpack(filteredData, 'co2');
    const temp = unpack(filteredData, 'tg');
    const humidity = unpack(filteredData, 'rh');
    const spl = unpack(filteredData, 'spl');
    const ta = unpack(filteredData, 'ta');
    const ppd = unpack(filteredData, 'ppd');

    // CO₂ Chart
    Plotly.newPlot(co2Div, [{
        x: time,
        y: co2,
        name: "CO₂",
        mode: currentMode,
        line: { color: "pink" },
        marker: { color: "red" },
        customdata: temp.map((t, i) => [t, humidity[i]]),
        hovertemplate:
            '<b>Time:</b> %{x}<br>' +
            '<b>CO₂ Level:</b> %{y} ppm<br>' +
            '<b>Temperature:</b> %{customdata[0]} °C<br>' +
            '<b>Humidity:</b> %{customdata[1]}%<br><extra></extra>'
    }], {
        title: "CO₂ Levels Over Time",
        xaxis: { title: "Time (hh:mm:ss)" },
        yaxis: { title: "CO₂ (ppm)" },
        annotations: [{
            x: '14:00:00',
            y: 1005,
            text: "CO₂ often exceeds 1000 ppm after lunch — enough to impair decision-making.",
            showarrow: true,
            arrowhead: 10,
            ax: 0,
            ay: -40
        }],
        shapes: [{
            type: 'rect',
            xref: 'paper',
            yref: 'y',
            x0: 0,
            x1: 1,
            y0: 1000,
            y1: 1200,
            fillcolor: 'rgba(255, 0, 0, 0.1)',
            line: { width: 1 }
        }],
        updatemenus: [{
            buttons: [
                { args: ['mode', 'lines+markers'], label: 'Lines & Markers', method: 'restyle' },
                { args: ['mode', 'lines'], label: 'Lines', method: 'restyle' },
                { args: ['mode', 'markers'], label: 'Markers', method: 'restyle' }
            ],
            direction: "left",
            showactive: true,
            type: "buttons",
            x: 0.3,
            y: 1.2,
            xanchor: "left",
            yanchor: "top",
            pad: { t: 10, r: 10 },
            bgcolor: 'white',
            bordercolor: 'black',
            borderwidth: 1
        }]
    });

    // SPL Heatmap
    Plotly.newPlot(splDiv, [{
        z: [spl.map(v => parseFloat(v))],
        x: time,
        y: ['SPL (dB)'],
        type: 'heatmap',
        colorscale: 'RdOrYl',
        hovertemplate: "<b>Time:</b> %{x}<br><b>SPL:</b> %{z} dB<extra></extra>"
    }], {
        title: "Sound Pressure Level (SPL) Heatmap",
        xaxis: { title: "Time (hh:mm:ss)" },
        yaxis: { showticklabels: true },
        height: 400
    });

    // Dual Y-Axis TA and PPD
    Plotly.newPlot(taDiv, [
        {
            x: time,
            y: ta,
            name: "Air Temp (°C)",
            yaxis: 'y1',
            mode: currentMode,
            line: { color: "orange" },
            marker: { color: "darkorange" },
            hovertemplate:
                '<b>Time:</b> %{x}<br>' +
                '<b>Air Temp:</b> %{y} °C<extra></extra>'
        },
        {
            x: time,
            y: ppd,
            name: "PPD (%)",
            yaxis: 'y2',
            mode: currentMode,
            line: { color: "purple" },
            marker: { color: "indigo" },
            hovertemplate:
                '<b>Time:</b> %{x}<br>' +
                '<b>PPD:</b> %{y}%<extra></extra>'
        }
    ], {
        title: "Air Temperature and PPD Over Time",
        xaxis: { title: "Time (hh:mm:ss)" },
        yaxis: {
            title: "Air Temp (°C)",
            titlefont: { color: "orange" },
            tickfont: { color: "orange" }
        },
        yaxis2: {
            title: "PPD (%)",
            titlefont: { color: "purple" },
            tickfont: { color: "purple" },
            overlaying: "y",
            side: "right"
        },
        hovermode: "x unified",
        updatemenus: [{
            buttons: [
                { args: ['mode', 'lines+markers'], label: 'Lines & Markers', method: 'restyle' },
                { args: ['mode', 'lines'], label: 'Lines', method: 'restyle' },
                { args: ['mode', 'markers'], label: 'Markers', method: 'restyle' }
            ],
            direction: "left",
            showactive: true,
            type: "buttons",
            x: 0.3,
            y: 1.2,
            xanchor: "left",
            yanchor: "top",
            pad: { t: 10, r: 10 },
            bgcolor: 'white',
            bordercolor: 'black',
            borderwidth: 1
        }]
    });

    // PPD Chart
    Plotly.newPlot(ppdDiv, [{
        x: time,
        y: ppd,
        name: "PPD",
        mode: currentMode,
        line: { color: "pink" },
        marker: { color: "red" },
        customdata: temp.map((t, i) => [t, humidity[i]]),
        hovertemplate:
            '<b>Time:</b> %{x}<br>' +
            '<b>Temperature:</b> %{customdata[0]} °C<br>' +
            '<b>CO₂ Level:</b> %{y} ppm<br>' +
            '<b>Humidity:</b> %{customdata[1]}%<br><extra></extra>'
    }], {
        title: "PPD over Time",
        xaxis: { title: "Time (hh:mm:ss)" },
        yaxis: { title: "PPD (%)" },
        updatemenus: [{
            buttons: [
                { args: ['mode', 'lines+markers'], label: 'Lines & Markers', method: 'restyle' },
                { args: ['mode', 'lines'], label: 'Lines', method: 'restyle' },
                { args: ['mode', 'markers'], label: 'Markers', method: 'restyle' }
            ],
            direction: "left",
            showactive: true,
            type: "buttons",
            x: 0.3,
            y: 1.2,
            xanchor: "left",
            yanchor: "top",
            pad: { t: 10, r: 10 },
            bgcolor: 'white',
            bordercolor: 'black',
            borderwidth: 1
        }]
    });
}

// Time filter buttons
document.getElementById("btn-morning").addEventListener("click", () => drawCharts(filterDataByTime(9, 12)));
document.getElementById("btn-noon").addEventListener("click", () => drawCharts(filterDataByTime(12, 15)));
document.getElementById("btn-afternoon").addEventListener("click", () => drawCharts(filterDataByTime(15, 17)));
document.getElementById("btn-day").addEventListener("click", () => drawCharts(filterDataByTime(9, 17)));

// Keep chart mode synced
co2Div.on('plotly_restyle', (eventData) => {
    if (eventData[0].mode) currentMode = eventData[0].mode[0];
});
