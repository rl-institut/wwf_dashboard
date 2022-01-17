
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
  }
});

const t1_ppm_max = tiles[1].global.reduce(function(max, current){if (current.ppm > max) {return current.ppm} else {return max}}, 0);
const t1_co2_global_max = tiles[1].global.reduce(function(max, current){if (current.co2 > max) {return current.co2} else {return max}}, 0);
const t1_co2_brd_max = tiles[1].brd.reduce(function(max, current){if (current.co2 > max) {return current.co2} else {return max}}, 0);

const t1_x = d3.scaleBand()
  .range([ 0, chart_width ])
  .domain(tiles[1].global.map(function(d) { return d.year; }))
const t1_y = d3.scaleLinear()
  .range([ t1_chart_height, 0 ])
  .domain([0, t1_ppm_max]);
let t1_y2 = d3.scaleLinear()
  .range([ t1_chart_height, 0 ])
  .domain([0, t1_co2_global_max]);
const t1_color_global = d3.scaleQuantize()
  .domain([-0.75, 0.75])
  .range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]);
  const t1_color_brd = d3.scaleQuantize()
    .domain([-2.6, 2.6])
    .range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]);

const t1_selected_bar_width = t1_x.bandwidth() * 2;

const t1_svg = d3.select("#t1")
  .append("svg")
    .attr("width", width)
    .attr("height", height);

// X-Axis
t1_svg.append("g")
  .attr("id", "t1_xaxis")
  .attr("transform", `translate(${t1_chart_axes_width}, ${t1_chart_height})`)
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
  .attr("transform", `translate(${chart_width + t1_chart_axes_width}, 0)`)
  .call(
    d3.axisRight(t1_y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t1_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y2-Axis (CO2)
t1_svg.append("g")
  .attr("id", "t1_yaxis2")
  .attr("transform", `translate(${t1_chart_axes_width}, 0)`)
  .call(
    d3.axisLeft(t1_y2)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t1_yaxis2").selectAll(".tick").select("line").attr("stroke-width", 0);

// ICONS

const t1_icons = t1_svg.append("g").attr("transform", `translate(0, ${t1_chart_total_height})`);

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

t1_icons.append("text")
  .text("Konzentration in")
  .attr("x", t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
t1_icons.append("text")
  .text("der Atmosphäre")
  .attr("x", t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height + t1_icon_text_height / 2)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)

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

t1_icons.append("text")
  .text("Energiebedingte")
  .attr("x", t1_icon_width + t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
t1_icons.append("text")
  .text("Emissionen")
  .attr("x", t1_icon_width + t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height + t1_icon_text_height / 2)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)

// Temp Icon
$(t1_icons.node().appendChild(icons["i_temperaturen"].documentElement.cloneNode(true)))
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace + t1_icon_width / 2 - t1_icon_size / 2)
  .attr("y", 0)
  .attr("width", t1_icon_size)
  .attr("height", t1_icon_size)
  .attr("preserveAspectRatio", "xMidYMid slice");

t1_icons.append("rect")
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace)
  .attr("y", t1_icon_size + t1_icon_vspace)
  .attr("width", t1_icon_width)
  .attr("height", t1_icon_height)
  .attr("fill", "#FEE1D3")

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

t1_icons.append("text")
  .text("Temperatur-")
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)
t1_icons.append("text")
  .text("änderung")
  .attr("x", 2 * t1_icon_width + 2 * t1_icon_hspace + t1_icon_width / 2)
  .attr("y", t1_icon_size + 2 * t1_icon_vspace + t1_icon_height + t1_icon_text_height / 2)
  .attr("dominant-baseline", "hanging")
  .attr("text-anchor", "middle")
  .style("font-size", fontSize.small)

function t1_change_year(to_year) {
  const t1_chart = t1_svg.select("#t1_chart");

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
    .attr("stroke-width", line_width)
    .attr("stroke", "rgb(0,0,0)")

  if (year_data.co2 != null) {
    t1_chart.append("line")
      .attr("id", "t1_current_line")
      .attr("x1", t1_x(year))
      .attr("x2", t1_x(year))
      .attr("y1", t1_y(year_data.ppm))
      .attr("y2", t1_y2(co2_max))
      .attr("stroke", wwfColor.black)
      .attr("stroke-width", line_width)
      .attr("stroke-dasharray", "4")

    t1_chart.append("circle")
      .attr("id", "t1_current_circle")
      .attr("cx", t1_x(year))
      .attr("cy", t1_y2(year_data.co2))
      .attr("r", circle_width)
  }

  t1_svg.select("#t1_ppm_icon").text(year_data.ppm.toFixed(1) + " ppm");
  const current_co2 = (year_data.co2 == null) ? "- Mt" : year_data.co2.toFixed(3) + " Mt";
  t1_svg.select("#t1_co2_icon").text(current_co2);
  t1_svg.select("#t1_temp_icon").text(year_data.temperature.toFixed(2) + " °C");
}

function t1_update_chart() {
  const t1_chart = t1_svg.select("#t1_chart");

  const color = (t1_mode == "global") ? t1_color_global : t1_color_brd;
  const co2_max = (t1_mode == "global") ? t1_co2_global_max : t1_co2_brd_max;

  t1_y2 = d3.scaleLinear()
    .range([ t1_chart_height, 0 ])
    .domain([0, co2_max]);

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
    .attr("stroke", "gray")
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) { return t1_x(d.year) + t1_x.bandwidth() / 2 })
      .y(function(d) { return t1_y(d.ppm) })
    )

  // CO2
  t1_chart.append("path")
    .datum(tiles[1][t1_mode])
    .attr("fill", "none")
    .attr("stroke", wwfColor.black)
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) { return t1_x(d.year) + t1_x.bandwidth() / 2 })
      .y(function(d) { return t1_y2(d.co2) })
      .defined(function (d) { return d.co2 !== null; })
    )
}

function t1_change_mode(mode) {
  t1_mode = mode;
  t1_svg.select("#t1_chart").remove();
  t1_svg.append("g")
    .attr("id", "t1_chart")
    .attr("transform", `translate(${t1_chart_axes_width}, 0)`);
  t1_update_chart();
  t1_change_year(document.getElementById('t1_year').value);
}

t1_change_mode("brd");
