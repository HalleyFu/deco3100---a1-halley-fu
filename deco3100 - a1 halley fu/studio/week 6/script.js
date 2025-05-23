const unpack = (data, key) => data.map(row => parseFloat(row[key]) || 0);

const interactivePlotlyDiv =  document.getElementById("interactivePlotly")

d3.csv("sambaData2.csv").then(population_data => {
    const rh_runningAverage = unpack(population_data, 'rh Average')
    const rh= unpack(population_data, 'rh')
    const ta_runningAverage = unpack(population_data, 'ta Average')
    const ta = unpack(population_data, 'ta')
    const tg_runningAverage = unpack(population_data, 'tg Average')
    const tg = unpack(population_data, 'Air Temperature')
    const date = unpack(population_data, 'date').map(d => new Date(d));
    const time = unpack(population_data, 'time')
    let trace1 = {
        x: time, 
        y: ta,
        name: "ta",
        mode: "line+markers",
        line : {
            color: "pink"
        },
        marker: {
            color:"red"
        },
        hovertemplate:
        '<b>Sensor: </b>rh<br>' + 
        '<b>Year: </b>%{x}<br>' + // %{x} means I'm taking the x value at this point (year)
        '<b>Temperature: </b>%{y:.2f}%<br><extra></extra>'
        // %{y:.2f}% formats it in 2 decimal palces
        // <extra></extra> means don't show anything extra trace name/anything

    }

    let trace2 = {
        x: time, 
        y: tg,
        name: "tg",
        mode: "line+markers",
        hovertemplate:
        '<b>Sensor: </b>rh<br>' + 
        '<b>Year: </b>%{x}<br>' + // %{x} means I'm taking the x value at this point (year)
        '<b>Temperature: </b>%{y:.2f}%<br><extra></extra>'
        // %{y:.2f}% formats it in 2 decimal palces
        // <extra></extra> means don't show anything extra trace name/anything
    }


   

    var data = [trace1, trace2]

    let updateMenus = [{
        buttons: [
            {
                args: ['mode','lines+markers'],
                label: 'lines & markers',
                method: 'restyle'
            },
            {
                args: ['mode','lines'],
                label: 'lines',
                method: 'restyle'
            },
            {
                args: ['mode','markers'],
                label: 'markers',
                method: 'restyle'      
            },
        ],
        direction: "left",
        showactive: true,
        type: "buttons",
        x: 0.35,
        xanchor: "middle",
        y:2,
        pad: {r:10, t:10},
        yanchor: 'top',
        pad: {r:10, t:10},
        bgcolor: 'white',
        bordercolor: 'black',
        borderwidth: 1,
    }]

    let layout = {
        title: "Cumulative Average of Three Sensors",
        xaxis: {
            title: {
                text: "Time"
            }
        },

        yaxis: {
            title: {
                text: "Temperature"
            }
        },
        annotations: [{
            x:1970, // Setting where I want the annotations to be in x
            y:52.63183, // Setting where I want the annotations to be in y
            text:"Annotation text",
            showarrow: true,
            arrowhead: 7, // Arrow type, 7 = square arrow
            ax: 0,
            ay:-40,
        }],

        hoverlabel: {
            font: {
                family:"Dancing Script",
                size: 15,
                color: "#fff"
            }
        },
        updatemenus:updateMenus
    }

    Plotly.newPlot(interactivePlotlyDiv, data, layout)


})