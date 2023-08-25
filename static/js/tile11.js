
let t11_import_type;
const t11_years = tiles[11].imports.map(function(d) { return d.year; });

$("#t11_year").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  values: t11_years,
  from: tiles[11].imports[tiles[11].imports.length - 1].year,
  onChange: function (data) {
    t11_change_year(data.from);
  },
  onUpdate: function (data) {
    t11_change_year(data.from);
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
      return tiles[11].imports[0][key];
    } else {
      return max;
    }
  },
  0
);

const t11_height = get_tile_height(11);
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
const t11_text_color = d3.scaleOrdinal()
  .domain(Object.keys(t11_imports))
  .range([wwfColor.white, wwfColor.white, wwfColor.black]);

const t11_svg = d3.select("#t11")
  .append("svg")
    .attr("width", width + 2 * share_margin)
    .attr("height", t11_header_height + t11_height + 2 * share_margin);

t11_svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "white");

draw_header(t11_svg, 11, t11_header);

const t11_tile = t11_svg.append("g")
  .attr("transform", `translate(${share_margin}, ${t11_header_height + share_margin})`);


// ICONS

const t11_icons = t11_tile.append("g").attr("transform", `translate(0, ${t11_puffer + t11_icon_offset})`);
const t11_icon_left = (width - 3 * t11_circle_size - 2 * t11_icon_hspace) / 2;
for (const [i, import_type] of Object.keys(t11_imports).entries()) {
  const icon = t11_imports[import_type].icon;
  const x = t11_icon_left + i * (t11_circle_size + t11_icon_hspace) + t11_circle_size / 2;
  t11_icons.append("circle")
    .attr("id", "t11_circle_" + import_type)
    .attr("onclick", `t11_change_import_type("${import_type}")`)
    .attr("onmouseover", function() { d3.select(this).style("cursor", "pointer"); })
    .attr("cx", x)
    .attr("cy", t11_circle_size / 2)
    .attr("r", t11_circle_size / 2)
    .attr("fill", t11_circe_color_gray);
  $(t11_icons.node().appendChild(icons[icon].documentElement.cloneNode(true)))
    .attr("onclick", `t11_change_import_type("${import_type}")`)
    .attr("onmouseover", function() { d3.select(this).style("cursor", "pointer"); })
    .attr("id", "t11_icon_" + import_type)
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
  .attr("dominant-baseline", "hanging");

// CHART
const t11_chart_area = t11_tile.append("g").attr("transform", `translate(0, ${t11_puffer + t11_icon_total_height})`);
const t11_chart = t11_chart_area.append("g").attr("transform", `translate(${t11_chart_axes_width}, ${t11_chart_unit_height})`);

// Unit
t11_chart_area.append("text")
  .text("Fossile Energieimporte (TWh)")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dominant-baseline", "hanging")
  .attr("fill", wwfColor.gray2)
  .style("font-size", fontSize.xsmall)
  .attr("letter-spacing", letterSpacing);

// X-Axis
t11_chart.append("g")
  .attr("id", "t11_xaxis")
  .attr("transform", "translate(0," + t11_chart_height + ")")
  .call(
    d3.axisBottom(t11_x).ticks(3).tickFormat(
      function(year) {
        return year;
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
    );
t11_y_grid.selectAll(".tick").select("line")
  .attr("stroke-width", tickStrokeWidth)
  .attr("stroke", tickColor);
t11_y_grid.select('.domain').attr('stroke-width', 0);

// Grayed sector paths
for (const import_type of Object.keys(t11_imports)) {
  t11_chart.append("path")
    .datum(tiles[11].imports)
    .attr("fill", "none")
    .attr("stroke", "#E2E2E2")
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) {return t11_x(d.year);})
      .y(function(d) {return t11_y(d[import_type]);})
    );
}

// BARS

const t11_bar_area = t11_tile.append("g").attr("transform", `translate(0, ${t11_puffer + t11_icon_total_height + t11_chart_total_height + t11_bar_offset})`);

t11_bar_area.append("text")
  .text("Importabhängigkeit Deutschlands")
  .attr("x", width / 2)
  .attr("text-anchor", "middle")
  .attr("letter-spacing", letterSpacing)
  .attr("dominant-baseline", "hanging");

t11_bar_area.append("text")
  .text("und Hauptlieferländer (%)")
  .attr("x", width / 2)
  .attr("y", t11_bar_title_height / 2)
  .attr("text-anchor", "middle")
  .attr("letter-spacing", letterSpacing)
  .attr("dominant-baseline", "hanging");

const t11_bar_width = t11_chart_width - t11_bar_text_offset - t11_bar_text_width;

const t11_bar = t11_bar_area.append("g").attr("transform", `translate(0, ${t11_bar_title_height + t11_bar_title_offset})`);

t11_bar.append("text")
  .text("Importabhängigkeit")
  .attr("x", t11_bar_width + t11_bar_text_offset)
  .attr("y", t11_bar_height / 2)
  .attr("text-anchor", "start")
  .attr("dominant-baseline", "middle")
  .attr("fill", wwfColor.black)
  .attr("font-weight", fontWeight.bold)
  .style("font-size", fontSize.small)
  .attr("letter-spacing", letterSpacing);

t11_bar.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", t11_bar_width)
  .attr("height", t11_bar_height)
  .attr("fill", wwfColor.gray3);

function t11_change_year(year_index) {
  const year = t11_years[year_index];
  const year_data = tiles[11][t11_import_type].find(element => element.year == year);

  t11_chart.select("#t11_year_line").remove();
  t11_chart.append("line")
    .attr("id", "t11_year_line")
    .attr("x1", t11_x(year))
    .attr("x2", t11_x(year))
    .attr("y1", 0)
    .attr("y2", t11_chart_height)
    .attr("stroke", wwfColor.black)
    .attr("stroke-width", dash_width)
    .attr("stroke-dasharray", dash_spacing);

  const t11_bar_imports_x = d3.scaleLinear()
    .range([0, t11_bar_width])
    .domain([0, 100]);

  t11_bar.select("#t11_imports").remove();
  const t11_imports = t11_bar.append("g")
    .attr("id", "t11_imports");

  // Total imports
  t11_imports.append("rect")
    .attr("x", t11_bar_width - t11_bar_imports_x(year_data.import))
    .attr("y", 0)
    .attr("width", t11_bar_imports_x(year_data.import))
    .attr("height", t11_bar_height)
    .attr("fill", t11_color(t11_import_type));

  t11_imports.append("text")
    .text(year_data["import"].toLocaleString(undefined, {maximumFractionDigits: 0}))
    .attr("x", t11_bar_width - t11_bar_text_offset)
    .attr("y", t11_bar_height / 2)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .attr("fill", t11_text_color(t11_import_type))
    .attr("font-weight", fontWeight.bold)
    .style("font-size", fontSize.small)
    .attr("letter-spacing", letterSpacing);

  countries = Object.keys(year_data).filter(key => !["year", "import"].includes(key));
  for (const [i, country] of countries.entries()) {
    t11_imports.append("rect")
      .attr("x", t11_bar_width - t11_bar_imports_x(year_data[country]))
      .attr("y", t11_bar_height + t11_bar_top_vspace + i * (t11_bar_height + t11_bar_vspace))
      .attr("width", t11_bar_imports_x(year_data[country]))
      .attr("height", t11_bar_height)
      .attr("fill", t11_color(t11_import_type));

    $(t11_imports.node().appendChild(icons[t11_flags[country]].documentElement.cloneNode(true)))
      .attr("x", t11_bar_width + t11_bar_text_offset)
      .attr("y", t11_bar_height + t11_bar_top_vspace + i * (t11_bar_height + t11_bar_vspace) + t11_bar_height / 2 - t11_bar_flag_size / 2)
      .attr("width", t11_bar_flag_size)
      .attr("height", t11_bar_flag_size)
      .attr("preserveAspectRatio", "xMidYMid slice");

    t11_imports.append("text")
      .text(country)
      .attr("x", t11_bar_width + t11_bar_flag_size + 2 * t11_bar_text_offset)
      .attr("y", t11_bar_height + t11_bar_top_vspace + i * (t11_bar_height + t11_bar_vspace) + t11_bar_height / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("fill", wwfColor.black)
      .attr("font-weight", fontWeight.normal)
      .style("font-size", fontSize.small)
      .attr("letter-spacing", letterSpacing);

    if (year_data[country] < 9) {
      t11_imports.append("text")
        .text(year_data[country].toLocaleString(undefined, {maximumFractionDigits: 0}))
        .attr("x", t11_bar_width - t11_bar_imports_x(year_data[country]) - t11_bar_text_offset)
        .attr("y", t11_bar_height + t11_bar_top_vspace + i * (t11_bar_height + t11_bar_vspace) + t11_bar_height / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", wwfColor.black)
        .attr("font-weight", fontWeight.bold)
        .style("font-size", fontSize.small)
        .attr("letter-spacing", letterSpacing);
    } else {
      t11_imports.append("text")
        .text(year_data[country].toLocaleString(undefined, {maximumFractionDigits: 0}))
        .attr("x", t11_bar_width - t11_bar_text_offset)
        .attr("y", t11_bar_height + t11_bar_top_vspace + i * (t11_bar_height + t11_bar_vspace) + t11_bar_height / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", t11_text_color(t11_import_type))
        .attr("font-weight", fontWeight.bold)
        .style("font-size", fontSize.small)
        .attr("letter-spacing", letterSpacing);
    }
  }
}

function t11_activate_import_type(import_type) {
  t11_icons.select("#t11_sector_title")
    .text(t11_imports[import_type].title);
  t11_icons.selectAll("circle")
    .attr("fill", t11_circe_color_gray);
  t11_icons.selectAll("path")
    .style("fill", wwfColor.black);
  t11_icons.select("#t11_circle_" + import_type)
    .attr("fill", t11_color(import_type));
  t11_icons.select("#t11_icon_" + import_type).select("path")
    .style("fill", wwfColor.white);
}

function t11_draw_current_import_type(import_type) {
  t11_chart.select("#import_type_line").remove();
  t11_chart.append("g")
    .attr("id", "import_type_line")
    .append("path")
      .datum(tiles[11].imports)
      .attr("fill", "none")
      .attr("stroke", t11_color(import_type))
      .attr("stroke-width", line_width)
      .attr("d", d3.line()
        .x(function(d) {return t11_x(d.year);})
        .y(function(d) {return t11_y(d[import_type]);})
      );
  t11_chart.select("#import_type_number").remove();
  const value = tiles[11].imports[tiles[11].imports.length - 1][import_type];
  t11_chart.append("text")
    .text(value.toLocaleString(undefined, {maximumFractionDigits: 0}))
    .attr("id", "import_type_number")
    .attr("x", t11_chart_width + t11_chart_import_type_space)
    .attr("y", t11_y(value))
    .attr("dominant-baseline", "middle")
    .attr("fill", t11_color(import_type))
    .attr("font-size", fontSize.xsmall)
    .attr("font-weight", fontWeight.thin);
}

function t11_change_import_type(import_type) {
  t11_import_type = import_type;
  t11_activate_import_type(import_type);
  t11_draw_current_import_type(import_type);
  t11_change_year($("#t11_year").data("ionRangeSlider").result.from);
}

t11_import_type = ("import_type" in initials) ? initials.import_type : "coal";
if ("year" in initials) {
  const init_data = $("#t11_year").data("ionRangeSlider");
  init_data.update({from: t11_years.indexOf(parseInt(initials.year))});
} else {
  t11_change_year(t11_years.length - 1);
}

t11_change_import_type(t11_import_type);
