
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
  "fossil": "Fossil",
  "wind_onshore": "Windenergie an Land",
  "wind_offshore": "Windenergie auf See",
  "hydro": "Wasserkraft",
  "biomass": "Biomasse",
  "pv": "Photovoltaik",
};

const t5_chart_height = 230;
const t5_chart_offset = 30;

const t5_icon_width = 89;
const t5_icon_height = 26;
const t5_icon_size = 20;
const t5_icon_margin = 8;
const t5_icon_row_space = 20;

const t5_x = d3.scaleBand()
  .range([ 0, chart_width ])
  .domain(tiles[5].map(function(d) { return d.year; }))
const t5_y = d3.scaleLinear()
  .range([ t5_chart_height, 0 ])
  .domain([0, 100]);
const t5_color = d3.scaleOrdinal()
  .domain(Object.keys(t5_technologies))
  .range(["#000000", "#70B6D6", "#006386", "#008A88" , "#F07C24", "#F3CC00"]);

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

//// ICONS
//
//const t4_icons = t4_svg.append("g");
//
//// 4x1 icon row or 2x2 icon grid:
//const t4_icon_wrap = (width > tile_breakpoint) ? 4 : 2;
//const t4_icon_width = (chart_width - (t4_icon_wrap + 1) * t4_icon_space) / t4_icon_wrap;
//const t4_icon_fifth = t4_icon_width / 3 / 2;
//const t4_icon_height = 5 * t4_icon_fifth + 4 * t4_icon_margin;
//const t4_icon_area_height = t4_icon_height * 4 / t4_icon_wrap;
//
//t4_icons.append("rect")
//  .attr("width", chart_width)
//  .attr("height", t4_icon_area_height)
//  .attr("fill", "white")
//  .attr("stroke", "black")
//
//for (const technology of Object.keys(t4_technologies)) {
//
//  [x, y] = get_xy_for_icon(technology);
//
//  // Icon text gets 1/5 of height, symbol and rect get 2/5 of height
//  t4_icons.append("text")
//    .text(t4_technologies[technology])
//    .attr("x", x + t4_icon_width / 2)
//    .attr("y", y + t4_icon_margin)
//    .attr("text-anchor", "middle")
//    .attr("dominant-baseline", "hanging");
//
//  $(t4_icons.node().appendChild(icons["i_bus"].documentElement.cloneNode(true)))
//    .attr("x", x + t4_icon_width / 2 - t4_icon_fifth)
//    .attr("y", y + 2 * t4_icon_margin + t4_icon_fifth)
//    .attr("width", 2 * t4_icon_fifth)
//    .attr("height", 2 * t4_icon_fifth)
//    .attr("preserveAspectRatio", "xMidYMid slice");
//
//  t4_icons.append("rect")
//    .attr("x", x)
//    .attr("y", y + 3 * t4_icon_margin + t4_icon_fifth * 3)
//    .attr("width", t4_icon_width)
//    .attr("height", t4_icon_fifth * 2)
//    .attr("fill", t4_color(technology));
//}
//
//
//function t4_change_year(to_year) {
//  const year = parseInt(to_year);
//  const year_data = tiles[4].find(element => element.year == year);
//
//  t4_icons.select("#t4_icon_text").remove();
//  const t4_icon_text = t4_icons.append("g")
//    .attr("id", "t4_icon_text")
//
//  for (const technology of Object.keys(t4_technologies)) {
//    [x, y] = get_xy_for_icon(technology);
//    t4_icon_text.append("text")
//      .text(year_data[technology])
//      .attr("fill", "white")
//      .attr("x", x + t4_icon_width / 2)
//      .attr("y", y + 3 * t4_icon_margin + 4 * t4_icon_fifth)
//      .attr("text-anchor", "middle")
//      .attr("dominant-baseline", "middle")
//  }
//}
//
//function get_xy_for_icon(technology) {
//  const i = Object.keys(t4_technologies).indexOf(technology)
//  const x = (i % t4_icon_wrap) * t4_icon_width + t4_icon_space * (i % t4_icon_wrap + 1);
//  const y = (parseInt(i / t4_icon_wrap)) * t4_icon_height;
//  return [x, y]
//}
//
//t4_change_year(2020);
