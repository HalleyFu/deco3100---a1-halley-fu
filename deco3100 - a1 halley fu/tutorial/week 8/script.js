const data = [10, 18, 5];
const labels = ['A', 'B', 'C'];

const chart_margin = {top:40, right:20, bottom:30, left:40};
const chart_width = 1000 - chart_margin.left - chart_margin.right;
const chart_height = 300 - chart_margin.top - chart_margin.bottom;

// - SVG Setup
// SVG = Scalable Vector Graphic
const chart_svg_container = d3.select("#plotDiv")
    .append("svg")
    .attr("width", chart_width + chart_margin.left + chart_margin.right)
    .attr("height", chart_height + chart_margin.top + chart_margin.bottom)

//kind of like a select all and the move it altogether
const chart_svg = chart_svg_container.append("g")
//moves the whole gruop but its amrgins 
// backtick allow you to insert variables intot he string ==> the ${}
.attr("transform",`translate(${chart_margin.left},${chart_margin.top})`)

//---Scales---
const xScale = d3.scaleBand() // scale bond for categorical data
    .domain(labels) //input labels --> our categories (A,B,C)
    .range([0,chart_width]) //input labels --> our categories (A,B,C)
    .padding(0.2) // x min/max


const yScale = d3.scaleLinear() //linear scale for numerical data
    .domain([0, 20])
    .range([chart_height,0]) // Height - 0 the top fo the plot

// --Axes--

const xAxis = d3.axisBottom(xScale); //Horizontal x axis 

chart_svg.append("g") //group for x axis
.attr("transform",`translate(0,${chart_height})`) //Move acis to the bottom
.call(xAxis) //Actually draws the x axis

const yAxis = d3.axisLeft(yScale) //Vertical y Axis
    .ticks(4) //Shows 4 labels evenly spread

chart_svg.append("g") //Group for y axis
    .call(yAxis) //actually draws the y axis


// ---- Draw Bars----
chart_svg.selectAll(".bar")// Selects all elements with class "bar" (but none exist yet)
    .data(data) //Connects the data
    .enter()    // for each data valye that doesn't have  bar yet, go ahead and make one
    .append("rect") //Adds a new <rect> element
    .attr("class","bar") //Assign Class "bar to every new rect"\
    // For each data point d, run the following functions 
    .attr("x", function(d, i) {return xScale(labels[i]);}) // Sets the x attribute
    .attr("y",function(d) {return yScale(d);}) // Sets the y attribute
    .attr("width", xScale.bandwidth()) // Sets teh wdith attribute

    // 0,0 is the top left of the chart
    .attr("height", function(d) {return chart_height - yScale(d)}) //Sets the height attribute
    .style("fill","steelblue") //Set fill colour

//--- Title ---
chart_svg_container.append("text") //Add a text element to our svg
    //Center the text horizontally
    .attr("x", (chart_width + chart_margin.left + chart_margin.right) / 2)

    //Position the text vertically 
    .attr("y", chart_margin.top / 2 + 5)
    .attr ("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Simple Bar Chart with D3")

