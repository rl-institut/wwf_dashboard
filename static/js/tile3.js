
let t3_sector;
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
  },
  onUpdate: function (data) {
    t3_change_year(data.from)
  }
});

const t3_sectors = {
  "agriculture": {"title": "Landwirtschaft", "icon": "i_landwirtschaft"},
  "industry": {"title": "Industrie", "icon": "i_industrie"},
  "traffic": {"title": "Verkehr", "icon": "i_verkehr"},
  "house": {"title": "Gebäude", "icon": "i_gebaeude"},
  "energy": {"title": "Energiewirtschaft", "icon": "i_strom"},
};

const t3_sectors_max = Object.keys(t3_sectors).reduce(
  (max, key) => {
    if (tiles[3].sectors[0][key] > max) {
      return tiles[3].sectors[0][key]
    } else {
      return max
    }
  },
  0
);

const t3_height = (typeof t3_min_height !== 'undefined') ? Math.max(t3_min_height, t3_min_height) : t3_min_height;
const t3_puffer = is_mobile ? 0 : (t3_height - t3_min_height);

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
    .attr("width", width + 2 * share_margin)
    .attr("height", t3_header_height + t3_height + 2 * share_margin);

t3_svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "white");

draw_header(t3_svg, 3, t3_header);

const t3_tile = t3_svg.append("g")
  .attr("transform", `translate(${share_margin}, ${t3_header_height + share_margin})`);

// BAR

const t3_bar_area = t3_tile.append("g").attr("transform", `translate(0, 0)`);
const t3_bar = t3_bar_area.append("g")
  .attr("transform", `translate(0, ${t3_bar_title_height + 2 * t3_bar_vspace})`);

t3_bar_area.append("text")
  .text("Treibhausgasemissionen Deutschland")
  .attr("x", width / 2)
  .attr("y", t3_bar_vspace)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size",fontSize.normal);

t3_bar_area.append("text")
  .text("Mio. t CO2-Äquivalente")
  .attr("x", width / 2)
  .attr("y", t3_bar_vspace + t3_bar_title_height / 2)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")
  .attr("font-weight", fontWeight.thin)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size",fontSize.xsmall);

t3_bar_area.append("rect")
  .attr("x", 0)
  .attr("y", 3 * t3_bar_vspace + t3_bar_title_height + t3_bar_height)
  .attr("width", t3_bar_legend_size)
  .attr("height", t3_bar_legend_size);

t3_bar_area.append("rect")
  .attr("x", width / 2)
  .attr("y", 3 * t3_bar_vspace + t3_bar_title_height + t3_bar_height)
  .attr("width", t3_bar_legend_size)
  .attr("height", t3_bar_legend_size)
  .attr("fill", t3_bar_color_reduction);

t3_bar_area.append("text")
  .text("Emissionen")
  .attr("x", t3_bar_legend_size + legendLeftPadding)
  .attr("y", 3 * t3_bar_vspace + t3_bar_title_height + t3_bar_height + t3_bar_legend_size / 2)
  .attr("text-anchor", "left")
  .attr("dominant-baseline", "central")
  .attr("font-size", fontSize.xsmall)
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing);

t3_bar_area.append("text")
  .text("Emissionsreduktion")
  .attr("x", width / 2 + t3_bar_legend_size + legendLeftPadding)
  .attr("y", 3 * t3_bar_vspace + t3_bar_title_height + t3_bar_height + t3_bar_legend_size / 2)
  .attr("text-anchor", "left")
  .attr("dominant-baseline", "central")
  .attr("font-size", fontSize.xsmall)
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing);


// DIVIDING-line
t3_tile.append("line")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", t3_bar_total_height + t3_puffer / 2 + t3_icon_offset / 2)
  .attr("y2", t3_bar_total_height + t3_puffer / 2 + t3_icon_offset / 2)
  .attr("stroke", tickColor)
  .attr("stroke-width", 1);

// ICONS

const t3_icons = t3_tile.append("g").attr("transform", `translate(0, ${t3_bar_total_height + t3_puffer + t3_icon_offset})`);
const t3_icon_left = (width - 5 * t3_circle_size - 4 * t3_icon_hspace) / 2;
for (const [i, sector] of Object.keys(t3_sectors).entries()) {
  const icon = t3_sectors[sector].icon;
  const x = t3_icon_left + i * (t3_circle_size + t3_icon_hspace) + t3_circle_size / 2;
  t3_icons.append("circle")
    .attr("id", "t3_circle_" + sector)
    .attr("onclick", `t3_change_sector("${sector}")`)
    .attr("onmouseover", function() { d3.select(this).style("cursor", "pointer"); })
    .attr("cx", x)
    .attr("cy", t3_circle_size / 2)
    .attr("r", t3_circle_size / 2)
    .attr("fill", t3_circe_color_gray);
  $(t3_icons.node().appendChild(icons[icon].documentElement.cloneNode(true)))
    .attr("onclick", `t3_change_sector("${sector}")`)
    .attr("onmouseover", function() { d3.select(this).style("cursor", "pointer"); })
    .attr("id", "t3_icon_" + sector)
    .attr("x", x - t3_icon_size / 2)
    .attr("y", t3_circle_size / 2 - t3_icon_size / 2)
    .attr("width", t3_icon_size)
    .attr("height", t3_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");
}

// Selected sector title
t3_icons.append("text")
  .attr("id", "t3_sector_title")
  .text("")
  .attr("x", width / 2)
  .attr("y", t3_circle_size + t3_icon_vspace)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")

// CHART
const t3_chart_area = t3_tile.append("g").attr("transform", `translate(0, ${t3_bar_total_height + t3_puffer + t3_icon_total_height})`);
const t3_chart = t3_chart_area.append("g").attr("transform", `translate(${t3_chart_axes_width}, ${t3_chart_unit_height})`);

// Unit
t3_chart_area.append("text")
  .text("Mio. t CO2-Äquivalente")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.gray2)
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)

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
    .attr("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("font-weight", fontWeight.thin);
d3.select("#t3_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t3_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

t3_chart.append("line")
  .attr("x1", 0)
  .attr("x2", t3_chart_width)
  .attr("y1", t3_chart_height)
  .attr("y2", t3_chart_height)
  .attr("stroke", wwfColor.black)
  .attr("stroke-width", chart_axis_stroke_width);

// Y-Axis
t3_chart.append("g")
  .attr("id", "t3_yaxis")
  .call(
    d3.axisLeft(t3_y)
  )
  .selectAll("text")
    .attr("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("font-weight", fontWeight.thin);
d3.select("#t3_yaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t3_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

const t3_y_grid = t3_chart.append("g")
  .call(
    d3.axisLeft(t3_y)
      .tickSize(-t3_chart_width)
      .tickFormat('')
      .ticks(5)
    )
t3_y_grid.selectAll(".tick").select("line")
  .attr("stroke-width", tickStrokeWidth)
  .attr("stroke", tickColor)
t3_y_grid.select('.domain').attr('stroke-width', 0);

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
    .attr("id", "t3_emissions");

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
      .text(numberWithCommas(year_data.emissions.toFixed(0)))
      .attr("x", middle / 2)
      .attr("y", t3_bar_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", wwfColor.white)
      .attr("font-weight", fontWeight.bold)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size",fontSize.xsmall);
  }
  if (width - middle > 0) {
    const reduction = t3_emissions_1990 - year_data.emissions;
    t3_emissions.append("text")
      .text(numberWithCommas(reduction.toFixed(0)))
      .attr("x", middle + (width - middle) / 2)
      .attr("y", t3_bar_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", wwfColor.white)
      .attr("font-weight", fontWeight.bold)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size",fontSize.xsmall);
  }
}

function t3_activate_sector(sector) {
  t3_icons.select("#t3_sector_title")
    .text(t3_sectors[sector].title)
  t3_icons.selectAll("circle")
    .attr("fill", t3_circe_color_gray)
  t3_icons.selectAll("path")
    .style("fill", wwfColor.black)
  t3_icons.select("#t3_circle_" + sector)
    .attr("fill", t3_color(sector))
  t3_icons.select("#t3_icon_" + sector).select("path")
    .style("fill", wwfColor.white)
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
  t3_chart.select("#sector_number").remove();
  const value = tiles[3].sectors[tiles[3].sectors.length - 1][sector];
  t3_chart.append("text")
    .text(numberWithCommas(value.toFixed(0)))
    .attr("id", "sector_number")
    .attr("x", t3_chart_width + t3_chart_sector_space)
    .attr("y", t3_y(value))
    .attr("dominant-baseline", "middle")
    .attr("fill", t3_color(sector))
    .attr("font-size", fontSize.xsmall)
    .attr("font-weight", fontWeight.thin);
}

function t3_change_sector(sector) {
  t3_sector = sector;
  t3_activate_sector(sector);
  t3_draw_current_sector(sector);
}

t3_change_sector(("sector" in initials) ? initials.sector : "agriculture");

if ("year" in initials) {
  const init_data = $("#t3_year").data("ionRangeSlider");
  init_data.update({from: t3_emission_years.indexOf(parseInt(initials.year))})
} else {
  t3_change_year(t3_emission_years.length - 1);
}
