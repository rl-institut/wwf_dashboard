
$("#t4_year").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  min: tiles[4][0].year,
  max: tiles[4][tiles[4].length - 1].year,
  from: tiles[4][tiles[4].length - 1].year,
  onChange: function (data) {
    t4_change_year(data.from)
  }
});

const t4_technologies = {
  "heatpumps": "Wärmepumpen",
  "storages": "Heimspeicher",
  "ecars": "E-Autos",
  "charging": "Ladesäulen"
};

const t4_ecars_max = tiles[4].reduce(function(max, current){if (current.ecars > max) {return current.ecars} else {return max}}, 0) / 1000;
const t4_others_max = Math.max(
  tiles[4].reduce(function(max, current){if (current.charging > max) {return current.charging} else {return max}}, 0),
  tiles[4].reduce(function(max, current){if (current.storages > max) {return current.storages} else {return max}}, 0),
  tiles[4].reduce(function(max, current){if (current.heatpumps > max) {return current.heatpumps} else {return max}}, 0)
) / 1000;

const t4_chart_height = 230;
const t4_icon_area_offset = 30;
const t4_icon_space = 50;
const t4_icon_margin = 5;

const t4_x = d3.scaleBand()
  .range([ 0, chart_width ])
  .domain(tiles[4].map(function(d) { return d.year; }))
const t4_y = d3.scaleLinear()
  .range([ t4_chart_height, 0 ])
  .domain([0, t4_ecars_max]);
const t4_y2 = d3.scaleLinear()
  .range([ t4_chart_height, 0 ])
  .domain([0, t4_others_max]);
const t4_color = d3.scaleOrdinal()
  .domain(Object.keys(t4_technologies))
  .range(["#d82d45", "#724284", "#008987", "#006386"]);

const t4_svg = d3.select("#t4")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// ICONS

const t4_icons = t4_svg.append("g");

// 4x1 icon row or 2x2 icon grid:
const t4_icon_wrap = (width > tile_breakpoint) ? 4 : 2;
const t4_icon_width = (chart_width - (t4_icon_wrap + 1) * t4_icon_space) / t4_icon_wrap;
const t4_icon_fifth = t4_icon_width / 3 / 2;
const t4_icon_height = 5 * t4_icon_fifth + 4 * t4_icon_margin;
const t4_icon_area_height = t4_icon_height * 4 / t4_icon_wrap;

t4_icons.append("rect")
  .attr("width", chart_width)
  .attr("height", t4_icon_area_height)
  .attr("fill", "white")
  .attr("stroke", "black")

for (const technology of Object.keys(t4_technologies)) {

  [x, y] = get_xy_for_icon(technology);

  // Icon text gets 1/5 of height, symbol and rect get 2/5 of height
  t4_icons.append("text")
    .text(t4_technologies[technology])
    .attr("x", x + t4_icon_width / 2)
    .attr("y", y + t4_icon_margin)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging");

  $(t4_icons.node().appendChild(icons["i_bus"].documentElement.cloneNode(true)))
    .attr("x", x + t4_icon_width / 2 - t4_icon_fifth)
    .attr("y", y + 2 * t4_icon_margin + t4_icon_fifth)
    .attr("width", 2 * t4_icon_fifth)
    .attr("height", 2 * t4_icon_fifth)
    .attr("preserveAspectRatio", "xMidYMid slice");

  t4_icons.append("rect")
    .attr("x", x)
    .attr("y", y + 3 * t4_icon_margin + t4_icon_fifth * 3)
    .attr("width", t4_icon_width)
    .attr("height", t4_icon_fifth * 2)
    .attr("fill", t4_color(technology));
}


// CHART
const t4_chart = t4_svg.append("g").attr("transform", "translate(0, " + (t4_icon_area_height + t4_icon_area_offset) + ")");

// X-Axis
t4_chart.append("g")
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
t4_chart.append("g")
  .attr("id", "t4_yaxis")
  .attr("transform", "translate(" + chart_width + ", 0)")
  .call(
    d3.axisRight(t4_y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t4_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y2-Axis (Others)
t4_chart.append("g")
  .attr("id", "t4_yaxis2")
  .call(
    d3.axisLeft(t4_y2)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t4_yaxis2").selectAll(".tick").select("line").attr("stroke-width", 0);

// Add technology paths
for (const technology of Object.keys(t4_technologies)) {
  let y = t4_y2;
  if (technology == "ecars") {
    y = t4_y;
  }
  t4_chart.append("path")
    .datum(tiles[4])
    .attr("fill", "none")
    .attr("stroke", t4_color(technology))
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) {return t4_x(d.year)})
      .y(function(d) {return y(d[technology] / 1000)})
    )
}

function t4_change_year(to_year) {
  const year = parseInt(to_year);
  const year_data = tiles[4].find(element => element.year == year);

  t4_icons.select("#t4_icon_text").remove();
  const t4_icon_text = t4_icons.append("g")
    .attr("id", "t4_icon_text")

  for (const technology of Object.keys(t4_technologies)) {
    [x, y] = get_xy_for_icon(technology);
    t4_icon_text.append("text")
      .text(year_data[technology])
      .attr("fill", "white")
      .attr("x", x + t4_icon_width / 2)
      .attr("y", y + 3 * t4_icon_margin + 4 * t4_icon_fifth)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
  }
}

function get_xy_for_icon(technology) {
  const i = Object.keys(t4_technologies).indexOf(technology)
  const x = (i % t4_icon_wrap) * t4_icon_width + t4_icon_space * (i % t4_icon_wrap + 1);
  const y = (parseInt(i / t4_icon_wrap)) * t4_icon_height;
  return [x, y]
}

t4_change_year(2020);
