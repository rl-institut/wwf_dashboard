
const t3_emission_years = tiles[3].emissions.map(function(d) { return d.year; });

$("#t3_year").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  values: t3_emission_years,
  from: tiles[3].emissions[tiles[3].emissions.length - 1].year,
  onChange: function (data) {
    t3_change_year(data.from)
  }
});

const t3_sectors = {
  "agriculture": {"title": "Landwirtschaft", "icon": "i_landwirtschaft"},
  "industry": {"title": "Industrie", "icon": "i_industrie"},
  "traffic": {"title": "Verkehr", "icon": "i_verkehr"},
  "house": {"title": "Gebäude", "icon": "i_gebaeude"},
  "energy": {"title": "Energiewirtschaft", "icon": "i_strom"},
  "total": {"title": "Gesamt", "icon": "i_summe"}
};

const t3_sectors_max = tiles[3].sectors.reduce(function(max, current){if (current.total > max) {return current.total} else {return max}}, 0);

const t3_height = (typeof t4_min_height !== 'undefined') ? Math.max(t3_min_height, t4_min_height) : t3_min_height;
const t3_puffer = is_mobile ? 0 : (t3_height - t3_bar_total_height - t3_chart_total_height) / 2;

const t3_emissions_1990 = tiles[3].emissions[0].emissions;

const t3_x = d3.scaleLinear()
  .range([ 0, t3_chart_width ])
  .domain([tiles[3].sectors[0].year, tiles[3].sectors[tiles[3].sectors.length - 1].year]);
const t3_y = d3.scaleLinear()
  .range([ t3_chart_height, 0 ])
  .domain([0, t3_sectors_max]);
const t3_color = d3.scaleOrdinal()
  .domain(Object.keys(t3_sectors))
  .range(["#6C3B24", "#724284", "#006386", "#D82D45", "#A63066", "#137534"]);

const t3_svg = d3.select("#t3")
  .append("svg")
    .attr("width", width)
    .attr("height", t3_height)
  .append("g");

// BAR

const t3_bar = t3_svg.append("g").attr("transform", `translate(0, ${t3_puffer})`);
t3_bar.append("text")
  .text("Globale Treibhausgasemissionen")
  .attr("x", width / 2)
  .attr("y", t3_bar_vspace)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging");

t3_bar.append("text")
  .text("Mio. t CO2-Äquivalente")
  .attr("x", width / 2)
  .attr("y", t3_bar_vspace + t3_bar_title_height / 2)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging");

t3_bar.append("rect")
  .attr("x", 0)
  .attr("y", 3 * t3_bar_vspace + t3_bar_title_height + t3_bar_height)
  .attr("width", t3_bar_legend_size)
  .attr("height", t3_bar_legend_size);

t3_bar.append("rect")
  .attr("x", width / 2)
  .attr("y", 3 * t3_bar_vspace + t3_bar_title_height + t3_bar_height)
  .attr("width", t3_bar_legend_size)
  .attr("height", t3_bar_legend_size)
  .attr("fill", t3_bar_color_reduction);

t3_bar.append("text")
  .text("Emissionen")
  .attr("x", 2 * t3_bar_legend_size)
  .attr("y", 3 * t3_bar_vspace + t3_bar_title_height + t3_bar_height + t3_bar_legend_size / 2)
  .attr("text-anchor", "left")
  .attr("dominant-baseline", "middle");

t3_bar.append("text")
  .text("Emissionsreduktion")
  .attr("x", width / 2 + 2 * t3_bar_legend_size)
  .attr("y", 3 * t3_bar_vspace + t3_bar_title_height + t3_bar_height + t3_bar_legend_size / 2)
  .attr("text-anchor", "left")
  .attr("dominant-baseline", "middle");

// ICONS

const t3_icons = t3_svg.append("g").attr("transform", `translate(0, ${t3_bar_total_height + 2 * t3_puffer})`);
const t3_icon_left = (width - 6 * t3_circle_size - 5 * t3_icon_hspace) / 2;
for (const [i, sector] of Object.keys(t3_sectors).entries()) {
  const icon = t3_sectors[sector].icon;
  const x = t3_icon_left + i * (t3_circle_size + t3_icon_hspace) + t3_circle_size / 2;
  t3_icons.append("circle")
    .attr("id", "t3_circle_" + sector)
    .attr("onclick", `t3_change_sector("${sector}")`)
    .attr("cx", x)
    .attr("cy", t3_circle_size / 2)
    .attr("r", t3_circle_size / 2)
    .attr("fill", t3_circe_color_gray);
  $(t3_icons.node().appendChild(icons[icon].documentElement.cloneNode(true)))
    .attr("onclick", `t3_change_sector("${sector}")`)
    .attr("id", "t3_icon_" + sector)
    .attr("x", x - t3_icon_size / 2)
    .attr("y", t3_circle_size / 2 - t3_icon_size / 2)
    .attr("width", t3_icon_size)
    .attr("height", t3_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");
}


// CHART
const t3_chart = t3_svg.append("g").attr("transform", `translate(${t3_chart_axes_width}, ${t3_bar_total_height + 2 * t3_puffer + t3_chart_offset})`);

// X-Axis
t3_chart.append("g")
  .attr("id", "t3_xaxis")
  .attr("transform", "translate(0," + t3_chart_height + ")")
  .call(
    d3.axisBottom(t3_x).ticks(3).tickFormat(
      function(year) {
        return year
      }
    )
  )
  .selectAll("text")
    .attr("text-anchor", "end");
d3.select("#t3_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t3_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y-Axis
t3_chart.append("g")
  .attr("id", "t3_yaxis")
  .call(
    d3.axisLeft(t3_y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t3_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Grayed sector paths
for (const sector of Object.keys(t3_sectors)) {
  t3_chart.append("path")
    .datum(tiles[3].sectors)
    .attr("fill", "none")
    .attr("stroke", "#E2E2E2")
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) {return t3_x(d.year)})
      .y(function(d) {return t3_y(d[sector])})
    )
}

function t3_change_year(year_index) {
  const year = t3_emission_years[year_index];
  const year_data = tiles[3].emissions.find(element => element.year == year);

  t3_bar.select("#t3_emissions").remove();
  const t3_emissions = t3_bar.append("g")
    .attr("id", "t3_emissions")
    .attr("transform", `translate(0, ${t3_bar_title_height + 2 * t3_bar_vspace})`);

  const middle = width * (year_data.emissions / t3_emissions_1990);
  t3_emissions.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", middle)
    .attr("height", t3_bar_height);
  t3_emissions.append("rect")
    .attr("x", middle)
    .attr("y", 0)
    .attr("width", width - middle)
    .attr("height", t3_bar_height)
    .attr("fill", t3_bar_color_reduction);
  if (middle > 0) {
    t3_emissions.append("text")
      .text(year_data.emissions.toFixed(0))
      .attr("x", middle / 2)
      .attr("y", t3_bar_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white");
  }
  if (width - middle > 0) {
    const reduction = t3_emissions_1990 - year_data.emissions;
    t3_emissions.append("text")
      .text(reduction.toFixed(0))
      .attr("x", middle + (width - middle) / 2)
      .attr("y", t3_bar_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white");
  }
}

function t3_activate_sector(sector) {
  t3_icons.selectAll("circle")
    .attr("fill", t3_circe_color_gray)
  t3_icons.selectAll("path")
    .style("fill", "black")
  t3_icons.select("#t3_circle_" + sector)
    .attr("fill", t3_color(sector))
  t3_icons.select("#t3_icon_" + sector).select("path")
    .style("fill", "white")
}

function t3_draw_current_sector(sector) {
  t3_chart.select("#sector_line").remove();
  t3_chart.append("g")
    .attr("id", "sector_line")
    .append("path")
      .datum(tiles[3].sectors)
      .attr("fill", "none")
      .attr("stroke", t3_color(sector))
      .attr("stroke-width", line_width)
      .attr("d", d3.line()
        .x(function(d) {return t3_x(d.year)})
        .y(function(d) {return t3_y(d[sector])})
      )
}

function t3_change_sector(sector) {
  t3_activate_sector(sector);
  t3_draw_current_sector(sector);
}

t3_change_sector("total");
t3_change_year(5);
