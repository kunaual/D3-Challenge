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
  /// adding "scaling" means changing the min/max value of the axis (i.e. if the min is equal to the min of a data point, your data point is going to be sitting on the axis)
    .domain([d3.min(stateData, d => d[chosenXAxis]) *.9 ,  
    d3.max(stateData, d => d[chosenXAxis] *1.05) 
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(stateData, chosenYAxis) {

  console.log("in yscale function");
  console.log(stateData[0][chosenYAxis])
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) *.5, 
    d3.max(stateData, d => d[chosenYAxis]) *1.1 ]) 
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
//re-render circles and their abbrs for new chosen X axis value
function renderCircles(circlesGroup, stAbbrGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  stAbbrGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
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
    data.smokes = +data.smokes;
  });
  console.log(stateData[0].state + " " + stateData[0].abbr);

  // ==============================
  var xLinearScale = xScale(stateData, selectedXAxis);

  var yLinearScale = yScale(stateData, selectedYAxis);


  // define axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // add Axes to the chart
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);


  // build tooltip for hoverover text display
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function (d) {
      //br = line break
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Median Income: ${d3.format("$,")(d.income)}<br>Lacking Healthcare: ${d.healthcare}%`);
    });

  // Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    //  .text("Moo")
    .attr("cx", d => xLinearScale(d[selectedXAxis]))
    .attr("cy", d => yLinearScale(d[selectedYAxis]))
    .attr("r", "15")
    .attr("fill", "darkblue")
    .attr("opacity", ".6")
    .on('mouseover', toolTip.show)
   // .on('click',toolTip.hide);
    .on('mouseout', toolTip.hide);

  var stAbbrGroup = chartGroup.selectAll(null)
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr )
    .attr("x", d => xLinearScale(d[selectedXAxis]))
    .attr("y", d => yLinearScale(d[selectedYAxis]))
    //.attr("dx", d=>-9)
    .attr("dy", d=>5)  //added to put the text in the center of the circle
    .classed("abbr-text", true);

  // put tooltips in the chart
  chartGroup.call(toolTip);


  var labelsXGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  // add axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")//move closer/further from dy
    .attr("class", "axis-text")
    .text("% Lacking Healthcare");


  var povertyLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("% in Poverty");

  var incomeLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Household Income");

  // x axis labels event listener
  labelsXGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== selectedXAxis) {

        // replaces chosenXAxis with value
        selectedXAxis = value;

        // console.log(chosenXAxis)

        // updates x scale for new data
        xLinearScale = xScale(stateData, selectedXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, stAbbrGroup, xLinearScale, selectedXAxis);


        // changes classes to change bold text
        if (selectedXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


}).catch(function (error) {
  console.log(error);
});
