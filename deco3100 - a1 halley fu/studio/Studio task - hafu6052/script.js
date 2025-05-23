//Hello, code works in Chrome.


// let trace1 = {
//     x: [1, 2, 3, 4, 5],
//     y: [2, 10, 12, 4, 17],
//     mode: 'markers',
//     marker: {
//         color: 'rgb(0,0,0)',
//         size: 6,
//     }
// }

// let trace2 = {
//     x: [9, 23, 4, 10, 8],
//     y: [7, 5, 45, 80, 2],
//     mode: 'lines',
//     line: {
//         color: 'orange',
//         width: 3,
//     }
    
// }


const dataSource = "animal_data.csv";



const plotDiv = document.getElementById("myPlot");

// This function laods and processes the data
function loadData() {
    // Takes in a data source, and that data source is apssed into a callback
    // function that calls processData()

    d3.csv(dataSource).then (function(data) { processData(data)});
}

// processData is defined here
function processData(allRows) {
    let x = [], y = []; //initialises an empty array 

    for(let i = 0; i < allRows.length; i++) {
        let row = allRows [i]; // Access a row at index
        x.push(row['year']); // Adds the x value and add that to the y array
        y.push(row['weight']); // Adds the y value and add that to the y array
    }
    //  console.log(allRows) // This just logs (or prints) allRows to the console

    makePlot (x,y)
}

function makePlot(x, y) {
    let plotData = [{
        x: x,
        y: y,
        mode: 'markers',  // Scatter plot markers
        type: 'scatter',  // Ensures it's a scatter plot
        marker: {
            color: 'rgb(0,0,255)',
            size: 6,
        },
    }];

    const layout = {
        title: {
            text: 'Average Weight per Year',
            font: {
                size: 48,
                family: 'Arial, sans-serif',
                color: 'darkblue'
            }
        },
        xaxis: {
            title: 'Year',
        },
        yaxis: {
            title: 'Average Weight',
        }
    };

    Plotly.newPlot(plotDiv, plotData, layout);
}

loadData();

//Graph identifies trends over time (x axis)- when were the heaviest animals in the homes (y axis)
//use a scatterplot to spot clusters to easily identify which years had the heaviest animals
// Used blue since it stood out 
//

//Notes
//I asked chatpgt on how to add headings into the graph, only the main title appears and I don't know
//why the x and y titles aren't showing.

// Plotly.newPlot(plotDiv, [trace1, trace2]); 