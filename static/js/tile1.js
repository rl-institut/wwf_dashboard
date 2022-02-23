
let t1_mode = "global";

$("#t1_year").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  min: tiles[1].global[0].year,
  max: tiles[1].global[tiles[1].global.length - 1].year,
  from: tiles[1].global[tiles[1].global.length - 1].year,
  onChange: function (data) {
    t1_change_year(data.from)
  },
  onUpdate: function (data) {
    t1_change_year(data.from)
  }
});

const t1_slider_height = 120;
const t1_height = (typeof t10_min_height !== 'undefined') ? Math.max(t10_min_height - t1_slider_height, t1_min_height) : t1_min_height;
const t1_puffer = is_mobile ? 0 : (t1_height - t1_min_height);

const t1_ppm_max = tiles[1].global.reduce(function(max, current){if (current.ppm > max) {return current.ppm} else {return max}}, 0);
const t1_co2_global_max = tiles[1].global.reduce(function(max, current){if (current.co2 > max) {return current.co2} else {return max}}, 0);
const t1_co2_brd_max = tiles[1].brd.reduce(function(max, current){if (current.co2 > max) {return current.co2} else {return max}}, 0);

const t1_temp_global = 0.75;
const t1_temp_brd = 2.6;

const t1_x = d3.scaleBand()
  .range([ 0, chart_width ])
  .domain(tiles[1].global.map(function(d) { return d.year; }))
const t1_y = d3.scaleLinear()
  .range([ t1_chart_height, 0 ])
  .domain([0, t1_ppm_max * 1.2]);
let t1_y2 = d3.scaleLinear()
  .range([ t1_chart_height, 0 ])
  .domain([0, t1_co2_global_max * 1.2]);
const t1_color_global = d3.scaleQuantize()
  .domain([-t1_temp_global, t1_temp_global])
  .range(t1_temperature_colors);
const t1_color_brd = d3.scaleQuantize()
  .domain([-t1_temp_brd, t1_temp_brd])
  .range(t1_temperature_colors);

const t1_selected_bar_width = t1_x.bandwidth() * 2;

const t1_svg = d3.select("#t1")
  .append("svg")
    .attr("width", width + 2 * share_margin)
    .attr("height", t1_header_height + t1_height + 2 * share_margin);

t1_svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "white");

draw_header(t1_svg, 1, t1_header);

const t1_tile = t1_svg.append("g")
  .attr("transform", `translate(${share_margin}, ${t1_header_height + share_margin})`);

// X-Axis
t1_tile.append("g")
  .attr("id", "t1_xaxis")
  .attr("transform", `translate(${t1_chart_axes_width}, ${t1_chart_offset + t1_chart_height + t1_chart_unit_height + t1_chart_unit_offset})`)
  .call(
    d3.axisBottom(t1_x).tickValues(
      t1_x.domain().filter(function(d, idx) { return idx%20==0 })
    )
  )
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-weight", fontWeight.normal)
    .attr("letter-spacing", letterSpacing)
    .attr("font-size", fontSize.xsmall)
d3.select("#t1_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t1_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y-Axis (PPM)
t1_tile.append("g")
  .attr("id", "t1_yaxis")
  .attr("transform", `translate(${chart_width + t1_chart_axes_width}, ${t1_chart_offset + t1_chart_unit_height + t1_chart_unit_offset})`)
  .call(
    d3.axisRight(t1_y)
  )
  .selectAll("text")
    .style("text-anchor", "start")
    .attr("fill", wwfColor.black)
    .attr("font-weight", fontWeight.bold)
    .attr("letter-spacing", letterSpacing)
    .attr("font-size", fontSize.xsmall)
d3.select("#t1_yaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t1_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

t1_tile.append("text")
  .text("CO2-energiebedingte")
  .attr("y", t1_chart_offset + t1_chart_unit_height / 3)
  .attr("text-anchor", "start")
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.gray2)
  .attr("font-weight", fontWeight.bold)
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)
t1_tile.append("text")
  .text("Emissionen in Mt")
  .attr("y", t1_chart_offset + t1_chart_unit_height / 3 * 2)
  .attr("text-anchor", "start")
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.gray2)
  .attr("font-weight", fontWeight.bold)
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)

// Y2-Axis Title
t1_tile.append("text")
  .text("CO2-Konzentration")
  .attr("x", width)
  .attr("y", t1_chart_offset)
  .attr("text-anchor", "end")
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.black)
  .attr("font-weight", fontWeight.bold)
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)
t1_tile.append("text")
  .text("in der Atmosphäre")
  .attr("x", width)
  .attr("y", t1_chart_offset + t1_chart_unit_height / 3)
  .attr("text-anchor", "end")
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.black)
  .attr("font-weight", fontWeight.bold)
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)
t1_tile.append("text")
  .text("in ppm")
  .attr("x", width)
  .attr("y", t1_chart_offset + t1_chart_unit_height / 3 * 2)
  .attr("text-anchor", "end")
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.black)
  .attr("font-weight", fontWeight.bold)
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)

// ICONS

const t1_icons = t1_tile.append("g").attr("transform", `translate(0, ${t1_chart_total_height + t1_puffer / 3})`);

// PPM Icon
$(t1_icons.node().appendChild(icons["i_atmosphaere"].documentElement.cloneNode(true)))
  .attr("x", t1_icon_width / 2 - t1_icon_size / 2)
  .attr("y", 0)
  .attr("width", t1_icon_size)
  .attr("height", t1_icon_size)
  .attr("preserveAspectRatio", "xMidYMid slice");

t1_icons.append("rect")
  .attr("x", 0)
  .attr("y", t1_icon_size + t1_icon_vspace)
  .attr("width", t1_icon_width)
  .attr("height", t1_icon_height)
  .attr("fill", wwfColor.black)

t1_icons.append("text")
  .attr("id", "t1_ppm_icon")
  .attr("x", t1_icon_width / 2)
  .attr("y", t1_icon_size + t1_icon_vspace + t1_icon_height / 2)
  .attr("fill", wwfColor.white)
  .attr("font-weight", fontWeight.bold)
  .attr("letter-spacing", letterSpacing)
  .text("328 ppm")
  .style("dominant-baseline", "central")
  .style("text-anchor", "middle")
  .style("font-size", fontSize.normal)
  .attr("letter-spacing", letterSpacing)

t1_icons.append("text")
  .text("Konzentration in")
  .attr("x", t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
  .attr("letter-spacing", letterSpacing)
t1_icons.append("text")
  .text("der Atmosphäre")
  .attr("x", t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height + t1_icon_text_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
  .attr("letter-spacing", letterSpacing)

// CO2 Icon
$(t1_icons.node().appendChild(icons["i_pollution"].documentElement.cloneNode(true)))
  .attr("x", t1_icon_width + t1_icon_hspace + t1_icon_width / 2 - t1_icon_size / 2)
  .attr("y", 0)
  .attr("width", t1_icon_size)
  .attr("height", t1_icon_size)
  .attr("preserveAspectRatio", "xMidYMid slice");

t1_icons.append("rect")
  .attr("x", t1_icon_width + t1_icon_hspace)
  .attr("y", t1_icon_size + t1_icon_vspace)
  .attr("width", t1_icon_width)
  .attr("height", t1_icon_height)
  .attr("fill", wwfColor.gray1)

t1_icons.append("text")
  .attr("id", "t1_co2_icon")
  .attr("x", t1_icon_width + t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + t1_icon_vspace + t1_icon_height / 2)
  .attr("fill", wwfColor.white)
  .attr("font-weight", fontWeight.bold)
  .attr("letter-spacing", letterSpacing)
  .text("12.547 Mt")
  .style("dominant-baseline", "central")
  .style("text-anchor", "middle")
  .style("font-size", fontSize.normal)
  .attr("letter-spacing", letterSpacing)

t1_icons.append("text")
  .text("Energiebedingte")
  .attr("x", t1_icon_width + t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
  .attr("letter-spacing", letterSpacing)
t1_icons.append("text")
  .text("Emissionen")
  .attr("x", t1_icon_width + t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height + t1_icon_text_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
  .attr("letter-spacing", letterSpacing)

// Temp Icon
$(t1_icons.node().appendChild(icons["i_temperaturen"].documentElement.cloneNode(true)))
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace + t1_icon_width / 2 - t1_icon_size / 2)
  .attr("y", 0)
  .attr("width", t1_icon_size)
  .attr("height", t1_icon_size)
  .attr("preserveAspectRatio", "xMidYMid slice");

t1_icons.append("rect")
  .attr("id", "t1_temp_rect")
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace)
  .attr("y", t1_icon_size + t1_icon_vspace)
  .attr("width", t1_icon_width)
  .attr("height", t1_icon_height);

t1_icons.append("text")
  .attr("id", "t1_temp_icon")
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + t1_icon_vspace + t1_icon_height / 2)
  .attr("fill", wwfColor.black)
  .attr("font-weight", fontWeight.bold)
  .attr("letter-spacing", letterSpacing)
  .text("+0,47 °C")
  .style("dominant-baseline", "central")
  .style("text-anchor", "middle")
  .style("font-size", fontSize.normal)
  .attr("letter-spacing", letterSpacing)

t1_icons.append("text")
  .text("Temperatur-")
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
  .attr("letter-spacing", letterSpacing)
t1_icons.append("text")
  .text("änderung")
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height + t1_icon_text_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
  .attr("letter-spacing", letterSpacing)

if (is_mobile) {
  t1_icons.selectAll("text").style("font-size", fontSize.xsmall);
}

if (is_mobile_xs) {
  t1_icons.selectAll("text").style("font-size", fontSize.xxsmall);
}

// Temperature scale
t1_temperature = t1_tile.append("g").attr("transform", `translate(0, ${t1_chart_total_height + t1_icon_total_height + t1_temperature_offset + t1_puffer * 2 / 3})`);

t1_temperature.append("text")
  .text("Temperaturänderungen")
  .attr("x", width / 2)
  .attr("y", 0)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)

for (const [i, color] of t1_temperature_colors.entries()) {
  t1_temperature.append("rect")
    .attr("x", t1_temperature_lrspace + i * t1_temperature_size)
    .attr("y", t1_temperature_text_height + t1_temperature_vspace)
    .attr("width", t1_temperature_size)
    .attr("height", t1_temperature_size)
    .attr("fill", color)
    .attr("stroke-width", 0)
}

t1_temperature.append("text")
  .attr("id", "t1_temperature_left")
  .text(-t1_temp_global)
  .attr("x", t1_temperature_lrspace)
  .attr("y", t1_temperature_text_height + 2 * t1_temperature_vspace + t1_temperature_size)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)

t1_temperature.append("text")
  .text("0")
  .attr("x", width / 2)
  .attr("y", t1_temperature_text_height + 2 * t1_temperature_vspace + t1_temperature_size)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
  .attr("letter-spacing", letterSpacing)

t1_temperature.append("text")
  .attr("id", "t1_temperature_right")
  .text(t1_temp_global)
  .attr("x", width - t1_temperature_lrspace)
  .attr("y", t1_temperature_text_height + 2 * t1_temperature_vspace + t1_temperature_size)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)

function t1_change_year(to_year) {
  const t1_chart = t1_tile.select("#t1_chart");

  // Remove data from previous selection
  t1_chart.select("#t1_current_year").remove();
  t1_chart.select("#t1_current_line").remove();
  t1_chart.select("#t1_current_circle").remove();

  const color = (t1_mode == "global") ? t1_color_global : t1_color_brd;
  const co2_max = (t1_mode == "global") ? t1_co2_global_max : t1_co2_brd_max;

  const year = parseInt(to_year);
  const year_data = tiles[1][t1_mode].find(element => element.year == year);

  t1_chart.append("rect")
    .attr("id", "t1_current_year")
    .attr("x", t1_x(year) - t1_selected_bar_width / 2)
    .attr("y", t1_y(year_data.ppm))
    .attr("width", t1_selected_bar_width)
    .attr("height", t1_chart_height - t1_y(year_data.ppm))
    .attr("fill",  color(year_data.temperature))
    .attr("stroke-width", 1)
    .attr("stroke", "rgb(0,0,0)")

  if (year_data.co2 != null) {
    t1_chart.append("line")
      .attr("id", "t1_current_line")
      .attr("x1", t1_x(year))
      .attr("x2", t1_x(year))
      .attr("y1", t1_y(year_data.ppm))
      .attr("y2", t1_y2(t1_y2.domain()[1]))
      .attr("stroke", wwfColor.black)
      .attr("stroke-width", dash_width)
      .attr("stroke-dasharray", dash_spacing)

    t1_chart.append("circle")
      .attr("id", "t1_current_circle")
      .attr("cx", t1_x(year))
      .attr("cy", t1_y2(year_data.co2))
      .attr("r", circle_width)
      .attr("fill", wwfColor.gray2);
  }

  t1_tile.select("#t1_ppm_icon").text(year_data.ppm.toFixed(0) + " ppm");
  const current_co2 = (year_data.co2 == null) ? "- Mt" : year_data.co2.toLocaleString(undefined, {maximumFractionDigits: 0}) + " Mt";
  t1_tile.select("#t1_co2_icon").text(current_co2);
  t1_tile.select("#t1_temp_icon").text(year_data.temperature.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " °C");
  const current_temp = t1_mode == "global" ? t1_temp_global : t1_temp_brd;
  const use_white = year_data.temperature >= current_temp - 3 * (2 * current_temp / 16);
  t1_tile.select("#t1_temp_icon").attr("fill", (use_white) ? "white" : "black")
  t1_tile.select("#t1_temp_rect").attr("fill", color(year_data.temperature))
}

function t1_update_chart() {
  const t1_chart = t1_tile.select("#t1_chart");

  const color = (t1_mode == "global") ? t1_color_global : t1_color_brd;
  const co2_max = (t1_mode == "global") ? t1_co2_global_max : t1_co2_brd_max;

  t1_y2 = d3.scaleLinear()
    .range([ t1_chart_height, 0 ])
    .domain([0, co2_max * 1.2]);

  // Y2-Axis (CO2)
  t1_chart.append("g")
    .attr("id", "t1_yaxis2")
    .call(
      d3.axisLeft(t1_y2)
    )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-weight", fontWeight.bold)
    .attr("letter-spacing", letterSpacing)
    .attr("font-size", fontSize.xsmall)
  d3.select("#t1_yaxis2").select('.domain').attr('stroke-width', 0);
  d3.select("#t1_yaxis2").selectAll(".tick").select("line").attr("stroke-width", 0);

  // Temperatures
  t1_chart.selectAll(null)
    .data(tiles[1][t1_mode])
    .enter()
    .append("rect")
      .attr("x", function(d) { return t1_x(d.year); })
      .attr("y", function(d) { return t1_y(d.ppm); })
      .attr("width", t1_x.bandwidth())
      .attr("height", function(d) { return t1_chart_height - t1_y(d.ppm); })
      .attr("fill",  function(d) { return color(d.temperature); });

  // PPM
  t1_chart.append("path")
    .datum(tiles[1].global)
    .attr("fill", "none")
    .attr("stroke", wwfColor.black)
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) { return t1_x(d.year) + t1_x.bandwidth() / 2 })
      .y(function(d) { return t1_y(d.ppm) })
    )

  // CO2
  t1_chart.append("path")
    .datum(tiles[1][t1_mode])
    .attr("fill", "none")
    .attr("stroke", wwfColor.gray2)
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) { return t1_x(d.year) + t1_x.bandwidth() / 2 })
      .y(function(d) { return t1_y2(d.co2) })
      .defined(function (d) { return d.co2 !== null; })
    )
}

function t1_change_mode(mode) {
  t1_mode = mode;
  const temp = (mode == "global") ? t1_temp_global : t1_temp_brd;
  if (mode == "global") {
    $("#t1_global").addClass("active");
    $("#t1_brd").removeClass("active");
  } else {
    $("#t1_brd").addClass("active");
    $("#t1_global").removeClass("active");
  }
  t1_tile.select("#t1_temperature_left").text(-temp);
  t1_tile.select("#t1_temperature_right").text(temp);
  t1_tile.select("#t1_chart").remove();
  t1_tile.append("g")
    .attr("id", "t1_chart")
    .attr("transform", `translate(${t1_chart_axes_width}, ${t1_chart_offset + t1_chart_unit_height + t1_chart_unit_offset})`);
  t1_update_chart();
  t1_change_year(document.getElementById('t1_year').value);
}

if ("year" in initials) {
  const t1_year_data = $("#t1_year").data("ionRangeSlider");
  t1_year_data.update({from: initials.year})
}
t1_change_mode(("mode" in initials) ? initials.mode : "global");
