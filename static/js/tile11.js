
let t11_sector;
const t11_emission_years = tiles[11].imports.map(function(d) { return d.year; });

$("#t11_year").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  values: t11_emission_years,
  from: tiles[11].imports[tiles[11].imports.length - 1].year,
  onChange: function (data) {
    t11_change_year(data.from)
  },
  onUpdate: function (data) {
    t11_change_year(data.from)
  }
});

const t11_imports = {
  "coal": {"title": "Steinkohle", "icon": "i_coal"},
  "oil": {"title": "Öl", "icon": "i_oel"},
  "gas": {"title": "Gas", "icon": "i_gas"},
};

const t11_imports_max = Object.keys(t11_imports).reduce(
  (max, key) => {
    if (tiles[11].imports[0][key] > max) {
      return tiles[11].imports[0][key]
    } else {
      return max
    }
  },
  0
);

const t11_height = (is_mobile) ? t11_min_height : (typeof t2_min_height !== 'undefined') ? Math.max(t2_min_height, t11_min_height) : t11_min_height;
const t11_puffer = is_mobile ? 0 : (t11_height - t11_min_height);

const t11_x = d3.scaleLinear()
  .range([ 0, t11_chart_width ])
  .domain([tiles[11].imports[0].year, tiles[11].imports[tiles[11].imports.length - 1].year]);
const t11_y = d3.scaleLinear()
  .range([ t11_chart_height, 0 ])
  .domain([0, t11_imports_max]);
const t11_color = d3.scaleOrdinal()
  .domain(Object.keys(t11_imports))
  .range([wwfColor.black, wwfColor.red, wwfColor.yellow]);

const t11_svg = d3.select("#t11")
  .append("svg")
    .attr("width", width + 2 * share_margin)
    .attr("height", t11_header_height + t11_height + 2 * share_margin);

t11_svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "white");

draw_header(t11_svg, 3, t11_header);

const t11_tile = t11_svg.append("g")
  .attr("transform", `translate(${share_margin}, ${t11_header_height + share_margin})`);

// BAR

const t11_bar_area = t11_tile.append("g").attr("transform", `translate(0, 0)`);
const t11_bar = t11_bar_area.append("g")
  .attr("transform", `translate(0, ${t11_bar_title_height + 2 * t11_bar_vspace})`);

t11_bar_area.append("text")
  .text("Treibhausgasemissionen Deutschland")
  .attr("x", width / 2)
  .attr("y", t11_bar_vspace)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size",fontSize.normal);

t11_bar_area.append("text")
  .text("Mio. t CO2-Äquivalente")
  .attr("x", width / 2)
  .attr("y", t11_bar_vspace + t11_bar_title_height / 2)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")
  .attr("font-weight", fontWeight.thin)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size",fontSize.xsmall);

t11_bar_area.append("rect")
  .attr("x", 0)
  .attr("y", 3 * t11_bar_vspace + t11_bar_title_height + t11_bar_height)
  .attr("width", t11_bar_legend_size)
  .attr("height", t11_bar_legend_size);

t11_bar_area.append("rect")
  .attr("x", width / 2)
  .attr("y", 3 * t11_bar_vspace + t11_bar_title_height + t11_bar_height)
  .attr("width", t11_bar_legend_size)
  .attr("height", t11_bar_legend_size)
  .attr("fill", t11_bar_color_reduction);

t11_bar_area.append("text")
  .text("Emissionen")
  .attr("x", t11_bar_legend_size + legendLeftPadding)
  .attr("y", 3 * t11_bar_vspace + t11_bar_title_height + t11_bar_height + t11_bar_legend_size / 2)
  .attr("text-anchor", "left")
  .attr("dominant-baseline", "central")
  .attr("font-size", fontSize.xsmall)
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing);

t11_bar_area.append("text")
  .text("Emissionsreduktion")
  .attr("x", width / 2 + t11_bar_legend_size + legendLeftPadding)
  .attr("y", 3 * t11_bar_vspace + t11_bar_title_height + t11_bar_height + t11_bar_legend_size / 2)
  .attr("text-anchor", "left")
  .attr("dominant-baseline", "central")
  .attr("font-size", fontSize.xsmall)
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing);


// DIVIDING-line
t11_tile.append("line")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", t11_bar_total_height + t11_puffer / 2 + t11_icon_offset / 2)
  .attr("y2", t11_bar_total_height + t11_puffer / 2 + t11_icon_offset / 2)
  .attr("stroke", tickColor)
  .attr("stroke-width", 1);

// ICONS

const t11_icons = t11_tile.append("g").attr("transform", `translate(0, ${t11_bar_total_height + t11_puffer + t11_icon_offset})`);
const t11_icon_left = (width - 5 * t11_circle_size - 4 * t11_icon_hspace) / 2;
for (const [i, sector] of Object.keys(t11_sectors).entries()) {
  const icon = t11_sectors[sector].icon;
  const x = t11_icon_left + i * (t11_circle_size + t11_icon_hspace) + t11_circle_size / 2;
  t11_icons.append("circle")
    .attr("id", "t11_circle_" + sector)
    .attr("onclick", `t11_change_sector("${sector}")`)
    .attr("onmouseover", function() { d3.select(this).style("cursor", "pointer"); })
    .attr("cx", x)
    .attr("cy", t11_circle_size / 2)
    .attr("r", t11_circle_size / 2)
    .attr("fill", t11_circe_color_gray);
  $(t11_icons.node().appendChild(icons[icon].documentElement.cloneNode(true)))
    .attr("onclick", `t11_change_sector("${sector}")`)
    .attr("onmouseover", function() { d3.select(this).style("cursor", "pointer"); })
    .attr("id", "t11_icon_" + sector)
    .attr("x", x - t11_icon_size / 2)
    .attr("y", t11_circle_size / 2 - t11_icon_size / 2)
    .attr("width", t11_icon_size)
    .attr("height", t11_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");
}

// Selected sector title
t11_icons.append("text")
  .attr("id", "t11_sector_title")
  .text("")
  .attr("x", width / 2)
  .attr("y", t11_circle_size + t11_icon_vspace)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")

// CHART
const t11_chart_area = t11_tile.append("g").attr("transform", `translate(0, ${t11_bar_total_height + t11_puffer + t11_icon_total_height})`);
const t11_chart = t11_chart_area.append("g").attr("transform", `translate(${t11_chart_axes_width}, ${t11_chart_unit_height})`);

// Unit
t11_chart_area.append("text")
  .text("Mio. t CO2-Äquivalente")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.gray2)
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing)

// X-Axis
t11_chart.append("g")
  .attr("id", "t11_xaxis")
  .attr("transform", "translate(0," + t11_chart_height + ")")
  .call(
    d3.axisBottom(t11_x).ticks(3).tickFormat(
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
d3.select("#t11_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t11_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

t11_chart.append("line")
  .attr("x1", 0)
  .attr("x2", t11_chart_width)
  .attr("y1", t11_chart_height)
  .attr("y2", t11_chart_height)
  .attr("stroke", wwfColor.black)
  .attr("stroke-width", chart_axis_stroke_width);

// Y-Axis
t11_chart.append("g")
  .attr("id", "t11_yaxis")
  .call(
    d3.axisLeft(t11_y)
  )
  .selectAll("text")
    .attr("text-anchor", "end")
    .attr("fill", wwfColor.gray2)
    .attr("font-size", fontSize.xsmall)
    .attr("font-weight", fontWeight.thin);
d3.select("#t11_yaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t11_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

const t11_y_grid = t11_chart.append("g")
  .call(
    d3.axisLeft(t11_y)
      .tickSize(-t11_chart_width)
      .tickFormat('')
      .ticks(5)
    )
t11_y_grid.selectAll(".tick").select("line")
  .attr("stroke-width", tickStrokeWidth)
  .attr("stroke", tickColor)
t11_y_grid.select('.domain').attr('stroke-width', 0);

// Grayed sector paths
for (const sector of Object.keys(t11_sectors)) {
  t11_chart.append("path")
    .datum(tiles[3].sectors)
    .attr("fill", "none")
    .attr("stroke", "#E2E2E2")
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) {return t11_x(d.year)})
      .y(function(d) {return t11_y(d[sector])})
    )
}

function t11_change_year(year_index) {
  const year = t11_emission_years[year_index];
  const year_data = tiles[3].emissions.find(element => element.year == year);

  t11_bar.select("#t11_emissions").remove();
  const t11_emissions = t11_bar.append("g")
    .attr("id", "t11_emissions");

  const middle = width * (year_data.emissions / t11_emissions_1990);
  t11_emissions.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", middle)
    .attr("height", t11_bar_height);
  t11_emissions.append("rect")
    .attr("x", middle)
    .attr("y", 0)
    .attr("width", width - middle)
    .attr("height", t11_bar_height)
    .attr("fill", t11_bar_color_reduction);
  if (middle > 0) {
    t11_emissions.append("text")
      .text(year_data.emissions.toLocaleString(undefined, {maximumFractionDigits: 0}))
      .attr("x", middle / 2)
      .attr("y", t11_bar_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", wwfColor.white)
      .attr("font-weight", fontWeight.bold)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size",fontSize.xsmall);
  }
  if (width - middle > 0) {
    const reduction = t11_emissions_1990 - year_data.emissions;
    t11_emissions.append("text")
      .text(reduction.toLocaleString(undefined, {maximumFractionDigits: 0}))
      .attr("x", middle + (width - middle) / 2)
      .attr("y", t11_bar_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", wwfColor.white)
      .attr("font-weight", fontWeight.bold)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size",fontSize.xsmall);
  }
}

function t11_activate_sector(sector) {
  t11_icons.select("#t11_sector_title")
    .text(t11_sectors[sector].title)
  t11_icons.selectAll("circle")
    .attr("fill", t11_circe_color_gray)
  t11_icons.selectAll("path")
    .style("fill", wwfColor.black)
  t11_icons.select("#t11_circle_" + sector)
    .attr("fill", t11_color(sector))
  t11_icons.select("#t11_icon_" + sector).select("path")
    .style("fill", wwfColor.white)
}

function t11_draw_current_sector(sector) {
  t11_chart.select("#sector_line").remove();
  t11_chart.append("g")
    .attr("id", "sector_line")
    .append("path")
      .datum(tiles[3].sectors)
      .attr("fill", "none")
      .attr("stroke", t11_color(sector))
      .attr("stroke-width", line_width)
      .attr("d", d3.line()
        .x(function(d) {return t11_x(d.year)})
        .y(function(d) {return t11_y(d[sector])})
      )
  t11_chart.select("#sector_number").remove();
  const value = tiles[3].sectors[tiles[3].sectors.length - 1][sector];
  t11_chart.append("text")
    .text(value.toLocaleString(undefined, {maximumFractionDigits: 0}))
    .attr("id", "sector_number")
    .attr("x", t11_chart_width + t11_chart_sector_space)
    .attr("y", t11_y(value))
    .attr("dominant-baseline", "middle")
    .attr("fill", t11_color(sector))
    .attr("font-size", fontSize.xsmall)
    .attr("font-weight", fontWeight.thin);
}

function t11_change_sector(sector) {
  t11_sector = sector;
  t11_activate_sector(sector);
  t11_draw_current_sector(sector);
}

t11_change_sector(("sector" in initials) ? initials.sector : "agriculture");

if ("year" in initials) {
  const init_data = $("#t11_year").data("ionRangeSlider");
  init_data.update({from: t11_emission_years.indexOf(parseInt(initials.year))})
} else {
  t11_change_year(t11_emission_years.length - 1);
}
