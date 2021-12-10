
const t2_x = d3.scaleLinear()
  .domain([0, 13000])
  .range([ 0, width]);

const t2_svg = d3.select("#t2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

t2_svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(t2_x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");