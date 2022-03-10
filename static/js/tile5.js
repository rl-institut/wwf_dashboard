
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
  },
  onUpdate: function (data) {
    t5_change_year(data.from)
  }
});

const t5_height = (is_mobile) ? t5_min_height : (typeof t4_min_height !== 'undefined') ? Math.max(t4_min_height, t5_min_height) : t5_min_height;
const t5_puffer = is_mobile ? 0 : t5_height - t5_min_height;

const t5_technologies = {
  "wind_onshore": {"title": ["Windenergie", "an Land"], "icon": "i_wind_onshore"},
  "wind_offshore": {"title": ["Windenergie", "auf See"], "icon": "i_wind_offshore"},
  "pv": {"title": ["Photovoltaik"], "icon": "i_pv"},
  "biomass": {"title": ["Biomasse"], "icon": "i_biomass"},
  "hydro": {"title": ["Wasserkraft"], "icon": "i_water"},
  "fossil": {"title": ["Fossil / Nuklear"], "icon": "i_pollution"},
};

const t5_renewables = Object.keys(t5_technologies).filter(key => key != "fossil");
const t5_y_max = t5_renewables.reduce(
  (max, key) => {
    if (tiles[5][tiles[5].length - 1][key] > max) {
      return tiles[5][tiles[5].length - 1][key]
    } else {
      return max
    }
  },
  0
);

const t5_x = d3.scaleLinear()
  .range([0, t5_chart_width])
  .domain([tiles[5][0].year, tiles[5][tiles[5].length - 1].year]);
const t5_y = d3.scaleLinear()
  .range([t5_chart_height, 0])
  .domain([0, t5_y_max]);
const t5_color = d3.scaleOrdinal()
  .domain(Object.keys(t5_technologies))
  .range(["#70B6D6", "#006386", "#F3CC00", "#F07C24", "#008A88", "#000000"]);
const t5_text_color = d3.scaleOrdinal()
  .domain(Object.keys(t5_technologies))
  .range([wwfColor.black, wwfColor.white, wwfColor.black, wwfColor.black , wwfColor.white, wwfColor.white]);

const t5_svg = d3.select("#t5")
  .append("svg")
    .attr("width", width + 2 * share_margin)
    .attr("height", t5_header_height + t5_height + 2 * share_margin);

t5_svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "white");

draw_header(t5_svg, 5, t5_header);

const t5_tile = t5_svg.append("g")
  .attr("transform", `translate(${share_margin}, ${t5_header_height + share_margin})`);

t5_tile.append("text")
  .text("Anteil der Erzeugungstechnologien")
  .attr("x", width / 2)
  .attr("y", t5_chart_offset)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging");

t5_tile.append("text")
  .text("am Strommix (%)")
  .attr("x", width / 2)
  .attr("y", t5_chart_offset + t5_chart_title_height / 2)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging");

// CHART
const t5_chart = t5_tile.append("g")
  .attr("transform", `translate(${t5_chart_yaxis_width}, ${t5_chart_offset + t5_chart_title_height})`);

// X-Axis
t5_chart.append("g")
  .attr("id", "t5_xaxis")
  .attr("transform", `translate(0, ${t5_chart_height})`)
  .call(
    d3.axisBottom(t5_x).ticks(5).tickFormat(
      function(year) {
        return year
      }
    )
  )
  .selectAll("text")
    .attr("text-anchor", "middle")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("letter-spacing", letterSpacing)
    .attr("font-weight", fontWeight.thin);
d3.select("#t5_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t5_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

t5_chart.append("line")
  .attr("x1", 0)
  .attr("x2", t5_chart_width)
  .attr("y1", t5_chart_height)
  .attr("y2", t5_chart_height)
  .attr("stroke", wwfColor.black)
  .attr("stroke-width", chart_axis_stroke_width);

// Y-Axis
t5_chart.append("g")
  .attr("id", "t5_yaxis")
  .call(
    d3.axisLeft(t5_y)
  )
  .selectAll('text')
    .style("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("letter-spacing", letterSpacing)
    .attr("font-weight", fontWeight.thin);
d3.select("#t5_yaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t5_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

const t5_y_grid = t5_chart.append("g")
  .call(
    d3.axisLeft(t5_y)
      .tickSize(-t5_chart_width)
      .tickFormat('')
      .ticks(5)
    )
t5_y_grid.selectAll(".tick").select("line")
  .attr("stroke-width", tickStrokeWidth)
  .attr("stroke", tickColor)
t5_y_grid.select('.domain').attr('stroke-width', 0);

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

const t5_icons = t5_tile.append("g").attr("transform", `translate(${t5_icon_hspace}, ${t5_chart_total_height + t5_icon_offset + t5_puffer / 2})`);

for (const [i, technology] of Object.keys(t5_technologies).entries()) {
  const y_offset = parseInt(i / 3) * (t5_icon_size + 2 * t5_icon_vspace + t5_icon_height + t5_icon_text_height + t5_icon_wrap_height)
  $(t5_icons.node().appendChild(icons[t5_technologies[technology].icon].documentElement.cloneNode(true)))
    .attr("x", (i % 3) * (t5_icon_hspace + t5_icon_width) + t5_icon_width / 2 - t5_icon_size / 2)
    .attr("y", y_offset)
    .attr("width", t5_icon_size)
    .attr("height", t5_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");

  t5_icons.append("rect")
    .attr("x", (i % 3) * (t5_icon_hspace + t5_icon_width))
    .attr("y", y_offset + t5_icon_size + t5_icon_vspace)
    .attr("width", t5_icon_width)
    .attr("height", t5_icon_height)
    .attr("fill", t5_color(technology));

  t5_icons.append("text")
    .attr("id", "t5_text_" + technology)
    .text("")
    .attr("x", (i % 3) * (t5_icon_hspace + t5_icon_width) + t5_icon_width / 2)
    .attr("y", y_offset + t5_icon_size + t5_icon_vspace + t5_icon_height / 2)
    .attr("fill", t5_text_color(technology))
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("font-weight", fontWeight.bold)
    .attr("letter-spacing", letterSpacing)
    .attr("font-size",fontSize.normal);

  for (const [t, text] of t5_technologies[technology].title.entries()) {
    t5_icons.append("text")
      .text(text)
      .attr("x", (i % 3) * (t5_icon_hspace + t5_icon_width) + t5_icon_width / 2)
      .attr("y", y_offset + t5_icon_size + 2 * t5_icon_vspace + t5_icon_height + t * t5_icon_text_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .attr("font-weight", fontWeight.normal)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size",fontSize.small);
  }
}

if (is_mobile) {
  t5_icons.selectAll("text").style("font-size", fontSize.xsmall);
}

function t5_change_year(to_year) {
  const year = parseInt(to_year);
  const year_data = tiles[5].find(element => element.year == year);

  t5_chart.select("#t5_year_line").remove();
  t5_chart.append("line")
    .attr("id", "t5_year_line")
    .attr("x1", t5_x(year))
    .attr("x2", t5_x(year))
    .attr("y1", 0)
    .attr("y2", t5_chart_height)
    .attr("stroke", wwfColor.black)
    .attr("stroke-width", dash_width)
    .attr("stroke-dasharray", dash_spacing);

  for (const technology of Object.keys(t5_technologies)) {
    t5_icons.select("#t5_text_" + technology)
      .text(year_data[technology].toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + " %")
  }
}

if ("year" in initials) {
  const init_data = $("#t5_year").data("ionRangeSlider");
  init_data.update({from: initials.year})
} else {
  t5_change_year(tiles[5][tiles[5].length - 1].year);
}
