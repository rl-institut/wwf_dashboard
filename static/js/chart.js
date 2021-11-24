var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.year; }))
var y = d3.scaleLinear()
  .range([ height, 0 ])
  .domain([0, 200]);
var y2 = d3.scaleLinear()
  .range([ height, 0 ])
  .domain([0, 35]);
var color = d3.scaleOrdinal()
  .domain([0, 15])
  .range(["#00008B", "#0000FF", "#1E90FF", "#87CEFA", "#F0F8FF", "#F4A460", "#FF8C00", "#FF4500", "#FF0000", "#8B0000", "#800000", "#000000"]);

var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X-Axis
svg.append("g")
  .attr("id", "xaxis")
  .attr("transform", "translate(0," + height + ")")
  .call(
    d3.axisBottom(x).tickValues(
      x.domain().filter(function(d, idx) { return idx%20==0 })
    )
  )
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
d3.select("#xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y-Axis (PPM)
svg.append("g")
  .attr("id", "yaxis")
  .attr("transform", "translate(" + width + ", 0)")
  .call(
    d3.axisRight(y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y2-Axis (CO2)
svg.append("g")
  .attr("id", "yaxis2")
  .call(
    d3.axisLeft(y2)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#yaxis2").selectAll(".tick").select("line").attr("stroke-width", 0);

// Temperatures
svg.selectAll(null)
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.year); })
    .attr("y", function(d) { return y(d.ppm); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.ppm); })
    .attr("fill",  function(d) { return color(d.temperature); });

// PPM
svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "gray")
  .attr("stroke-width", 4)
  .attr("d", d3.line()
    .x(function(d) { return x(d.year) + x.bandwidth() / 2 })
    .y(function(d) { return y(d.ppm) })
  )

// CO2
svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 4)
  .attr("d", d3.line()
    .x(function(d, i) { return x(1900 + i) + x.bandwidth() / 2 })
    .y(function(d) { return y2(d.co2) })
  )


function changeYear(to_year) {
  // Remove data from previous selection
  console.log("here")
  svg.select("#current_year").remove();

  const year = parseInt(to_year);
  const year_data = data.find(element => element.year == year);
  console.log(year_data)

  svg.append("rect")
    .attr("id", "current_year")
    .attr("x", x(year))
    .attr("y", y(year_data.ppm))
    .attr("width", x.bandwidth() * 4)
    .attr("height", height - y(year_data.ppm))
    .attr("fill",  color(year_data.temperature))
    .attr("stroke-width", 2)
    .attr("stroke", "rgb(0,0,0)")
}
