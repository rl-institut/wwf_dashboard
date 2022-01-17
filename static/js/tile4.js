
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

const t4_height = (typeof t3_min_height !== 'undefined') ? Math.max(t3_min_height, t4_min_height) : t4_min_height;
const t4_puffer = is_mobile ? 0 : t4_height - t4_min_height;

const t4_technologies = {
  "heatpumps": {"title": "Wärmepumpen", "icon": "i_waermepumpe_large"},
  "storages": {"title": "Heimspeicher", "icon": "i_heimspeicher_large"},
  "ecars": {"title": "E-Autos", "icon": "i_e-auto_large"},
  "charging": {"title": "Ladesäulen", "icon": "i_ladesaeule_large"}
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
    .attr("width", width)
    .attr("height", t4_height)

// ICONS

const t4_icons = t4_svg.append("g");

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
    .style("font-size", fontSize.xsmall);

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
    .attr("dominant-baseline", "middle")
    .attr("font-weight", fontWeight.normal)
    .attr("letter-spacing", letterSpacing)
    .style("font-size", fontSize.normal);
}


// CHART
const t4_chart_body = t4_svg.append("g")
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
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
d3.select("#t4_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t4_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y-Axis (E-Cars)
t4_chart.append("g")
  .attr("id", "t4_yaxis")
  .attr("transform", "translate(" + t4_chart_width + ", 0)")
  .call(
    d3.axisRight(t4_y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t4_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

t4_chart_body.append("text")
  .text("Heimspeicher, Wärmepumpen,")
  .attr("dominant-baseline", "hanging")
t4_chart_body.append("text")
  .text("Ladesäulen (Tsd.)")
  .attr("y", t4_chart_unit_height / 2)
  .attr("dominant-baseline", "hanging")

// Y2-Axis (Others)
t4_chart.append("g")
  .attr("id", "t4_yaxis2")
  .call(
    d3.axisLeft(t4_y2)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t4_yaxis2").selectAll(".tick").select("line").attr("stroke-width", 0);

t4_chart_body.append("text")
  .text("E-Autos (Tsd.)")
  .attr("x", width)
  .attr("y", t4_chart_unit_height / 2)
  .attr("text-anchor", "end")
  .attr("dominant-baseline", "hanging")

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

  for (const technology of Object.keys(t4_technologies)) {
    t4_icons.select("#t4_text_" + technology)
      .text(year_data[technology])
  }
}

t4_change_year(2020);
