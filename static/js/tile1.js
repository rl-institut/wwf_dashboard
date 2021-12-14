
var tile1 = null;
$.ajax(
  {
    url: "static/data/tile1.json",
    async: false,
    success: function(data) {
      tile1 = data;
    }
  }
)

$("#t1_year").attr("min", tile1[0].year)
$("#t1_year").attr("max", tile1[tile1.length - 1].year)

const t1_icon_space = 10;
const t1_icon_width = (width - t1_icon_space * 4) / 3;
const t1_icon_height = 30;

const t1_ppm_max = tile1.reduce(function(max, current){if (current.ppm > max) {return current.ppm} else {return max}}, 0) + 200;
const t1_co2_max = tile1.reduce(function(max, current){if (current.co2 > max) {return current.co2} else {return max}}, 0);

const t1_icon_area_height = 70;
const t1_chart_height = height - t1_icon_area_height;

const t1_x = d3.scaleBand()
  .range([ 0, width ])
  .domain(tile1.map(function(d) { return d.year; }))
const t1_y = d3.scaleLinear()
  .range([ t1_chart_height, 0 ])
  .domain([0, t1_ppm_max]);
const t1_y2 = d3.scaleLinear()
  .range([ t1_chart_height, 0 ])
  .domain([0, t1_co2_max]);
const t1_color = d3.scaleQuantize()
  .domain([-1.6, 1.6])
  .range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]);

const t1_selected_bar_width = t1_x.bandwidth() * 2;

const t1_svg = d3.select("#t1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X-Axis
t1_svg.append("g")
  .attr("id", "t1_xaxis")
  .attr("transform", "translate(0," + t1_chart_height + ")")
  .call(
    d3.axisBottom(t1_x).tickValues(
      t1_x.domain().filter(function(d, idx) { return idx%20==0 })
    )
  )
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
d3.select("#t1_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t1_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y-Axis (PPM)
t1_svg.append("g")
  .attr("id", "t1_yaxis")
  .attr("transform", "translate(" + width + ", 0)")
  .call(
    d3.axisRight(t1_y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t1_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y2-Axis (CO2)
t1_svg.append("g")
  .attr("id", "t1_yaxis2")
  .call(
    d3.axisLeft(t1_y2)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t1_yaxis2").selectAll(".tick").select("line").attr("stroke-width", 0);

// Temperatures
t1_svg.selectAll(null)
  .data(tile1)
  .enter()
  .append("rect")
    .attr("x", function(d) { return t1_x(d.year); })
    .attr("y", function(d) { return t1_y(d.ppm); })
    .attr("width", t1_x.bandwidth())
    .attr("height", function(d) { return t1_chart_height - t1_y(d.ppm); })
    .attr("fill",  function(d) { return t1_color(d.temperature); });

// PPM
t1_svg.append("path")
  .datum(tile1)
  .attr("fill", "none")
  .attr("stroke", "gray")
  .attr("stroke-width", linewidth)
  .attr("d", d3.line()
    .x(function(d) { return t1_x(d.year) + t1_x.bandwidth() / 2 })
    .y(function(d) { return t1_y(d.ppm) })
  )

// CO2
t1_svg.append("path")
  .datum(tile1)
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", linewidth)
  .attr("d", d3.line()
    .x(function(d) { return t1_x(d.year) + t1_x.bandwidth() / 2 })
    .y(function(d) { return t1_y2(d.co2) })
  )

// PPM Icon
t1_svg.append("rect")
  .attr("x", t1_icon_space)
  .attr("y", t1_chart_height + t1_icon_area_height)
  .attr("width", t1_icon_width)
  .attr("height", t1_icon_height)
  .attr("ry", rectround)
  .attr("fill", "black")

t1_svg.append("text")
  .attr("id", "t1_ppm_icon")
  .attr("x", t1_icon_space + t1_icon_width / 2)
  .attr("y", t1_chart_height + t1_icon_area_height + t1_icon_height / 2)
  .attr("fill", "white")
  .text("328 ppm")
  .style("dominant-baseline", "middle")
  .style("text-anchor", "middle")


// CO2 Icon
t1_svg.append("rect")
  .attr("x", t1_icon_width + 2 * t1_icon_space)
  .attr("y", t1_chart_height + t1_icon_area_height)
  .attr("width", t1_icon_width)
  .attr("height", t1_icon_height)
  .attr("ry", rectround)
  .attr("fill", "gray")

t1_svg.append("text")
  .attr("id", "t1_co2_icon")
  .attr("x", 2 * t1_icon_space + t1_icon_width + t1_icon_width / 2)
  .attr("y", t1_chart_height + t1_icon_area_height + t1_icon_height / 2)
  .attr("fill", "white")
  .text("12.547 Mt")
  .style("dominant-baseline", "middle")
  .style("text-anchor", "middle")

// Temp Icon
t1_svg.append("rect")
  .attr("x", t1_icon_width * 2 + 3 * t1_icon_space)
  .attr("y", t1_chart_height + t1_icon_area_height)
  .attr("width", t1_icon_width)
  .attr("height", t1_icon_height)
  .attr("ry", rectround)
  .attr("fill", "pink")

t1_svg.append("text")
  .attr("id", "t1_temp_icon")
  .attr("x", 3 * t1_icon_space + 2 * t1_icon_width + t1_icon_width / 2)
  .attr("y", t1_chart_height + t1_icon_area_height + t1_icon_height / 2)
  .attr("fill", "black")
  .text("+0,47 °C")
  .style("dominant-baseline", "middle")
  .style("text-anchor", "middle")


function t1_change_year(to_year) {
  // Remove data from previous selection
  t1_svg.select("#t1_current_year").remove();
  t1_svg.select("#t1_current_line").remove();
  t1_svg.select("#t1_current_circle").remove();

  const year = parseInt(to_year);
  const year_data = tile1.find(element => element.year == year);

  t1_svg.append("rect")
    .attr("id", "t1_current_year")
    .attr("x", t1_x(year) - t1_selected_bar_width / 2)
    .attr("y", t1_y(year_data.ppm))
    .attr("width", t1_selected_bar_width)
    .attr("height", t1_chart_height - t1_y(year_data.ppm))
    .attr("fill",  t1_color(year_data.temperature))
    .attr("stroke-width", linewidth)
    .attr("stroke", "rgb(0,0,0)")

  t1_svg.append("line")
    .attr("id", "t1_current_line")
    .attr("x1", t1_x(year))
    .attr("x2", t1_x(year))
    .attr("y1", t1_y(year_data.ppm))
    .attr("y2", t1_y2(t1_co2_max))
    .attr("stroke", "black")
    .attr("stroke-width", linewidth)
    .attr("stroke-dasharray", "4")

  t1_svg.append("circle")
    .attr("id", "t1_current_circle")
    .attr("cx", t1_x(year))
    .attr("cy", t1_y2(year_data.co2))
    .attr("r", circlewidth)

  t1_svg.select("#t1_ppm_icon").text(year_data.ppm.toFixed(1) + " ppm")
  t1_svg.select("#t1_co2_icon").text(year_data.co2.toFixed(3) + " Mt")
  t1_svg.select("#t1_temp_icon").text(year_data.temperature.toFixed(2) + " °C")
}
