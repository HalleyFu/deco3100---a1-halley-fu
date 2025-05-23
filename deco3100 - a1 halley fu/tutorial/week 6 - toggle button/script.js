const unpack = (data, key) => data.map(row => row[key])

const interactivePlotlyDiv =  document.getElementById("interactivePlotly")

d3.csv("femalepop1.csv").then(population_data => {
    const aus = unpack(population_data, 'Australia')
    const china = unpack(population_data, 'China')
    const uk = unpack(population_data, 'United Kingdom')
    const usa = unpack(population_data, 'United States')
    const germany = unpack(population_data, 'Germany')
    const year = unpack(population_data, 'Year')

    let trace1 = {
        x: year, 
        y: aus,
        name: "Australia",
        mode: "line + markers",
        line : {
            color: "pink"
        },
        marker: {
            color:"red"
        },
        hovertemplate:
        '<b>Country: </b>Australia<br>' + 
        '<b>Year: </b>%{x}<br>' + // %{x} means I'm taking the x value at this point (year)
        '<b>Population: </b>%{y:.2f}%<br><extra></extra>'
        // %{y:.2f}% formats it in 2 decimal palces
        // <extra></extra> means don't show anything extra trace name/anything

    }

    let trace2 = {
        x: year, 
        y: china,
        name: "China",
        mode: "line + markers",
        hovertemplate:
        '<b>Country: </b>China<br>' + 
        '<b>Year: </b>%{x}<br>' + // %{x} means I'm taking the x value at this point (year)
        '<b>Population: </b>%{y:.2f}%<br><extra></extra>'
    }

    let trace3 = {
        x: year, 
        y: uk,
        name: "United Kingdom",
        mode: "line + markers",
        hovertemplate:
        '<b>Country: </b>United Kingdom<br>' + 
        '<b>Year: </b>%{x}<br>' + 
        '<b>Population: </b>%{y:.2f}%<br><extra></extra>'
    }

    let trace4 = {
        x: year, 
        y: usa,
        name: "United States",
        mode: "line + markers",
        hovertemplate:
        '<b>Country: </b>United States<br>' + 
        '<b>Year: </b>%{x}<br>' + 
        '<b>Population: </b>%{y:.2f}%<br><extra></extra>'
    }

    let trace5 = {
        x: year, 
        y: germany,
        name: "Germany",
        mode: "line + markers",
        hovertemplate:
        '<b>Country: </b>Germany<br>' + 
        '<b>Year: </b>%{x}<br>' + 
        '<b>Population: </b>%{y}<br><extra></extra>'
    }

    var data = [trace1, trace2, trace3, trace4, trace5]

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
        title: "female Population Over the Years",
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