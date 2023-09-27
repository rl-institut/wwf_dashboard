
let t11_import_type;

document.addEventListener("globalSetupComplete", function (e) {
  if (debug) {
    console.log("Setup tile #11");
  }

  const t11_header = ("year" in initials) ? initials.year : "";
  const t11_header_height = get_header_height(11);

  const t11_circle_size = 35;
  const t11_icon_size = 20;

  const t11_chart_unit_height = 30;
  const t11_chart_axes_width = 50;
  const t11_chart_xaxis_height = 40;
  const t11_chart_width = width - 2 * t11_chart_axes_width;
  const t11_chart_height_ideal = 260;
  let t11_chart_height = 100;
  const t11_chart_total_height_without_chart = t11_chart_unit_height + t11_chart_xaxis_height;

  const t11_bar_offset = 0;
  const t11_bar_title_height = 24;
  const t11_bar_title_offset = 15;
  const t11_bar_height = 25;
  const t11_bar_vspace = 15;
  const t11_bar_text_width = 180;
  const t11_bar_text_offset = 10;
  const t11_bar_bottom_padding = 5;  // Needed as circle is cut in 800px otherwise
  const t11_bar_total_height = t11_bar_offset + t11_bar_title_height + t11_bar_title_offset + 2 * t11_bar_vspace + 3 * t11_bar_height + t11_bar_bottom_padding;

  const t11_min_height = t11_bar_total_height + t11_chart_total_height_without_chart;
  const t11_height = get_tile_height(11);
  t11_chart_height = Math.round(Math.min(Math.max(t11_height - t11_min_height, t11_chart_height), t11_chart_height_ideal));
  const t11_chart_total_height = t11_chart_total_height_without_chart + t11_chart_height;
  const t11_puffer = is_mobile ? 0 : (t11_height - t11_min_height - t11_chart_height);
  if (debug) {console.log("Puffer #11 height = ", t11_puffer);}

  const t11_years = tiles[11].imports.map(function (d) {
    return d.year;
  });

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

  const t11_x = d3.scaleLinear()
      .range([0, t11_chart_width])
      .domain([tiles[11].imports[0].year, tiles[11].imports[tiles[11].imports.length - 1].year]);
  const t11_y = d3.scaleLinear()
      .range([t11_chart_height, 0])
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
      .attr("fill", "#F4F3EA");

  draw_header(t11_svg, 11, t11_header);

  const t11_tile = t11_svg.append("g")
      .attr("transform", `translate(${share_margin}, ${t11_header_height + share_margin})`);

  // CHART
  const t11_chart_area = t11_tile.append("g").attr("transform", `translate(0, ${t11_puffer * 1/3})`);
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
              function (year) {
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
        .attr("stroke", t11_color(import_type))
        .attr("stroke-width", line_width)
        .attr("d", d3.line()
            .x(function (d) {
              return t11_x(d.year);
            })
            .y(function (d) {
              return t11_y(d[import_type]);
            })
        );
  }

  // BARS

  const t11_bar_area = t11_tile.append("g").attr("transform", `translate(0, ${t11_puffer * 2/3 + t11_chart_total_height + t11_bar_offset})`);

  t11_bar_area.append("text")
      .text("Importabhängigkeit")
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .attr("letter-spacing", letterSpacing)
      .attr("dominant-baseline", "hanging");

  const t11_bar_width = width - t11_bar_text_offset - t11_bar_text_width - t11_chart_axes_width;

  const t11_bar = t11_bar_area.append("g").attr("transform", `translate(0, ${t11_bar_title_height + t11_bar_title_offset})`);

  // ICONS

  for (const [i, import_type] of Object.keys(t11_imports).entries()) {
    const icon = t11_imports[import_type].icon;
    const y = i * (t11_bar_height + t11_bar_vspace) + t11_bar_height / 2;
    t11_bar.append("circle")
        .attr("id", "t11_circle_" + import_type)
        .attr("onclick", `t11_change_import_type("${import_type}")`)
        .attr("onmouseover", function () {
          d3.select(this).style("cursor", "pointer");
        })
        .attr("cx", t11_bar_text_width / 3)
        .attr("cy", y)
        .attr("r", t11_circle_size / 2)
        .attr("fill", t11_color(import_type));
    $(t11_bar.node().appendChild(icons[icon].documentElement.cloneNode(true)))
        .attr("onclick", `t11_change_import_type("${import_type}")`)
        .attr("onmouseover", function () {
          d3.select(this).style("cursor", "pointer");
        })
        .attr("id", "t11_icon_" + import_type)
        .attr("x", t11_bar_text_width / 3 - t11_icon_size / 2)
        .attr("y", y - t11_icon_size / 2)
        .attr("width", t11_icon_size)
        .attr("height", t11_icon_size)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("fill", wwfColor.white);

    // Selected sector title
    t11_bar.append("text")
        .attr("id", "t11_sector_title")
        .text(t11_imports[import_type].title)
        .attr("x", t11_bar_text_width - t11_bar_text_offset)
        .attr("y", i * (t11_bar_height + t11_bar_vspace) + t11_bar_height / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle");
  }

  for (let i = 0; i < 3; i++) {
    t11_bar.append("rect")
        .attr("x", t11_bar_text_width)
        .attr("y", i * (t11_bar_height + t11_bar_vspace))
        .attr("width", t11_bar_width)
        .attr("height", t11_bar_height)
        .attr("fill", wwfColor.gray3);
  }

  function t11_change_year(year_index) {
    const year = t11_years[year_index];

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
    const t11_import_bars = t11_bar.append("g")
        .attr("id", "t11_imports");

    for (const [i, t11_import_type] of Object.keys(t11_imports).entries()) {
      const year_data = tiles[11][t11_import_type].find(element => element.year == year);

      // Total imports
      t11_import_bars.append("rect")
          .attr("x", t11_bar_text_width)
          .attr("y", i * (t11_bar_height + t11_bar_vspace))
          .attr("width", t11_bar_imports_x(year_data.import))
          .attr("height", t11_bar_height)
          .attr("fill", t11_color(t11_import_type));

      t11_import_bars.append("text")
          .text(year_data["import"].toLocaleString(undefined, {maximumFractionDigits: 0}))
          .attr("x", t11_bar_text_offset + t11_bar_text_width)
          .attr("y", i * (t11_bar_height + t11_bar_vspace) + t11_bar_height / 2)
          .attr("text-anchor", "start")
          .attr("dominant-baseline", "middle")
          .attr("fill", t11_text_color(t11_import_type))
          .attr("font-weight", fontWeight.bold)
          .style("font-size", fontSize.small)
          .attr("letter-spacing", letterSpacing);
    }
  }

  if ("year" in initials) {
    const init_data = $("#t11_year").data("ionRangeSlider");
    init_data.update({from: t11_years.indexOf(parseInt(initials.year))});
  } else {
    t11_change_year(t11_years.length - 1);
  }

});
