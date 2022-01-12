
$("#t5_year").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  min: tiles[5][0].year,
  max: tiles[5][tiles[5].length - 1].year,
  from: tiles[5][tiles[5].length - 1].year,
  onChange: function (data) {
    t5_change_year(data.from)
  }
});

const t5_technologies = {
  "wind_onshore": "Windenergie an Land",
  "wind_offshore": "Windenergie auf See",
  "pv": "Photovoltaik",
  "biomass": "Biomasse",
  "hydro": "Wasserkraft",
  "fossil": "Fossil",
};

const t5_chart_height = 230;
const t5_chart_offset = 30;

const t5_icon_width = 89;
const t5_icon_height = 26;
const t5_icon_size = 20;
const t5_icon_margin = 8;
const t5_icon_wrap = 3;

const t5_x = d3.scaleBand()
  .range([ 0, chart_width ])
  .domain(tiles[5].map(function(d) { return d.year; }))
const t5_y = d3.scaleLinear()
  .range([ t5_chart_height, 0 ])
  .domain([0, 100]);
const t5_color = d3.scaleOrdinal()
  .domain(Object.keys(t5_technologies))
  .range(["#70B6D6", "#006386", "#F3CC00", "#F07C24", "#008A88", "#000000"]);
const t5_text_color = d3.scaleOrdinal()
  .domain(Object.keys(t5_technologies))
  .range([wwfColor.black, wwfColor.white, wwfColor.black, wwfColor.black , wwfColor.white, wwfColor.white]);

const t5_svg = d3.select("#t5")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// CHART
const t5_chart = t5_svg.append("g");

// X-Axis
t5_chart.append("g")
  .attr("id", "t5_xaxis")
  .attr("transform", "translate(0," + t5_chart_height + ")")
  .call(
    d3.axisBottom(t5_x).tickValues(
      t5_x.domain().filter(function(d, idx) { return idx % 4 == 0 })
    )
  )
  .selectAll("text")
    .style("text-anchor", "end");
d3.select("#t5_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t5_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y-Axis
t5_chart.append("g")
  .attr("id", "t5_yaxis")
  .call(
    d3.axisLeft(t5_y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t5_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Add technology paths
for (const technology of Object.keys(t5_technologies)) {
  t5_chart.append("path")
    .datum(tiles[5])
    .attr("fill", "none")
    .attr("stroke", t5_color(technology))
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) {return t5_x(d.year)})
      .y(function(d) {return t5_y(d[technology])})
    )
}

// ICONS

const t5_icons = t5_svg.append("g").attr("transform", `translate(0, ${t5_chart_height + t5_chart_offset})`);

// 2x3 grid:
const t5_icon_area_height = height - t5_chart_height - t5_chart_offset - margin.top - margin.bottom;
const t5_icon_vertical_space = (t5_icon_area_height - t5_icon_size - t5_icon_margin - t5_icon_height) / 3;
const t5_icon_horizontal_space = (chart_width - 3 * t5_icon_width) / 4;

for (const technology of Object.keys(t5_technologies)) {
  [x, y] = get_xy_for_icon(technology);

  $(t5_icons.node().appendChild(icons["i_bus"].documentElement.cloneNode(true)))
    .attr("x", x + t5_icon_width / 2 - t5_icon_size / 2)
    .attr("y", y)
    .attr("width", t5_icon_size)
    .attr("height", t5_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");

  t5_icons.append("rect")
    .attr("x", x)
    .attr("y", y + t5_icon_size + t5_icon_margin)
    .attr("width", t5_icon_width)
    .attr("height", t5_icon_height)
    .attr("fill", t5_color(technology));
}

function t5_change_year(to_year) {
  const year = parseInt(to_year);
  const year_data = tiles[5].find(element => element.year == year);

  t5_icons.select("#t5_icon_text").remove();
  const t5_icon_text = t5_icons.append("g")
    .attr("id", "t5_icon_text")

  for (const technology of Object.keys(t5_technologies)) {
    [x, y] = get_xy_for_icon(technology);
    t5_icon_text.append("text")
      .text(year_data[technology].toFixed(1) + " %")
      .attr("fill", t5_text_color(technology))
      .attr("x", x + t5_icon_width / 2)
      .attr("y", y + t5_icon_size + t5_icon_margin + t5_icon_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-weight", fontWeight.bold)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size",fontSize.normal);
  }
}

function get_xy_for_icon(technology) {
  const i = Object.keys(t5_technologies).indexOf(technology)
  const x = (i % t5_icon_wrap) * t5_icon_width + t5_icon_horizontal_space * (i % t5_icon_wrap + 1);
  const y = (parseInt(i / t5_icon_wrap)) * (t5_icon_height + t5_icon_vertical_space) + t5_icon_vertical_space;
  return [x, y]
}


t5_change_year(2020);
