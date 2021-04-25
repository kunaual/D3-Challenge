console.log("app.js loaded");
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//init axis
var selectedXAxis = "poverty";
var selectedYAxis = "healthcare";

// functions used for updating axis upon click on axis label
function xScale(stateData, chosenXAxis) {

  console.log("in xscale function");
  console.log(stateData[0][chosenXAxis])
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) - 1,
    d3.max(stateData, d => d[chosenXAxis]) + 1
    ])
    .range([0, width]);

  return xLinearScale;

}
function yScale(stateData, chosenYAxis) {

  console.log("in yscale function");
  console.log(stateData[0][chosenYAxis])
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) - 1, d3.max(stateData, d => d[chosenYAxis]) + 1])
    .range([height, 0]);

  return yLinearScale;

}


// Import Data
d3.csv("assets/data/data.csv").then(function (stateData) {
  console.log(stateData); //testing output
  //xScale(stateData,selectedXAxis);

  // convert strings to numbers
  stateData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
  });
  console.log(stateData[0].state + " " + stateData[0].abbr);

  // ==============================
  var xLinearScale = xScale(stateData, selectedXAxis);
  // var xLinearScale = d3.scaleLinear()
  //   .domain([d3.min(stateData, d => d.poverty) - 1, d3.max(stateData, d => d.poverty)])
  //   .range([0, width]);

  var yLinearScale = yScale(stateData, selectedYAxis);
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(stateData, d => d.healthcare)])
  //   .range([height, 0]);

  // define axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // add Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);


  // build tooltip for hoverover text display
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      //br = line break
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Lacking Healthcare: ${d.healthcare}%`);
    });

  // Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .text("Moo")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

  circlesGroup.append("text")
    .attr("dx", function (d) { return -5 })
    .text(function (d) { return d.abbr })

  // put tooltips in the chart
  chartGroup.call(toolTip);

  // put these in the circle group so don't need them above
  // ==============================
  // circlesGroup.on("click", function(data) {  //have to click to get it to show up
  //   toolTip.show(data, this);
  // })
  //   // onmouseout event
  //   .on("mouseout", function(data, index) {
  //     toolTip.hide(data);
  //   });

  // add axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")//move closer/further from dy
    .attr("class", "axisText")
    .text("% Lacking Healthcare");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("% in Poverty");
}).catch(function (error) {
  console.log(error);
});
