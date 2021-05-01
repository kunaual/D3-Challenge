# D3-Challenge

This project uses D3 to create a dynamic graph of  % of state population in poverty and median household income vs % lacking healthcare in that state.   The user can select the desired value for the x-axis and the graph is redrawn to display that dataset.  Each state is marked with a circle filled with the state abbreviation.

This repository contains:
1.  index.html - html page utlizing bootstrap and d3
1.  assets/css/d3Style.css - d3 style sheet to style tooltips, state circle text, etc
1.  assets/css/style.css - style sheet for header/footer and axis texts
1.  assets/data/data.csv - dataset provided for the project
1.  assets/js/app.js - javascript file uses d3 to create a scatterplot of state data, including tooltips for each data point.  The code allows the user to select one of 2 available x-axis which will cause the plot to be redraw for that dataset upon clicking. 