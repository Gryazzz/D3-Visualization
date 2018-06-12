var svgWidth = 750;
var svgHeight = 500;

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
  right: 20,
  bottom: 50,
  left: 50
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

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(alldata, d => d.alcohol_consumption)-10, d3.max(alldata, d => d.alcohol_consumption)+10])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(alldata, d => d.bachelor)-10, d3.max(alldata, d => d.bachelor)+10]).nice()
        .range([height, 0]);

    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
    .   call(yAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(alldata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.alcohol_consumption))
        .attr("cy", d => yLinearScale(d.bachelor))
        .attr("r", "13")
        .style("fill", "violet")
        .attr("opacity", ".7")
        .attr("stroke", "blue")

    var circleText = chartGroup.selectAll(null)
        .data(alldata)
        .enter()
        .append('text')

    var textLab = circleText
        .attr('x', d => xLinearScale(d.alcohol_consumption))
        .attr('y', d => yLinearScale(d.bachelor)+3)
        .attr("text-anchor", "middle")
        .text(d => d.state_abbr)
        .attr("font-size", "10px")
        .attr("fill", "blue");
        

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([20, -30])
        .html(function(d) {
            return (`<st>${d.state}</st><br>Alcohol consumption: ${d.alcohol_consumption}<br>Bachelor: ${d.bachelor}`);
        });

    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
            toolTip.show(data);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Alcohol consumption (%)");

    chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) + "," + (height + 35) + ")")
        .attr("class", "axisText")
        .text("Bachelor degree holders (%)");


    
});