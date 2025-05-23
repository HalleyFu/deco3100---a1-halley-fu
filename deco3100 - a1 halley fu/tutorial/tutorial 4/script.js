const cerealDate = "cereal.csv";

const cerealDiv = document.getElementById('cerealPlot');
const kelloggsDiv = document.getElementById('kelloggsPlot');

const mfr_lookup_table = {
    "A": {full_name: "American Home Food Products", color:"rgb(100, 60, 23)" },
    "G": {full_name: "General Mills", color: "rgb(150, 120, 100)"},
    "N": {full_name: "Nestle", color: "rgb(200, 10, 160)"},
    "Q": {full_name: "Quake", color: "rgb(10, 200, 100)"},
    "K": {full_name: "Kellogs", color: "rgb(100, 100, 100)"}
};

const unpack = (data, key) => data.map(row => row[key])

function loadData(){
Promise.all([
    d3.csv('cereal.csv'),
    d3.csv('kelloggs.csv')
]).then(([cereal_data, kelloggs_data]) => {
    cereal_data = cereal_data.filter(entry => !Object.values(entry).some(value => value == -1));

    const cereal_x = unpack(cereal_data, 'sugars')
    const cereal_y = unpack(cereal_data, 'rating')
    const cereal_names = unpack(cereal_data, 'name')
    const cereal_mfr = unpack(cereal_data, 'mfr')

    const cereal_mfr_fullnames = cereal_mfr.map(mfr => mfr_lookup_table[mfr] ?  mfr_lookup_table[mfr].full_name : "Unknown" );
    const cereal_color = cereal_mfr.map(mfr => mfr_lookup_table[mfr] ? mfr_lookup_table[mfr].color : "rgb(128,128,128)");

    const cereal_chart_layout = {
        title: {
            text: 'How much sugar leads to lower health ratings in cereals',
        },

        xaxis: {
            text: 'Grams of sugar per serving'
        },
        yaxis: {
            title:{
                text: "Health rating"
            },
            range: [0,100],
        }, showlegend: true
    }


    const cereal_chart_data = [{
        x: cereal_x,
        y: cereal_y,
        text: cereal_names,
        marker: {
            color: cereal_color
        },
        mode: "markers",
        type: 'scatter',
        transforms: [{type: 'groupby', groups: cereal_mfr_fullnames}]
    }];

    Plotly.newPlot(cerealDiv, cereal_chart_data);

    //start of kelloggs

    const kelloggs_x = unpack(kelloggs_data, "Date");
    const kelloggs_y = unpack(kelloggs_data, "Close");

    const kelloggs_chart_layout = {
        title: {
            text: "Kelloggs stock price"
        },
        yaxis: {
            title: "stock price (usd)"
        }
    }

    const kelloggs_chart_data = [{
        x: kelloggs_x,
        y: kelloggs_y,
        type: "scatter",
        mode: 'lines',
        line: { color: "rgb(60, 170, 161)" }
    }]
Plotly.newPlot(kelloggsDiv, kelloggs_chart_data, kelloggs_chart_layout);

}
)
}

loadData();