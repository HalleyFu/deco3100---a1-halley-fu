d3.json("sample_network.json").then((data) => {
    console.log("Data Loaded", data);

    /* --- Definitions --- */
const margin = {top: 20, right: 20, bottom: 20, left: 20};
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// --- SVG Setup ---
const svg = d3.select("#plotDiv")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// --- Force Simulation Setup ---
const simulation = d3.forceSimulation (data.nodes) // Start simulation using nodes data

    .force(
        "link",
        d3.forceLink()
        .id((d) => d.id) // Telling D3 how to match links to node IDs
        .links(data.links) // Providing the links (connections) to the data
    )

    .force (
        "charge",
        d3.forceManyBody().strength(-100) //Negative value = repelling force between nodes
    )
    
    .force(
        "center",
        d3.forceCenter(width/2,height/2)
    );

    // --- Draw Links ---
    const linkGroup = svg.append("g").attr("class", "links"); //Create a group for the links
    const link = linkGroup.selectAll("line") // Selecting all the line elements 
        .data(data.links)
        .join("line") // Create one <line> per link
        .attr("stroke", "#aaa") // Set line color to light gray
        .attr("stroke-opacity",0.7); // Make the lines slightly transparent

    // --- Draw Nodes --- 
    const nodeGroup = svg.append("g").attr("class", "node"); //Create a group for the nodes
    const node = linkGroup.selectAll("circle") // Selecting all the circle elements 
        .data(data.nodes)
        .join("circle") // Create one <circle> per link
        .attr("r", 8) // Set radius of the circle
        .attr("fill","69b3a2"); // Set fill colour to teal

    // --- Draw Labels ---
    const labelGroup = svg.append("g").attr("class", "labels"); //Create a group for the labels
    const label = labelGroup.selectAll("text")
        .data(data.nodes)
        .join("text") // Set the text to show each node's name
        .text ((d) => d.name)
        .attr("font-size", "10px") // Set radius of the circle
        .attr("dx", 12) // Move label slightly to the righ of each node
        .attr("dy", ".35em") //Vertically center the label

    // --- Simulation Update ---
function ticked() {
    link //Update the position of each link to match nodes
.attr("x1", d => d.source.x)
.attr("y1", d => d.source.y)
.attr("x2", d => d.target.x)
.attr("y2", d => d.target.y);
    node //update the position of each node
.attr("cx", d => d.x)
.attr("cy", d => d.y);

    label // Update the position of each text label to follow the node
.attr("x", d => d.x)
.attr("y", d => d.y);
}
simulation.on("tick", ticked); //Call ticked every tick.



})