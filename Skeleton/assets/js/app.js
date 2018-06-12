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

    // =CORREL(all_data!C:C,all_data!L:L)
    // =CORREL(all_data!C:C,all_data!M:M)
    // =CORREL(all_data!C:C,all_data!O:O)
    // =CORREL(all_data!D:D,all_data!Q:Q)
    // =CORREL(all_data!E:E,all_data!K:K)
    // =CORREL(all_data!E:E,all_data!L:L)
    // =CORREL(all_data!F:F,all_data!U:U)
    // =CORREL(all_data!G:G,all_data!L:L)
    // =CORREL(all_data!H:H,all_data!U:U)
    // =CORREL(all_data!I:I,all_data!M:M)

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

    var chosenX = 'alcohol_consumption';
    var chosenY = 'bachelor';

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

        if (chosenX == "alcohol_consumption") {
            var labelx = "Alcohol Consumption:";
        }
        else if (chosenX == "heart_attack"){
            var labelx = 'Heart Attack:';
        }
        else {
            var labelx = "Depression:";
        }

        if (chosenY == "bachelor") {
            var labely = "Bachelor degree:";
        }
        else if (chosenY == "high_school"){
            var labely = 'High school:';
        }
        else {
            var labely = "White:";
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

        var circleText = chartGroup.selectAll(null)
            .data(alldata)
            .enter()
            .append('text')
            .classed("circles-text", true)

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
            .attr("value", "alcohol_consumption") // value to grab for event listener
            .classed("active", true)
            .text("Alcohol Consumption (%)");

        var xLabel2 = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "heart_attack")
            .classed("inactive", true)
            .text("Heart Attack (%)");

        var xLabel3 = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "depression")
            .classed("inactive", true)
            .text("Depression (%)");
        
        var ylabelsGroup = chartGroup.append("g")

        var yLabel1 = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+60)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "active")
            .attr("value", "bachelor")
            .text("Bachelor Degree Holders (%)");
        
        var yLabel2 = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "inactive")
            .attr("value", "high_school")
            .text("Second Label (%)");
        
        var yLabel3 = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+20)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "inactive")
            .attr("value", "white")
            .text("Third Label (%)");
        
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

            if (chosenX == "alcohol_consumption") {
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
            else if (chosenX == "heart_attack") {
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

            if (chosenY == "bachelor") {
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
            else if (chosenY == "high_school") {
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
    // var toolTip = d3.tip()
    //     .attr("class", "tooltip")
    //     // .offset([20, -30])
    //     .html(function(d) {
    //         return (`${d.state}:<br>Alcohol consumption - ${d.alcohol_consumption}<br>Bachelor - ${d.bachelor}`);
    //     });

    // chartGroup.call(toolTip);

    // circlesGroup.on("mouseover", function(data) {
    //     d3.select(this).style("cursor", "pointer");
    //     toolTip.show(data);
    //   })
    // .on("mouseout", function(data) {
    //     toolTip.hide(data);
    // });

    // textLabels.on("mouseover", function(data) {
    //     d3.select(this). style("cursor", "pointer");
    //     toolTip.show(data);
    //   })
    //   .on("mouseout", function(data) {
        
    //     toolTip.hide(data);
    // });

    // chartGroup.append("text")
    //     .attr("text-anchor", "middle")
    //     .attr("transform", "rotate(-90)")
        
    //     .attr("y", 0 - margin.left*0.33)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .attr("class", "axisText")
    //     .text("Alcohol consumption (%)");

    // chartGroup.append("text")
    //     .attr("text-anchor", "middle")
    //     .attr("transform", "translate("+ (width/2) + "," + (height + margin.bottom*0.33) + ")")
    //     .attr("class", "axisText")
    //     .text("Bachelor degree holders (%)");
