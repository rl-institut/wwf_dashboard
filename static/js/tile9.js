
let t9_technology;

document.addEventListener("globalSetupComplete", function () {
  if (debug) {
    console.log("Setup tile #9");
  }

  const t9_header = "";
  const t9_header_height = get_header_height(9, false);

  const t9_bar_ticks_width = width / 2.5;
  const t9_bar_width = width - t9_bar_ticks_width;
  const t9_bar_height_ideal = 180;
  let t9_bar_height = 140;
  const t9_bar_title_height = 50;
  const t9_bar_offset = 10;
  const t9_bar_hspace = 5;
  const t9_bar_gap = 12;
  const t9_solar_text_hoffset = 9;
  const t9_solar_text_voffset = 15;
  let t9_bar_total_height = t9_bar_offset + t9_bar_height + t9_bar_title_height;

  const t9_icon_offset = 40;
  const t9_circle_size_ideal = 40;
  let t9_circle_size = 30;
  const t9_circe_color_gray = "#ECECEC";
  const t9_icon_size = 20;
  const t9_icon_hspace = 6;
  const t9_icon_vspace = 10;
  const t9_icon_title_height = 22;
  let t9_icon_total_height = t9_icon_offset + t9_circle_size + 2 * t9_icon_vspace + t9_icon_title_height;

  const t9_chart_title_height = 30;
  const t9_chart_unit_height = 22;
  const t9_chart_axes_width = 20;
  const t9_chart_yaxis_width = 33;
  const t9_chart_xaxis_height = 20;
  const t9_chart_width = width - 2 * t9_chart_axes_width;
  const t9_chart_height_ideal = 220;
  let t9_chart_height = 100;
  let t9_chart_total_height = t9_chart_title_height + t9_chart_unit_height + t9_chart_height + t9_chart_xaxis_height;

  const t9_min_height = t9_bar_total_height + t9_icon_total_height + t9_chart_total_height;
  const t9_height = get_tile_height(9);
  const t9_height_needed_for_ideal = t9_chart_height_ideal - t9_chart_height + t9_bar_height_ideal - t9_bar_height + t9_circle_size_ideal - t9_circle_size;
  if (debug) {console.log("Tile #9 ideal height = ", t9_height_needed_for_ideal);}
  let t9_puffer;
  if (t9_height - t9_min_height > t9_height_needed_for_ideal) {
    t9_bar_height = t9_bar_height_ideal;
    t9_bar_total_height = t9_bar_offset + t9_bar_height + t9_bar_title_height;
    t9_circle_size = t9_circle_size_ideal;
    t9_icon_total_height = t9_icon_offset + t9_circle_size + 2 * t9_icon_vspace + t9_icon_title_height;
    t9_chart_height = t9_chart_height_ideal;
    t9_chart_total_height = t9_chart_title_height + t9_chart_unit_height + t9_chart_height + t9_chart_xaxis_height;
    t9_puffer = Math.max(0, is_mobile ? 0 : (t9_height - t9_min_height - t9_height_needed_for_ideal));
  } else {
    const t9_chart_ratio = t9_chart_height_ideal / (t9_chart_height_ideal + t9_bar_height_ideal);
    t9_bar_height = Math.round(Math.max((t9_height - t9_min_height) * (1 - t9_chart_ratio), t9_bar_height));
    t9_chart_height = Math.round(Math.max((t9_height - t9_min_height) * t9_chart_ratio, t9_chart_height));
    t9_puffer = Math.max(0, is_mobile ? 0 : (t9_height - t9_min_height));
  }
  if (debug) {console.log("Puffer #9 height = ", t9_puffer);}

  const t9_installation_years = tiles[9].installations.map(function (d) {
    return d.year;
  });

  $("#t9_year").ionRangeSlider({
    grid: true,
    prettify_enabled: false,
    skin: "round",
    hide_min_max: true,
    values: t9_installation_years,
    from: tiles[9].installations[tiles[9].installations.length - 1].year,
    onChange: function (data) {
      t9_change_year(data.from);
    }
  });

  const t9_technologies = {
    "solar": {"title": "Solarthermie", "icon": "i_pv"},
    "heatpump": {"title": "Erdwärmepumpe", "icon": "i_waermepumpe"},
    "gas": {"title": "Gasheizung", "icon": "i_gas"},
    "biomass": {"title": "Pelletheizung", "icon": "i_pellet"},
    "oil": {"title": "Ölheizung", "icon": "i_oel"},
  };

  const t9_technologies_max = Math.max(...Object.values(tiles[9].installations[tiles[9].installations.length - 2])) / 1000;
  const t9_emissions_max = Math.max(...Object.values(tiles[9].emissions));

  const t9_emissions_x = d3.scaleLinear()
      .range([0, t9_bar_width])
      .domain([0, t9_emissions_max]);
  const t9_emissions_y = d3.scaleBand()
      .range([0, t9_bar_height])
      .domain(Object.keys(t9_technologies));

  const t9_x = d3.scaleLinear()
      .range([0, t9_chart_width])
      .domain([tiles[9].installations[0].year, tiles[9].installations[tiles[9].installations.length - 1].year]);
  const t9_y = d3.scaleLinear()
      .range([t9_chart_height, 0])
      .domain([0, t9_technologies_max]);
  const t9_color = d3.scaleOrdinal()
      .domain(Object.keys(t9_technologies))
      .range([wwfColor.mediumGreen, wwfColor.mediumGreen, wwfColor.yellow, wwfColor.red, wwfColor.red]);

  const t9_svg = d3.select("#t9")
      .append("svg")
      .attr("width", width + 2 * share_margin)
      .attr("height", t9_header_height + t9_height + 2 * share_margin);

  t9_svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#F4F3EA");

  draw_header(t9_svg, 9, t9_header);

  const t9_tile = t9_svg.append("g")
      .attr("transform", `translate(${share_margin}, ${t9_header_height + share_margin})`);

  // EMISSIONS
  const t9_bar_area = t9_tile.append("g")
      .attr("transform", `translate(0, ${t9_puffer / 3})`);

  t9_bar_area.append("text")
      .text("CO2-Emissionen nach Heizungsart")
      .attr("x", width / 2)
      .attr("y", t9_bar_offset)
      .attr("text-anchor", "middle")
      .attr("letter-spacing", letterSpacing)
      .attr("dominant-baseline", "hanging");

  t9_bar_area.append("text")
      .text("(g/kWh)")
      .attr("x", width / 2)
      .attr("y", t9_bar_offset + t9_bar_title_height / 2)
      .attr("text-anchor", "middle")
      .attr("letter-spacing", letterSpacing)
      .attr("dominant-baseline", "hanging");

  const t9_bar = t9_bar_area.append("g")
      .attr("transform", `translate(${t9_bar_ticks_width}, ${t9_bar_offset + t9_bar_title_height})`);

  for (const technology of Object.keys(t9_technologies)) {
    t9_bar.append("rect")
        .attr("x", 0)
        .attr("y", t9_emissions_y(technology) + t9_bar_gap / 2)
        .attr("width", t9_emissions_x(tiles[9].emissions[technology]))
        .attr("height", t9_emissions_y.bandwidth() - t9_bar_gap)
        .attr("fill", t9_color(technology));

    if (t9_emissions_x(tiles[9].emissions[technology]) - t9_bar_hspace > 0) {
      t9_bar.append("text")
          .text(tiles[9].emissions[technology])
          .attr("x", t9_emissions_x(tiles[9].emissions[technology]) - t9_bar_hspace)
          .attr("y", t9_emissions_y(technology) + t9_emissions_y.bandwidth() / 2)
          .attr("text-anchor", "end")
          .attr("fill", wwfColor.black)
          .attr("dominant-baseline", "central")
          .attr("letter-spacing", letterSpacing)
          .attr("font-size", fontSize.xsmall)
          .attr("font-weight", fontWeight.bold);
    } else {
      t9_bar.append("text")
          .text(tiles[9].emissions[technology])
          .attr("x", t9_bar_hspace)
          .attr("y", t9_emissions_y(technology) + t9_emissions_y.bandwidth() / 2)
          .attr("text-anchor", "start")
          .attr("fill", wwfColor.black)
          .attr("dominant-baseline", "central")
          .attr("letter-spacing", letterSpacing)
          .attr("font-size", fontSize.xsmall)
          .attr("font-weight", fontWeight.bold);
    }
  }

  t9_bar.append("g")
      .attr("id", "t9_emissions_y")
      .call(
          d3.axisLeft(t9_emissions_y).ticks().tickFormat(
              function (d) {
                return t9_technologies[d].title;
              }
          )
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("font-weight", fontWeight.normal)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.xsmall);
  d3.select("#t9_emissions_y").select('.domain').attr('stroke-width', 0);
  d3.select("#t9_emissions_y").selectAll(".tick").select("line").attr("stroke-width", 0);

  d3.select("#t9_emissions_y").select("text").attr("transform", `translate(0, ${-t9_solar_text_voffset})`);

  t9_bar.append("text")
      .text("(als ergänzendes")
      .attr("x", -t9_solar_text_hoffset)
      .attr("y", t9_emissions_y("solar") + t9_emissions_y.bandwidth() - t9_solar_text_voffset)
      .attr("text-anchor", "end")
      .attr("font-weight", fontWeight.thin)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.xsmall);

  t9_bar.append("text")
      .text("Heizsystem)")
      .attr("x", -t9_solar_text_hoffset)
      .attr("y", t9_emissions_y("solar") + t9_emissions_y.bandwidth())
      .attr("text-anchor", "end")
      .attr("font-weight", fontWeight.thin)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.xsmall);

  t9_bar.append("line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", t9_bar_height)
      .attr("stroke", wwfColor.black)
      .attr("stroke-width", chart_axis_stroke_width);

  // DIVIDING-line
  t9_tile.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", t9_bar_total_height + t9_puffer / 2 + t9_icon_offset / 2)
      .attr("y2", t9_bar_total_height + t9_puffer / 2 + t9_icon_offset / 2)
      .attr("stroke", tickColor)
      .attr("stroke-width", 1);

  // ICONS

  const t9_icons = t9_tile.append("g").attr("transform", `translate(0, ${t9_bar_total_height + t9_puffer * 2/3 + t9_icon_offset})`);
  const t9_icon_left = (width - 5 * t9_circle_size - 4 * t9_icon_hspace) / 2;
  for (const [i, technology] of Object.keys(t9_technologies).entries()) {
    const icon = t9_technologies[technology].icon;
    const x = t9_icon_left + i * (t9_circle_size + t9_icon_hspace) + t9_circle_size / 2;
    t9_icons.append("circle")
        .attr("id", "t9_circle_" + technology)
        .attr("onmouseover", function () {
          d3.select(this).style("cursor", "pointer");
        })
        .attr("cx", x)
        .attr("cy", t9_circle_size / 2)
        .attr("r", t9_circle_size / 2)
        .attr("fill", t9_circe_color_gray);
    $(t9_icons.node().appendChild(icons[icon].documentElement.cloneNode(true)))
        .attr("onmouseover", function () {
          d3.select(this).style("cursor", "pointer");
        })
        .attr("id", "t9_icon_" + technology)
        .attr("x", x - t9_icon_size / 2)
        .attr("y", t9_circle_size / 2 - t9_icon_size / 2)
        .attr("width", t9_icon_size)
        .attr("height", t9_icon_size)
        .attr("preserveAspectRatio", "xMidYMid slice");

    document.getElementById("t9_circle_" + technology).addEventListener("click", function () {t9_change_technology(technology);});
    document.getElementById("t9_icon_" + technology).addEventListener("click", function () {t9_change_technology(technology);});
  }

  t9_icons.append("text")
      .attr("id", "t9_technology_title")
      .attr("x", width / 2)
      .attr("y", t9_circle_size + 2 * t9_icon_vspace)
      .attr("text-anchor", "middle")
      .attr("letter-spacing", letterSpacing);

  // CHART
  const t9_chart = t9_tile.append("g").attr("transform", `translate(${t9_chart_yaxis_width}, ${t9_bar_total_height + t9_puffer * 2/3 + t9_icon_total_height + t9_chart_title_height})`);

  // X-Axis
  t9_chart.append("g")
      .attr("id", "t9_xaxis")
      .attr("transform", "translate(0," + t9_chart_height + ")")
      .call(
          d3.axisBottom(t9_x).ticks(3).tickFormat(
              function (year) {
                return year;
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
          d3.axisLeft(t9_y).ticks(5)
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
      );
  t9_y_grid.selectAll(".tick").select("line")
      .attr("stroke-width", tickStrokeWidth)
      .attr("stroke", tickColor);
  t9_y_grid.select('.domain').attr('stroke-width', 0);

  t9_chart.append("text")
      .text("Absatzzahlen Wärmeerzeuger")
      .attr("x", -t9_chart_yaxis_width)
      .attr("y", -t9_chart_unit_height)
      .attr("text-anchor", "start")
      .attr("fill", wwfColor.gray2)
      .attr("letter-spacing", letterSpacing)
      .style("font-size", fontSize.xsmall);
  t9_chart.append("text")
      .text("(in 1.000 Stück)")
      .attr("x", -t9_chart_yaxis_width)
      .attr("y", -t9_chart_unit_height / 3)
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
            .x(function (d) {
              return t9_x(d.year);
            })
            .y(function (d) {
              return t9_y(d[technology] / 1000);
            })
        );
  }

  function t9_activate_technology(technology) {
    t9_icons.selectAll("circle")
        .attr("fill", t9_circe_color_gray);
    t9_icons.selectAll("path")
        .style("fill", wwfColor.black);
    t9_icons.select("#t9_circle_" + technology)
        .attr("fill", t9_color(technology));
    t9_icons.select("#t9_icon_" + technology).select("path")
        .style("fill", wwfColor.white);
    t9_icons.select("#t9_technology_title")
        .text(t9_technologies[technology].title);
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
            .x(function (d) {
              return t9_x(d.year);
            })
            .y(function (d) {
              return t9_y(d[technology] / 1000);
            })
        );
  }

  function t9_change_technology(technology) {
    t9_technology = technology;
    t9_activate_technology(technology);
    t9_draw_current_technology(technology);
  }

  t9_change_technology(("technology" in initials) ? initials.technology : "solar");

});