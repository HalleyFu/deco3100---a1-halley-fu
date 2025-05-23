const unpack = (data, key) => data.map(row => row[key])

const interactivePlotlyDiv = document.getElementById("interactivePlotly")

// Reading csv and output is population_data
d3.csv("femalepop1.csv").then(population_data => {
    const aus = unpack(population_data, 'Australia')
    const china = unpack(population_data, 'China')
    const year = unpack(population_data, 'Year')
    const uk = unpack(population_data, 'United Kingdom')

    let trace1 = {
        x: year,
        y: aus,
        name: "Australia",
        mode: "lines+markers",
        hovertemplate:
            '<b>Country: </b>Australia<br>' +
            '<b>Year: </b>%{x}<br>' + // %{x} means I'm taking the x value at this point (year)
            '<b>Population: </b>%{y:.2f}%<br><extra></extra>'
            // %{y:.2f} formats it in 2 decimal places
            // <extra></extra> means don't show anything extra trace name/anything else
    }

    let trace2 = {
        x: year,
        y: china,
        name: "China",
        mode: "lines+markers",
        hovertemplate:
            '<b>Country: </b>China<br>' +
            '<b>Year: </b>%{x}<br>' + // %{x} means I'm taking the x value at this point (year)
            '<b>Population: </b>%{y:.2f}%<br><extra></extra>'
            // %{y:.2f} formats it in 2 decimal places
            // <extra></extra> means don't show anything extra trace name/anything else
    }

    let trace3 = {
        x: year,
        y: uk,
        name: "United Kingdom",
        mode: "lines+markers",
        hovertemplate:
            '<b>Country: </b>United Kingdom<br>' +
            '<b>Year: </b>%{x}<br>' + // %{x} means I'm taking the x value at this point (year)
            '<b>Population: </b>%{y:.2f}%<br><extra></extra>'
            // %{y:.2f} formats it in 2 decimal places
            // <extra></extra> means don't show anything extra trace name/anything else
    }

    var data = [trace1, trace2, trace3]

    let updateMenus = [{
        buttons: [
            {
                // PLAY button
                // First argument -> which frame to animate to
                args: [null, { // null is saying "no target frame" -> this follow default frames
                    frame: {duration: 1000}, // in miliseconds
                    transition: {duration: 500},
                    fromcurrent: true, // true = Continue from current frame, false = go to beginning
                    mode: 'next' // Go to next frame in the sequence
                }],
                label: 'Play',
                method: 'animate'
            },
            {
                // PAUSE button
                // For pause we don't want want it to a different frame
                args: [[null], { // This takes a list of frames - [null] means go to no frame because all is null
                    frame: {duration: 0}, // in milliseconds
                    transition: {duration: 0},
                    mode: 'immediate' // Display target frame immediately (there are no target so it'll stop)
                }],
                label: 'Pause',
                method: 'animate'
            }
        ],
        // OPTIONAL STYLING
        direction: "left", // Dropdown: "down"
        showactive: true,
        type: "buttons", // Dropdown: "dropdown"
        x: 0,
        xanchor: "right",
        y: 0,
        yanchor: 'top',
        pad: {r: 20, t: 100} //can adjust the padding to change the alignment
    }]

    // Frames are like a snapshot of your plot
    // Make sure the names are exactly what you put in your args in step
    let frames = [
        {
            // lines
            name: 'lines',
            data: [{mode: 'lines'},{mode: 'lines'},{mode: 'lines'}] // make sure this is exactly the same as styling as per plotly
        },
        {
            // markers
            name: 'markers',
            data: [{mode: 'markers'},{mode: 'markers'},{mode: 'markers'}]
        },
        {
            // lines+markers
            name: 'lines+markers',
            data: [{mode: 'lines+markers'},{mode: 'lines+markers'},{mode: 'lines+markers'}]
        }
    ]

    let layout = {
        title: "Female Population Over the Years",
        xaxis: {
            title: {
                text: "Years"
            }
        },
        yaxis: {
            title: {
                text: "Population"
            }
        },
        annotations: [{
            x: 1970, // Setting where I want the annotations to be in x
            y: 52.63183, // Setting where I want the annotations to be in y
            text: "Annotation text",
            showarrow: true,
            arrowhead: 10, // Arrow type, 7 = square arrow
            ax: 0,
            ay: -40
        }],
        hovermode: "x unified", // "x", "x unified", "y", "y unified"
        hoverlabel: {
            bgcolor: "white",
            bordercolor: "#003166",
            font: {
                family: "Dancing Script",
                size: 15,
                color: "#7f7f7f"
            }
        },
        sliders: [{
            pad: {t:80},
            currentvalue: {
                xanchor: 'right',
                prefix: 'Mode: ',
                font: {
                    color: '#666',
                    size:20
                }
            },
            steps: [
                {
                    label: 'Lines',
                    method: 'animate',
                    args: [['lines'], { // Each step corresponds to a frame defined here, in this case it is "lines"
                        mode: 'immediate', // Immediately go to frame named 'lines'
                        transition: {duration: 0},
                    }]
                },
                {
                    label: 'Markers',
                    method: 'animate',
                    args: [['markers'], { // Each step corresponds to a frame defined here, in this case it is "markers"
                        mode: 'immediate', // Immediately go to frame named 'markers'
                        transition: {duration: 0},
                    }]
                },
                {
                    label: 'Lines & Markers',
                    method: 'animate',
                    args: [['lines+markers'], { // Each step corresponds to a frame defined here, in this case it is "lines+markers"
                        mode: 'immediate', // Immediately go to frame named 'lines+markers'
                        transition: {duration: 0},
                    }]
                },
            ]
        }],
        updatemenus: updateMenus
    }

    Plotly.newPlot(interactivePlotlyDiv, data, layout).then(function() {
        Plotly.addFrames(interactivePlotlyDiv, frames)
    })
})