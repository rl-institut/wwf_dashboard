
var tile4 = null;
$.ajax(
  {
    url: "static/data/tile4.json",
    async: false,
    success: function(data) {
      tile4 = data;
    }
  }
)

var icon = null;
$.ajax(
  {
    url: "static/icons/i_bus.svg",
    async: false,
    success: function(data) {
      icon = data;
    }
  }
)

const t4_technologies = ["heatpumps", "storages", "ecars", "charging"];

$("#t4_year").attr("min", tile4[0].year)
$("#t4_year").attr("max", tile4[tile4.length - 1].year)

const t4_ecars_max = tile4.reduce(function(max, current){if (current.ecars > max) {return current.ecars} else {return max}}, 0) / 1000;
const t4_others_max = Math.max(
  tile4.reduce(function(max, current){if (current.charging > max) {return current.charging} else {return max}}, 0),
  tile4.reduce(function(max, current){if (current.storages > max) {return current.storages} else {return max}}, 0),
  tile4.reduce(function(max, current){if (current.heatpumps > max) {return current.heatpumps} else {return max}}, 0)
) / 1000;

const t4_chart_height = 230;

const t4_x = d3.scaleBand()
  .range([ 0, width ])
  .domain(tile4.map(function(d) { return d.year; }))
const t4_y = d3.scaleLinear()
  .range([ t4_chart_height, 0 ])
  .domain([0, t4_ecars_max]);
const t4_y2 = d3.scaleLinear()
  .range([ t4_chart_height, 0 ])
  .domain([0, t4_others_max]);
const t4_color = d3.scaleOrdinal()
  .domain(t4_technologies)
  .range(["#d82d45", "#724284", "#008987", "#006386"]);

const t4_svg = d3.select("#t4")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X-Axis
t4_svg.append("g")
  .attr("id", "t4_xaxis")
  .attr("transform", "translate(0," + t4_chart_height + ")")
  .call(
    d3.axisBottom(t4_x).tickValues(
      t4_x.domain().filter(function(d, idx) { return idx%4==0 })
    )
  )
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
d3.select("#t4_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t4_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y-Axis (E-Cars)
t4_svg.append("g")
  .attr("id", "t4_yaxis")
  .attr("transform", "translate(" + width + ", 0)")
  .call(
    d3.axisRight(t4_y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t4_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y2-Axis (Others)
t4_svg.append("g")
  .attr("id", "t4_yaxis2")
  .call(
    d3.axisLeft(t4_y2)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t4_yaxis2").selectAll(".tick").select("line").attr("stroke-width", 0);

// Add technology paths
for (let i=0; i < t4_technologies.length; i++) {
  const technology = t4_technologies[i];
  let y = t4_y2;
  if (technology == "ecars") {
    y = t4_y;
  }
  t4_svg.append("path")
    .datum(tile4)
    .attr("fill", "none")
    .attr("stroke", t4_color(technology))
    .attr("stroke-width", linewidth)
    .attr("d", d3.line()
      .x(function(d) {return t4_x(d.year)})
      .y(function(d) {return y(d[technology] / 1000)})
    )
}

// Embed svg:
// t4_svg.node().appendChild(icon.documentElement)
