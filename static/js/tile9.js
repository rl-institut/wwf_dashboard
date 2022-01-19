
const t9_installation_years = tiles[9].installations.map(function(d) { return d.year; });

$("#t9_year").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  values: t9_installation_years,
  from: tiles[9].installations[tiles[9].installations.length - 1].year,
  onChange: function (data) {
    t9_change_year(data.from)
  }
});

const t9_technologies = {
  "solar": {"title": "Solarthermie", "icon": "i_pv"},
  "heatpump": {"title": "Wärmepumpe", "icon": "i_waermepumpe_small"},
  "gas": {"title": "Gasheizung", "icon": "i_gas"},
  "biomass": {"title": "Biomasse", "icon": "i_biomass"},
  "oil": {"title": "Ölheizung", "icon": "i_oel"},
};

const t9_technologies_max = Math.max(...Object.values(tiles[9].installations[tiles[9].installations.length - 1])) / 1000;
const t9_emissions_max = Math.max(...Object.values(tiles[9].emissions));

const t9_height = (typeof t10_min_height !== 'undefined') ? Math.max(t9_min_height, t10_min_height) : t9_min_height;
const t9_puffer = is_mobile ? 0 : (t9_height - t9_bar_total_height - t9_chart_total_height) / 2;

const t9_emissions_x = d3.scaleLinear()
  .range([0, t9_bar_width])
  .domain([0, t9_emissions_max]);
const t9_emissions_y = d3.scaleBand()
  .range([0, t9_bar_height])
  .domain(Object.keys(t9_technologies));

const t9_x = d3.scaleLinear()
  .range([ 0, t9_chart_width ])
  .domain([tiles[9].installations[0].year, tiles[9].installations[tiles[9].installations.length - 1].year]);
const t9_y = d3.scaleLinear()
  .range([ t9_chart_height, 0 ])
  .domain([0, t9_technologies_max]);
const t9_color = d3.scaleOrdinal()
  .domain(Object.keys(t9_technologies))
  .range(["#F3CC00", "#D82D45", "#724284", "#F07C24", "#C3B78C"]);

const t9_svg = d3.select("#t9")
  .append("svg")
    .attr("width", width)
    .attr("height", t9_height)
  .append("g");

// EMISSIONS

t9_svg.append("text")
  .text("CO2-Emissionen nach Heizungsart (g/kWh)")
  .attr("x", width / 2)
  .attr("y", t9_bar_vspace)
  .attr("text-anchor", "middle")
  .attr("letter-spacing", letterSpacing)
  .attr("dominant-baseline", "hanging");

const t9_bar = t9_svg.append("g")
  .attr("transform", `translate(${t9_bar_ticks_width}, ${t9_bar_title_height + 1.5 * t9_bar_vspace})`);

t9_bar.append("g")
  .attr("id", "t9_emissions_y")
  .call(
    d3.axisLeft(t9_emissions_y).ticks().tickFormat(
      function(d) {
        return t9_technologies[d].title;
      }
    )
  )
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-weight", fontWeight.normal)
    .attr("letter-spacing", letterSpacing)
    .attr("font-size", fontSize.xsmall)
d3.select("#t9_emissions_y").select('.domain').attr('stroke-width', 2);
d3.select("#t9_emissions_y").selectAll(".tick").select("line").attr("stroke-width", 0);

for (const technology of Object.keys(t9_technologies)) {
  t9_bar.append("rect")
    .attr("x", 0)
    .attr("y", t9_emissions_y(technology) + t9_bar_gap / 2)
    .attr("width", t9_emissions_x(tiles[9].emissions[technology]))
    .attr("height", t9_emissions_y.bandwidth() - t9_bar_gap);

  if (t9_emissions_x(tiles[9].emissions[technology]) - t9_bar_offset > 0) {
    t9_bar.append("text")
      .text(tiles[9].emissions[technology])
      .attr("x", t9_emissions_x(tiles[9].emissions[technology]) - t9_bar_offset)
      .attr("y", t9_emissions_y(technology) + t9_emissions_y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("fill", wwfColor.white)
      .attr("dominant-baseline", "central")
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.xsmall)
      .attr("font-weight", fontWeight.bold);
  } else {
    t9_bar.append("text")
      .text(tiles[9].emissions[technology])
      .attr("x", t9_bar_offset)
      .attr("y", t9_emissions_y(technology) + t9_emissions_y.bandwidth() / 2)
      .attr("text-anchor", "start")
      .attr("fill", wwfColor.black)
      .attr("dominant-baseline", "central")
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.xsmall)
      .attr("font-weight", fontWeight.bold);
  }
}

// ICONS

const t9_icons = t9_svg.append("g").attr("transform", `translate(0, ${t9_bar_total_height + 2 * t9_puffer})`);
const t9_icon_left = (width - 5 * t9_circle_size - 4 * t9_icon_hspace) / 2;
for (const [i, technology] of Object.keys(t9_technologies).entries()) {
  const icon = t9_technologies[technology].icon;
  const x = t9_icon_left + i * (t9_circle_size + t9_icon_hspace) + t9_circle_size / 2;
  t9_icons.append("circle")
    .attr("id", "t9_circle_" + technology)
    .attr("onclick", `t9_change_technology("${technology}")`)
    .attr("onmouseover", function() { d3.select(this).style("cursor", "pointer"); })
    .attr("cx", x)
    .attr("cy", t9_circle_size / 2)
    .attr("r", t9_circle_size / 2)
    .attr("fill", t9_circe_color_gray);
  $(t9_icons.node().appendChild(icons[icon].documentElement.cloneNode(true)))
    .attr("onclick", `t9_change_technology("${technology}")`)
    .attr("onmouseover", function() { d3.select(this).style("cursor", "pointer"); })
    .attr("id", "t9_icon_" + technology)
    .attr("x", x - t9_icon_size / 2)
    .attr("y", t9_circle_size / 2 - t9_icon_size / 2)
    .attr("width", t9_icon_size)
    .attr("height", t9_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");
}

t9_icons.append("text")
  .attr("id", "t9_technology_title")
  .attr("x", width / 2)
  .attr("y", t9_circle_size + 2 * t9_chart_vspace)
  .attr("text-anchor", "middle")
  .attr("letter-spacing", letterSpacing);

// CHART
const t9_chart = t9_svg.append("g").attr("transform", `translate(${t9_chart_yaxis_width}, ${t9_bar_total_height + 2 * t9_puffer + t9_chart_offset})`);

// X-Axis
t9_chart.append("g")
  .attr("id", "t9_xaxis")
  .attr("transform", "translate(0," + t9_chart_height + ")")
  .call(
    d3.axisBottom(t9_x).ticks(3).tickFormat(
      function(year) {
        return year
      }
    )
  )
  .selectAll("text")
    .attr("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("letter-spacing", letterSpacing)
    .attr("font-weight", fontWeight.thin);
d3.select("#t9_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t9_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

t9_chart.append("line")
  .attr("x1", 0)
  .attr("x2", t9_chart_width)
  .attr("y1", t9_chart_height)
  .attr("y2", t9_chart_height)
  .attr("stroke", wwfColor.black)
  .attr("stroke-width", chart_axis_stroke_width);

// Y-Axis
t9_chart.append("g")
  .attr("id", "t9_yaxis")
  .call(
    d3.axisLeft(t9_y)
  )
  .selectAll("text")
    .attr("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("letter-spacing", letterSpacing)
    .attr("font-weight", fontWeight.thin);
d3.select("#t9_yaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t9_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

const t9_y_grid = t9_chart.append("g")
  .call(
    d3.axisLeft(t9_y)
      .tickSize(-t9_chart_width)
      .tickFormat('')
      .ticks(5)
    )
t9_y_grid.selectAll(".tick").select("line")
  .attr("stroke-width", tickStrokeWidth)
  .attr("stroke", tickColor)
t9_y_grid.select('.domain').attr('stroke-width', 0);

t9_chart.append("text")
  .text("Absatzzahlen Wärmeerzeuger")
  .attr("x", - t9_chart_yaxis_width)
  .attr("y", - t9_chart_unit_height)
  .attr("text-anchor", "start")
  .attr("fill", wwfColor.gray2)
  .attr("letter-spacing", letterSpacing)
  .style("font-size", fontSize.xsmall);
t9_chart.append("text")
  .text("(in 1.000 Stück)")
  .attr("x", - t9_chart_yaxis_width)
  .attr("y", - t9_chart_unit_height / 3)
  .attr("text-anchor", "start")
  .attr("fill", wwfColor.gray2)
  .attr("letter-spacing", letterSpacing)
  .style("font-size", fontSize.xsmall);

// Grayed sector paths
for (const technology of Object.keys(t9_technologies)) {
  t9_chart.append("path")
    .datum(tiles[9].installations)
    .attr("fill", "none")
    .attr("stroke", "#E2E2E2")
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) {return t9_x(d.year)})
      .y(function(d) {return t9_y(d[technology] / 1000)})
    )
}

function t9_activate_technology(technology) {
  t9_icons.selectAll("circle")
    .attr("fill", t9_circe_color_gray)
  t9_icons.selectAll("path")
    .style("fill", wwfColor.black)
  t9_icons.select("#t9_circle_" + technology)
    .attr("fill", t9_color(technology))
  t9_icons.select("#t9_icon_" + technology).select("path")
    .style("fill", wwfColor.white)
  t9_icons.select("#t9_technology_title")
    .text(t9_technologies[technology].title)
}

function t9_draw_current_technology(technology) {
  t9_chart.select("#technology_line").remove();
  t9_chart.append("g")
    .attr("id", "technology_line")
    .append("path")
      .datum(tiles[9].installations)
      .attr("fill", "none")
      .attr("stroke", t9_color(technology))
      .attr("stroke-width", line_width)
      .attr("d", d3.line()
        .x(function(d) {return t9_x(d.year)})
        .y(function(d) {return t9_y(d[technology] / 1000)})
      )
}

function t9_change_technology(technology) {
  t9_activate_technology(technology);
  t9_draw_current_technology(technology);
}

t9_change_technology("biomass");
