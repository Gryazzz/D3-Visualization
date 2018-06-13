d3.select(window).on("resize", makeResponsive);
makeResponsive();

function makeResponsive() {

    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
    // var svgWidth = 700;
    // var svgHeight = 500;

    var margin = {
    top: 20,
    right: 30,
    bottom: 90,
    left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // add multiaxis

    var chosenX = 'bachelor';
    var chosenY = 'alcohol_consumption';

    function xScale(alldata, chosenX) {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(alldata, d => d[chosenX])*0.9, d3.max(alldata, d => d[chosenX])*1.1]).nice()
            .range([0, width]);
        return xLinearScale;
    }

    function yScale(alldata, chosenY) {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(alldata, d => d[chosenY])*0.9, d3.max(alldata, d => d[chosenY])*1.1]).nice()
            .range([height, margin.top]);
        return yLinearScale;
    }

    // function used for updating axis var upon click on axis label
    function renderXAxis(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
    
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
        return xAxis;
    }

    function renderYAxis(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
    
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
        return yAxis;
    }

    // function used for updating circles labels positions
    function renderTextX(textLabels, newXScale, chosenX) {
        textLabels.transition()
            .duration(1500)
            .attr('x', d => newXScale(d[chosenX]));
        return textLabels;
    }

    function renderTextY(textLabels, newYScale, chosenY) {
        textLabels.transition()
            .duration(1500)
            .attr('y', d => newYScale(d[chosenY]));
        return textLabels;
    }

    // function used for updating circles group with a transition to new circles
    function renderCirclesX(circlesGroup, newXScale, chosenX) {
        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenX]));
        return circlesGroup;
    }

    function renderCirclesY(circlesGroup, newYScale, chosenY) {
        circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenY]));
        return circlesGroup;
    }

    function updateToolTip(chosenX, chosenY, circlesGroup, textLabels) {

        if (chosenY == "alcohol_consumption") {
            var labely = "Alcohol consumption:";
        }
        else if (chosenY == "heart_attack"){
            var labely = 'Heart attack:';
        }
        else {
            var labely = "Super health:";
        }

        if (chosenX == "bachelor") {
            var labelx = "Bachelor degree:";
        }
        else if (chosenX == "to_50000"){
            var labelx = 'Income up to 50000:';
        }
        else {
            var labelx = "Labor (25-44):";
        }
    
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}:<br>${labelx} - ${d[chosenX]}<br>${labely} - ${d[chosenY]}`);
            });
    
        circlesGroup.call(toolTip);
    
        circlesGroup.on("mouseover", function(data) {
            d3.select(this).style("cursor", "pointer");
            toolTip.show(data);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

        textLabels.on("mouseover", function(data) {
            d3.select(this).style("cursor", "pointer");
            toolTip.show(data);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    
        return circlesGroup;
    }

    // create gradient element
    var defs = svg.append("defs");

    var gradient = defs.append("linearGradient")
        .attr("id", "svgGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", "0%")
        .attr("stop-color", "rgb(231, 249, 252)")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "100%")
        .attr("stop-color", "rgb(59, 192, 216)")
        .attr("stop-opacity", 1);

    // var gradient2 = defs.append("linearGradient")
    //     .attr("id", "svgGradient2")
    //     .attr("x1", "0%")
    //     .attr("x2", "100%")
    //     .attr("y1", "0%")
    //     .attr("y2", "100%");

    // gradient2.append("stop")
    //     .attr('class', 'start')
    //     .attr("offset", "0%")
    //     .attr("stop-color", "rgb(7, 43, 248)")
    //     .attr("stop-opacity", 1);
    
    // gradient2.append("stop")
    //     .attr('class', 'start')
    //     .attr("offset", "50%")
    //     .attr("stop-color", "rgb(66, 132, 194)")
    //     .attr("stop-opacity", 1);

    // gradient2.append("stop")
    //     .attr('class', 'end')
    //     .attr("offset", "100%")
    //     .attr("stop-color", "rgb(7, 43, 248)")
    //     .attr("stop-opacity", 1);
    
    d3.selectAll("#svgGradient")
        .transition()
        .duration(1000)
        .attr("x1", "50%")
        .attr("y1", "0%")


    d3.csv('../data/all_data.csv', (err, alldata) => {
        if (err) throw err;
        
        //change format to number(float)
        alldata.forEach(d => {
            alldata.columns.forEach(c => {
                if (c != 'state' && c != 'state_abbr') {
                    d[c] = +d[c];
                }
            });
        });


        var xLinearScale = xScale(alldata, chosenX);
        var yLinearScale = yScale(alldata, chosenY);
        

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(10, ${height-5})`)
            .attr("stroke", "blue")
            .call(bottomAxis);
        
        var yAxis = chartGroup.append("g")
            .attr("transform", `translate(10, -5)`)
            .attr("stroke", "blue")
            .call(leftAxis);

        var circlesGroup = chartGroup.selectAll("circle")
            .data(alldata)
            .enter()
            .append("circle")
            .classed("circles", true)
            .attr("cx", d => xLinearScale(d[chosenX]))
            .attr("cy", d => yLinearScale(d[chosenY]))
            .attr("r", "10")
            .attr("stroke", "url(#svgGradient)") //append gradient
            .attr('fill','url(#svgGradient)')

        var circleText = chartGroup.selectAll(null)
            .data(alldata)
            .enter()
            .append('text')
            .classed("circles-text", true)
            // .attr('fill','url(#svgGradient2)')
            

        var textLabels = circleText
            .attr('x', d => xLinearScale(d[chosenX]))
            .attr('y', d => yLinearScale(d[chosenY]))
            .attr('alignment-baseline', 'middle')
            .text(d => d.state_abbr)

        
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 10})`);

        var xLabel1 = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            // .attr("value", "alcohol_consumption") // value to grab for event listener
            .classed("active", true)
            // .text("Alcohol Consumption (%)");
            .attr("value", "bachelor")
            .text("Bachelor Degree Holders (%)");

        var xLabel2 = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            // .attr("value", "heart_attack")
            .classed("inactive", true)
            // .text("Heart Attack (%)");
            .attr("value", "to_50000")
            .text("Household income up to 50 000 (%)");

        var xLabel3 = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            // .attr("value", "exellent_health")
            .classed("inactive", true)
            // .text("Respondents with an exellent health (%)");
            .attr("value", "labor_25_44")
            .text("Laborers age 25-44 (%)");
        
        var ylabelsGroup = chartGroup.append("g")

        var yLabel1 = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+60)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "active")
            .attr("value", "alcohol_consumption")
            .text("Alcohol Consumption (%)");
        
        var yLabel2 = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "inactive")
            .attr("value", "heart_attack")
            .text("Heart Attack (%)");
            
        
        var yLabel3 = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+20)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "inactive")
            .attr("value", "exellent_health")
            .text("Respondents with an exellent health (%)");
            
        
        var circlesGroup = updateToolTip(chosenX, chosenY, circlesGroup, textLabels);

        xlabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value != chosenX) {

            // replaces chosenXAxis with value
            chosenX = value;
            console.log(chosenX);
            console.log(chosenY);
            xLinearScale = xScale(alldata, chosenX);
            xAxis = renderXAxis(xLinearScale, xAxis);
            circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenX);
            circlesGroup = updateToolTip(chosenX, chosenY, circlesGroup, textLabels);
            textLabels = renderTextX(textLabels, xLinearScale, chosenX);

            if (chosenX == "bachelor") {
                xLabel1
                .classed("active", true)
                .classed("inactive", false);
                xLabel2
                .classed("active", false)
                .classed("inactive", true);
                xLabel3
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenX == "to_50000") {
                xLabel2
                .classed("active", true)
                .classed("inactive", false);
                xLabel1
                .classed("active", false)
                .classed("inactive", true);
                xLabel3
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
                xLabel3
                .classed("active", true)
                .classed("inactive", false);
                xLabel2
                .classed("active", false)
                .classed("inactive", true);
                xLabel1
                .classed("active", false)
                .classed("inactive", true);
            }
        }
        });
        
        ylabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value != chosenY) {

            // replaces chosenXAxis with value
            chosenY = value;
            console.log(chosenY);
            console.log(chosenX);
            yLinearScale = yScale(alldata, chosenY);
            yAxis = renderYAxis(yLinearScale, yAxis);
            circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenY);
            circlesGroup = updateToolTip(chosenX, chosenY, circlesGroup, textLabels);
            textLabels = renderTextY(textLabels, yLinearScale, chosenY);

            if (chosenY == "alcohol_consumption") {
                yLabel1
                .classed("active", true)
                .classed("inactive", false);
                yLabel2
                .classed("active", false)
                .classed("inactive", true);
                yLabel3
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenY == "heart_attack") {
                yLabel2
                .classed("active", true)
                .classed("inactive", false);
                yLabel1
                .classed("active", false)
                .classed("inactive", true);
                yLabel3
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
                yLabel3
                .classed("active", true)
                .classed("inactive", false);
                yLabel2
                .classed("active", false)
                .classed("inactive", true);
                yLabel1
                .classed("active", false)
                .classed("inactive", true);
            }
        }
        });
    })
}
