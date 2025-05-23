const co2Div = document.getElementById("co2Chart");
const splDiv = document.getElementById("splChart");
const taDiv = document.getElementById("taChart");
const ppdDiv = document.getElementById("ppdChart");

const unpack = (data, key) => data.map(row => row[key]);

d3.csv("a1_data.csv").then(samba_data => {
    function filterDataByTime(startHour, endHour) {
        return samba_data.filter(row => {
            const hour = parseInt(row.Time.split(":")[0]);
            return hour >= startHour && hour < endHour;
        });
    }

    let currentMode = 'lines+markers';

    function drawCharts(filteredData) {
        const time = unpack(filteredData, 'Time');
        const co2 = unpack(filteredData, 'co2');
        const temp = unpack(filteredData, 'tg globe temper.');
        const humidity = unpack(filteredData, 'rh relative humi');
        const spl = unpack(filteredData, 'spl');
        const ta = unpack(filteredData, 'ta');
        const ppd = unpack(filteredData, 'ppd');

        // CO2 chart//////////////////////////////////////////////////////////
        const co2Trace = {
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
                '<b>Humidity:</b> %{customdata[1]}%<br>' +
                '<extra></extra>'
        };

        const co2Layout = {
            title: "CO₂ Levels Over Time",
            xaxis: { title: "Time (hh:mm:ss)" },
            yaxis: { title: "CO₂ (ppm)" },
            annotations: [{
                x: '14:00:00', // Setting where I want the annotations to be in x
                y: 1005, // Setting where I want the annotations to be in y
                text: "CO₂ often exceeds 1000 ppm after lunch — enough to impair decision-making.",
                showarrow: true,
                arrowhead: 10, // Arrow type, 7 = square arrow
                ax: 0,
                ay: -40
            }],

            shapes: [ // this highlights when co2 levels are above 1000ppm with a red rectangle.
                {
                    type: 'rect',
                    xref: 'paper',
                    yref: 'y',
                    x0: 0,
                    x1: 1,
                    y0: 1000,
                    y1: 1200, // or set a fixed upper limit like 1200
                    fillcolor: 'rgba(255, 0, 0, 0.1)', // light red with transparency
                    line: { width: 1 }
                }
            ],
            
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
        };

        Plotly.newPlot(co2Div, [co2Trace], co2Layout);

        // SPL heatmap//////////////////////////////////////////////////////////////
        const splTrace = {
            z: [spl.map(val => parseFloat(val))],
            x: time,
            y: ['SPL (dB)'],
            type: 'heatmap',
            colorscale: 'RdOrYl',
            hovertemplate: "<b>Time:</b> %{x}<br><b>SPL:</b> %{z} dB<extra></extra>"
        };

        const splLayout = {
            title: "Sound Pressure Level (SPL) Heatmap",
            xaxis: { title: "Time (hh:mm:ss)" },
            yaxis: { showticklabels: true },
            height: 400 //changes height of the map
        };

        Plotly.newPlot(splDiv, [splTrace], splLayout);

        // Air Temperature Line Chart ////////////////////////////////////////////////////////////
        // TA trace on left y-axis
const taTrace = {
    x: time,
    y: ta,
    name: "Air Temperature (°C)",
    yaxis: 'y1',
    mode: currentMode,
    line: { color: "orange" },
    marker: { color: "darkorange" },
    hovertemplate:
        '<b>Time:</b> %{x}<br>' +
        '<b>Air Temp:</b> %{y} °C<extra></extra>'
};

// PPD trace on right y-axis
const ppdOnChartTrace = {
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
};

// Layout with dual Y-axes
const taLayout = { //i used chatgpt for the dual axis because i tried to make the dual axis work, it ended up laying over itself twice 
    title: "Air Temperature and PPD Over Time",
    xaxis: { title: "Time (hh:mm:ss)" },
    yaxis: {
        title: "Air Temperature (°C)",
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
};

Plotly.newPlot(taDiv, [taTrace, ppdOnChartTrace], taLayout);


    // PPD CHART ///////////////////////////////////////////////////////////////
        const ppdTrace = {
            x: time,
            y: ppd,
            name: "ta",
            mode: currentMode,
            line: { color: "pink" },
            marker: { color: "red" },
            customdata: temp.map((t, i) => [t, humidity[i]]),
            hovertemplate:
                '<b>Time:</b> %{x}<br>' +
                '<b>Temperature:</b> %{customdata[0]} °C<br>' +
                '<b>CO₂ Level:</b> %{y} ppm<br>' +
                '<b>Humidity:</b> %{customdata[1]}%<br>' +
                '<extra></extra>'
        };

        const ppdLayout = {
            title: "PPD over Time",
            xaxis: { title: "Time (hh:mm:ss)" },
            yaxis: { title: "Air Temperature" },
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
        };

        Plotly.newPlot(ppdDiv, [ppdTrace], ppdLayout);
    }

    // Initial chart: 9AM–5PM
    drawCharts(filterDataByTime(9, 17));

    // Time filter buttons
    document.getElementById("btn-morning").addEventListener("click", () => {
        drawCharts(filterDataByTime(9, 12));
    });
    document.getElementById("btn-noon").addEventListener("click", () => {
        drawCharts(filterDataByTime(12, 15));
    });
    document.getElementById("btn-afternoon").addEventListener("click", () => {
        drawCharts(filterDataByTime(15, 17));
    });
    document.getElementById("btn-day").addEventListener("click", () => {
        drawCharts(filterDataByTime(9, 17));
    });

    co2Div.on('plotly_restyle', (eventData) => {
        if (eventData[0].mode) {
            currentMode = eventData[0].mode[0];
        }
    });
});