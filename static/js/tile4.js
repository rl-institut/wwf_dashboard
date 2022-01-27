
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
  },
  onUpdate: function (data) {
    t4_change_year(data.from)
  }
});

const t4_height = (typeof t4_min_height !== 'undefined') ? Math.max(t4_min_height, t4_min_height) : t4_min_height;
const t4_puffer = is_mobile ? 0 : t4_height - t4_min_height;

const t4_technologies = {
  "heatpumps": {"title": "Wärmepumpen", "icon": "i_waermepumpe_32"},
  "storages": {"title": "Heimspeicher", "icon": "i_heimspeicher_32"},
  "ecars": {"title": "E-Autos", "icon": "i_e-auto_32"},
  "charging": {"title": "Ladesäulen", "icon": "i_ladesaeule_32"}
};

const t4_ecars_max = tiles[4].reduce(function(max, current){if (current.ecars > max) {return current.ecars} else {return max}}, 0) / 1000;
const t4_others_max = Math.max(
  tiles[4].reduce(function(max, current){if (current.charging > max) {return current.charging} else {return max}}, 0),
  tiles[4].reduce(function(max, current){if (current.storages > max) {return current.storages} else {return max}}, 0),
  tiles[4].reduce(function(max, current){if (current.heatpumps > max) {return current.heatpumps} else {return max}}, 0)
) / 1000;

const t4_x = d3.scaleLinear()
  .range([0, t4_chart_width])
  .domain([tiles[4][0].year, tiles[4][tiles[4].length - 1].year]);
const t4_y = d3.scaleLinear()
  .range([t4_chart_height, 0])
  .domain([0, t4_ecars_max]);
const t4_y2 = d3.scaleLinear()
  .range([ t4_chart_height, 0 ])
  .domain([0, t4_others_max]);
const t4_color = d3.scaleOrdinal()
  .domain(Object.keys(t4_technologies))
  .range([wwfColor.red, wwfColor.berry, wwfColor.aqua, wwfColor.darkBlue]);

const t4_svg = d3.select("#t4")
  .append("svg")
    .attr("width", width + 2 * share_margin)
    .attr("height", t4_header_height + t4_height + 2 * share_margin);

t4_svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "white");

draw_header(t4_svg, 4, t4_header);

const t4_tile = t4_svg.append("g")
  .attr("transform", `translate(${share_margin}, ${t4_header_height + share_margin})`);

// ICONS

const t4_icons = t4_tile.append("g");

t4_icons.append("text")
  .text("Anzahl der Klimatechnologien im Einsatz")
  .attr("x", width / 2)
  .attr("y", t4_icon_offset)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .style("font-size", fontSize.normal);

const t4_icons_body = t4_icons.append("g")
  .attr("transform", `translate(${t4_icon_hspace}, ${t4_icon_offset + t4_icon_title_height + t4_icon_vspace})`);

for (const [i, technology] of Object.keys(t4_technologies).entries()) {
  const y_offset = parseInt(i / 2) * (t4_icon_size + 2 * t4_icon_vspace + t4_icon_height + t4_icon_title_height + t4_icon_wrap_height)
  t4_icons_body.append("text")
    .text(t4_technologies[technology].title)
    .attr("x", (i % 2) * (t4_icon_hspace + t4_icon_width) + t4_icon_width / 2)
    .attr("y", y_offset + t4_icon_size + 2 * t4_icon_vspace + t4_icon_height)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-weight", fontWeight.normal)
    .attr("letter-spacing", letterSpacing)
    .style("font-size", fontSize.small);

  $(t4_icons_body.node().appendChild(icons[t4_technologies[technology].icon].documentElement.cloneNode(true)))
    .attr("x", (i % 2) * (t4_icon_hspace + t4_icon_width) + t4_icon_width / 2 - t4_icon_size / 2)
    .attr("y", y_offset)
    .attr("width", t4_icon_size)
    .attr("height", t4_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");

  t4_icons_body.append("rect")
    .attr("x", (i % 2) * (t4_icon_hspace + t4_icon_width))
    .attr("y", y_offset + t4_icon_size + t4_icon_vspace)
    .attr("width", t4_icon_width)
    .attr("height", t4_icon_height)
    .attr("fill", t4_color(technology));

  t4_icons_body.append("text")
    .attr("id", "t4_text_" + technology)
    .text("")
    .attr("x", (i % 2) * (t4_icon_hspace + t4_icon_width) + t4_icon_width / 2)
    .attr("y", y_offset + t4_icon_size + t4_icon_vspace + t4_icon_height / 2)
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("font-weight", fontWeight.bold)
    .attr("letter-spacing", letterSpacing)
    .style("font-size", fontSize.small);
}


// CHART
const t4_chart_body = t4_tile.append("g")
  .attr("transform", `translate(0, ${t4_icon_total_height + t4_chart_offset})`);
const t4_chart = t4_chart_body.append("g").attr("transform", `translate(${t4_chart_yaxis_width}, ${t4_chart_unit_height + t4_chart_unit_vspace})`);

// X-Axis
t4_chart.append("g")
  .attr("id", "t4_xaxis")
  .attr("transform", "translate(0," + t4_chart_height + ")")
  .call(
    d3.axisBottom(t4_x).ticks(3).tickFormat(
      function(year) {
        return year
      }
    )
  )
  .selectAll("text")
    .style("text-anchor", "middle")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("letter-spacing", letterSpacing)
    .attr("font-weight", fontWeight.thin);
d3.select("#t4_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t4_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

t4_chart.append("line")
  .attr("x1", 0)
  .attr("x2", t4_chart_width)
  .attr("y1", t4_chart_height)
  .attr("y2", t4_chart_height)
  .attr("stroke", wwfColor.black)
  .attr("stroke-width", chart_axis_stroke_width);

// Y-Axis (E-Cars)
t4_chart.append("g")
  .attr("id", "t4_yaxis")
  .attr("transform", "translate(" + t4_chart_width + ", 0)")
  .call(
    d3.axisRight(t4_y)
  )
  .selectAll("text")
    .style("text-anchor", "start")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("letter-spacing", letterSpacing)
    .attr("font-weight", fontWeight.thin);
d3.select("#t4_yaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t4_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

const t4_y_grid = t4_chart.append("g")
  .call(
    d3.axisLeft(t4_y)
      .tickSize(-t4_chart_width)
      .tickFormat('')
      .ticks(5)
    )
t4_y_grid.selectAll(".tick").select("line")
  .attr("stroke-width", tickStrokeWidth)
  .attr("stroke", tickColor)
t4_y_grid.select('.domain').attr('stroke-width', 0);

t4_chart_body.append("text")
  .text("Heimspeicher, Wärmepumpen,")
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.gray1)
  .attr("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing);
t4_chart_body.append("text")
  .text("Ladesäulen (Tsd.)")
  .attr("y", t4_chart_unit_height / 2)
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.gray1)
  .attr("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing);

// Y2-Axis (Others)
t4_chart.append("g")
  .attr("id", "t4_yaxis2")
  .call(
    d3.axisLeft(t4_y2)
  )
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("letter-spacing", letterSpacing)
    .attr("font-weight", fontWeight.thin);
d3.select("#t4_yaxis2").select('.domain').attr('stroke-width', 0);
d3.select("#t4_yaxis2").selectAll(".tick").select("line").attr("stroke-width", 0);

t4_chart_body.append("text")
  .text("E-Autos (Tsd.)")
  .attr("x", width)
  .attr("y", t4_chart_unit_height / 2)
  .attr("text-anchor", "end")
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.gray1)
  .attr("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing);

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

  t4_chart.select("#t4_year_line").remove();
  t4_chart.append("line")
    .attr("id", "t4_year_line")
    .attr("x1", t4_x(year))
    .attr("x2", t4_x(year))
    .attr("y1", 0)
    .attr("y2", t4_chart_height)
    .attr("stroke", wwfColor.black)
    .attr("stroke-width", dash_width)
    .attr("stroke-dasharray", dash_spacing);

  for (const technology of Object.keys(t4_technologies)) {
    t4_icons.select("#t4_text_" + technology)
      .text(numberWithCommas(year_data[technology]))
  }
}

if ("year" in initials) {
  const init_data = $("#t4_year").data("ionRangeSlider");
  init_data.update({from: initials.year})
} else {
  t4_change_year(tiles[4][tiles[4].length - 1].year);
}
