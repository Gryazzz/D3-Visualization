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
  bottom: 20,
  left: 20
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
    
    
});