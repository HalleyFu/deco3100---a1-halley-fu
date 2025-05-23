const mapDiv = document.getElementById("choropleth");

const unpack = (data, key) => data.map(row => row[key]);

function loadData(){
    Promise.all([
        d3.csv('hydropowerData.csv')
    ]).then(response => {
        let population_data = response[0];

        population_data = population_data.filter(entry =>
            !Object.values(entry).some(value => value == "-1")
        );

        const location = unpack(population_data, "Code");
        const TWh_z = unpack(population_data, "Electricity from hydro - TWh").map(Number);
        const country = unpack(population_data, "Entity");
        var data = [{
            type: "choropleth",
            locations: location, 
            z: TWh_z,
            text: country,
            colorscale: [
                ['0.0', 'rgb(255,255,255)'],  // White
                ['0.05', 'rgb(235,245,255)'],  // Very Very Light Blue
                ['0.15', 'rgb(200,230,255)'],  // Very Light Blue
                ['0.3', 'rgb(160,210,255)'],  // Light Blue
                ['0.45', 'rgb(110,185,255)'],  // Sky Blue
                ['0.6', 'rgb(70,160,255)'],  // Soft Blue
                ['0.75', 'rgb(30,130,255)'],  // True Blue
                ['0.85', 'rgb(0,100,210)'],  // Deep Blue
                ['0.92', 'rgb(0,70,160)'],  // Dark Blue
                ['1.0', 'rgb(0,39,102)']  // Very Dark Blue
            ],
            colorbar: {
                ticketsuffix: "4",
                title: "Electricity from hydro <br>(TWh)",

            },
            marker: {
                line: {
                    color: 'rgb(180,180,180)',
                    width: 0.5
                }
            }
        }];

        var layout = {
            width: 800,
            height: 800, 
            title: "2023 Hydropower Choropleth",
            geo: {
                showframe: true,
                projection: {
                    type: 'orthographic'
                },
                showocean: true,
                oceancolor: 'rgb(222, 240, 174)'
            },
            
            paper_bgcolor: 'rgb(220,220,220)',
        };

        Plotly.newPlot(mapDiv, data, layout);
    })
}
loadData();

/*

STEP 8: for the colours, i used an array to create the colour scale, using the Colour Position and 
Colour value paramaters.

i used green to contrast the blue used in the maps, it also looks nice with blue

added another element, subheading under the graph to help make it easier to read 
"Annual hydropower generation is measured in terawatt-hours (TWh)."

i added an image of a diagram incase people don't know how it works

*/
