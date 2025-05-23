const mapDiv = document.getElementById("choropleth");

const unpack = (data, key) => data.map(row => row[key]);

function loadData(){
    Promise.all([
        d3.csv('femalePopulation.csv')
    ]).then(response => {
        let population_data = response[0];

        population_data = population_data.filter(entry =>
            !Object.values(entry).some(value => value == "-1")
        );

        const location = unpack(population_data, "Code");
        const pop_z = unpack(population_data, "Population").map(Number);
        const country = unpack(population_data, "Entity");
        var data = [{
            type: "choropleth",
            locations: location, 
            z: pop_z,
            text: country,
            colorscale: 'Jet',
            colorbar: {
                ticketsuffix: "4",
                title: "Population<br>(female)",

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
            title: "2020 Female World Population",
            geo: {
                showframe: false,
                projection: {
                    type: 'orthographic'
                },
                showocean: true,
                oceancolor: 'rgb(118, 180, 255)'
            },
            
            paper_bgcolor: 'rgb(220,220,220)',
        };

        Plotly.newPlot(mapDiv, data, layout);
    })
}
loadData();

//