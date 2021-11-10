var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.year; }))
var y = d3.scaleLinear()
  .range([ height, 0 ])
  .domain([0, 200]);
var color = d3.scaleOrdinal()
  .domain([0, 15])
  .range(["#00008B", "#0000FF", "#1E90FF", "#87CEFA", "#F0F8FF", "#F4A460", "#FF8C00", "#FF4500", "#FF0000", "#8B0000", "#800000", "#000000"]);

var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(
    d3.axisBottom(x).tickValues(
      x.domain().filter(function(d, idx) { return idx%5==0 })
    )
  )
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

svg.selectAll(null)
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.year); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.value); })
    .attr("fill",  function(d, i) { return color(temperatures[i]); });

svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 4)
  .attr("d", d3.line()
    .x(function(d) { return x(d.year) + x.bandwidth() / 2 })
    .y(function(d) { return y(d.value) })
  )

d3.select('#select_year')
  .on('change', function() {
    svg.select("#current_year").remove();
    var year = [parseInt(d3.select(this).property('value'))];
    changeYear(year);
});

function changeYear(year) {
  svg.selectAll(null)
    .data(year)
    .enter()
    .append("rect")
      .attr("id", "current_year")
      .attr("x", function(d) { return x(d); })
      .attr("y", function(d) { return y(100); })
      .attr("width", x.bandwidth() * 4)
      .attr("height", function(d) { return height - y(100); })
      .attr("fill",  function(d, i) { return color(temperatures[d - 1900]); })
}
