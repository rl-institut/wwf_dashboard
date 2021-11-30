
const linewidth = 2;
const circlewidth = 6;

const icon_space = 10;
const icon_width = (width - icon_space * 4) / 3;
const icon_height = 30;

const y_max = 200;
const y2_max = 35;

const chart_height = height - 100;

const x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.year; }))
const y = d3.scaleLinear()
  .range([ chart_height, 0 ])
  .domain([0, y_max]);
const y2 = d3.scaleLinear()
  .range([ chart_height, 0 ])
  .domain([0, y2_max]);
const color = d3.scaleOrdinal()
  .domain([0, 15])
  .range(["#00008B", "#0000FF", "#1E90FF", "#87CEFA", "#F0F8FF", "#F4A460", "#FF8C00", "#FF4500", "#FF0000", "#8B0000", "#800000", "#000000"]);

const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X-Axis
svg.append("g")
  .attr("id", "xaxis")
  .attr("transform", "translate(0," + chart_height + ")")
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
    .attr("height", function(d) { return chart_height - y(d.ppm); })
    .attr("fill",  function(d) { return color(d.temperature); });

// PPM
svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "gray")
  .attr("stroke-width", linewidth)
  .attr("d", d3.line()
    .x(function(d) { return x(d.year) + x.bandwidth() / 2 })
    .y(function(d) { return y(d.ppm) })
  )

// CO2
svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", linewidth)
  .attr("d", d3.line()
    .x(function(d) { return x(d.year) + x.bandwidth() / 2 })
    .y(function(d) { return y2(d.co2) })
  )

// PPM Icon
svg.append("rect")
  .attr("x", icon_space)
  .attr("y", chart_height + 100)
  .attr("width", icon_width)
  .attr("height", icon_height)
  .attr("ry", 16)
  .attr("fill", "black")

svg.append("text")
  .attr("id", "ppm_icon")
  .attr("x", icon_space + icon_width / 2)
  .attr("y", chart_height + 100 + icon_height / 2)
  .attr("fill", "white")
  .text("328 ppm")
  .style("dominant-baseline", "middle")
  .style("text-anchor", "middle")


// CO2 Icon
svg.append("rect")
  .attr("x", icon_width + 2 * icon_space)
  .attr("y", chart_height + 100)
  .attr("width", icon_width)
  .attr("height", icon_height)
  .attr("ry", 16)
  .attr("fill", "gray")

svg.append("text")
  .attr("id", "co2_icon")
  .attr("x", 2 * icon_space + icon_width + icon_width / 2)
  .attr("y", chart_height + 100 + icon_height / 2)
  .attr("fill", "white")
  .text("12.547 Mt")
  .style("dominant-baseline", "middle")
  .style("text-anchor", "middle")

// Temp Icon
svg.append("rect")
  .attr("x", icon_width * 2 + 3 * icon_space)
  .attr("y", chart_height + 100)
  .attr("width", icon_width)
  .attr("height", icon_height)
  .attr("ry", 16)
  .attr("fill", "pink")

svg.append("text")
  .attr("id", "temp_icon")
  .attr("x", 3 * icon_space + 2 * icon_width + icon_width / 2)
  .attr("y", chart_height + 100 + icon_height / 2)
  .attr("fill", "black")
  .text("+0,47 °C")
  .style("dominant-baseline", "middle")
  .style("text-anchor", "middle")


function changeYear(to_year) {
  // Remove data from previous selection
  svg.select("#current_year").remove();
  svg.select("#current_line").remove();
  svg.select("#current_circle").remove();

  const year = parseInt(to_year);
  const year_data = data.find(element => element.year == year);

  svg.append("rect")
    .attr("id", "current_year")
    .attr("x", x(year) - x.bandwidth() * 2)
    .attr("y", y(year_data.ppm))
    .attr("width", x.bandwidth() * 4)
    .attr("height", chart_height - y(year_data.ppm))
    .attr("fill",  color(year_data.temperature))
    .attr("stroke-width", linewidth)
    .attr("stroke", "rgb(0,0,0)")

  svg.append("line")
    .attr("id", "current_line")
    .attr("x1", x(year))
    .attr("x2", x(year))
    .attr("y1", y(year_data.ppm))
    .attr("y2", y2(y2_max))
    .attr("stroke", "black")
    .attr("stroke-width", linewidth)
    .attr("stroke-dasharray", "4")

  svg.append("circle")
    .attr("id", "current_circle")
    .attr("cx", x(year))
    .attr("cy", y2(year_data.co2))
    .attr("r", circlewidth)
}
