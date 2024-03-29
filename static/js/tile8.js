document.addEventListener("globalSetupComplete", function (e) {
  if (debug) {
    console.log("Setup tile #8");
  }

  const t8_header = ("year" in initials) ? initials.year : "";
  const t8_header_height = get_header_height(8);

  const t8_bar_height_ideal = 50;
  let t8_bar_height = 30;
  const t8_bar_title_height = 40;
  const t8_bar_vspace = 15;
  let t8_bar_total_height = t8_bar_title_height + 4 * t8_bar_vspace + t8_bar_height;

  const t8_icon_size = 22;
  const t8_icon_hspace = 6;

  const t8_chart_unit_height = 30;
  const t8_chart_primary_power_offset = 5;
  const t8_chart_axes_width = 60;
  const t8_chart_xaxis_height = 40;
  const t8_chart_width = width - 2 * t8_chart_axes_width;
  const t8_chart_height_ideal = 260;
  let t8_chart_height = 140;
  const t8_chart_offset = 60;
  let t8_chart_total_height = t8_chart_offset + t8_chart_height + t8_chart_xaxis_height;

  const t8_min_height = t8_bar_total_height + t8_chart_total_height;
  if (debug) {console.log("Tile #8 min height = ", t8_min_height);}
  const t8_height = get_tile_height(8);
  const t8_height_needed_for_ideal = t8_chart_height_ideal - t8_chart_height + t8_bar_height_ideal - t8_bar_height;
  if (debug) {console.log("Tile #8 ideal height = ", t8_height_needed_for_ideal);}
  let t8_puffer;
  if (t8_height - t8_min_height > t8_height_needed_for_ideal) {
    t8_bar_height = t8_bar_height_ideal;
    t8_bar_total_height = t8_bar_title_height + 4 * t8_bar_vspace + t8_bar_height;
    t8_chart_height = t8_chart_height_ideal;
    t8_chart_total_height = t8_chart_offset + t8_chart_height + t8_chart_xaxis_height;
    t8_puffer = Math.max(0, is_mobile ? 0 : (t8_height - t8_min_height - t8_height_needed_for_ideal));
  } else {
    t8_puffer = Math.max(0, is_mobile ? 0 : (t8_height - t8_min_height));
  }
  if (debug) {console.log("Puffer #8 height = ", t8_puffer);}

  const t8_years = tiles[8].map(function (d) {
    return d.year;
  }).slice(1);

  $("#t8_year").ionRangeSlider({
    grid: true,
    prettify_enabled: false,
    skin: "round",
    hide_min_max: true,
    values: t8_years,
    from: tiles[8][tiles[8].length - 1].year,
    onChange: function (data) {
      t8_change_year(data.from);
    },
    onUpdate: function (data) {
      t8_change_year(data.from);
    }
  });

  const t8_values = ["primary", "power", "pv", "wind"];

  const t8_twh_max = tiles[8].reduce(function (max, current) {
    if (current.primary > max) {
      return current.primary;
    } else {
      return max;
    }
  }, 0);
  const t8_gw_max = (
      tiles[8].reduce(function (max, current) {
        if (current.pv > max) {
          return current.pv;
        } else {
          return max;
        }
      }, 0) +
      tiles[8].reduce(function (max, current) {
        if (current.wind > max) {
          return current.wind;
        } else {
          return max;
        }
      }, 0)
  );

  const t8_emissions_1990 = tiles[3].emissions[0].emissions;

  const t8_x = d3.scaleLinear()
      .range([0, t8_chart_width])
      .domain([tiles[8][0].year, tiles[8][tiles[8].length - 1].year]);
  const t8_y = d3.scaleLinear()
      .range([t8_chart_height, 0])
      .domain([0, t8_twh_max]);
  const t8_y2 = d3.scaleLinear()
      .range([t8_chart_height, 0])
      .domain([0, t8_gw_max]);
  const t8_color = d3.scaleOrdinal()
      .domain(t8_values)
      .range(["#724284", "#008A88", "#F3CC00", "#70B6D6"]);

  const t8_svg = d3.select("#t8")
      .append("svg")
      .attr("width", width + 2 * share_margin)
      .attr("height", t8_header_height + t8_height + 2 * share_margin);

  t8_svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#F4F3EA");

  draw_header(t8_svg, 8, t8_header);

  const t8_tile = t8_svg.append("g")
      .attr("transform", `translate(${share_margin}, ${t8_header_height + share_margin})`);

  // BAR

  const t8_bar = t8_tile.append("g").attr("transform", `translate(0, ${t8_puffer / 2})`);
  t8_bar.append("text")
      .text("Historischer Zubau und")
      .attr("x", width / 2)
      .attr("y", t8_bar_vspace)
      .attr("text-anchor", "middle")
      .attr("letter-spacing", letterSpacing)
      .attr("dominant-baseline", "hanging");
  t8_bar.append("text")
      .text("Ausbauziele der Bundesregierung pro Jahr")
      .attr("x", width / 2)
      .attr("y", t8_bar_vspace + t8_bar_title_height / 2)
      .attr("text-anchor", "middle")
      .attr("letter-spacing", letterSpacing)
      .attr("dominant-baseline", "hanging");

  // CHART
  const t8_chart = t8_tile.append("g").attr("transform", `translate(${t8_chart_axes_width}, ${t8_bar_total_height + t8_puffer + t8_chart_offset})`);

  // X-Axis
  t8_chart.append("g")
      .attr("id", "t8_xaxis")
      .attr("transform", "translate(0," + t8_chart_height + ")")
      .call(
          d3.axisBottom(t8_x).ticks(3).tickFormat(
              function (year) {
                return year;
              }
          )
      )
      .selectAll("text")
      .attr("text-anchor", "middle")
      .attr("fill", wwfColor.gray2)
      .attr("font-size", fontSize.xsmall)
      .attr("letter-spacing", letterSpacing)
      .attr("font-weight", fontWeight.thin);
  d3.select("#t8_xaxis").select('.domain').attr('stroke-width', 0);
  d3.select("#t8_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

  t8_chart.append("line")
      .attr("x1", 0)
      .attr("x2", t8_chart_width)
      .attr("y1", t8_chart_height)
      .attr("y2", t8_chart_height)
      .attr("stroke", wwfColor.black)
      .attr("stroke-width", chart_axis_stroke_width);

  // Y-Axis
  t8_chart.append("g")
      .attr("id", "t8_yaxis")
      .call(
          d3.axisLeft(t8_y)
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("fill", wwfColor.gray2)
      .attr("font-size", fontSize.xsmall)
      .attr("letter-spacing", letterSpacing)
      .attr("font-weight", fontWeight.thin);
  d3.select("#t8_yaxis").select('.domain').attr('stroke-width', 0);
  d3.select("#t8_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

  const t8_y_grid = t8_chart.append("g")
      .call(
          d3.axisLeft(t8_y)
              .tickSize(-t8_chart_width)
              .tickFormat('')
              .ticks(5)
      );
  t8_y_grid.selectAll(".tick").select("line")
      .attr("stroke-width", tickStrokeWidth)
      .attr("stroke", tickColor);
  t8_y_grid.select('.domain').attr('stroke-width', 0);

  t8_chart.append("text")
      .text("Primärenergiebedarf, Strombedarf")
      .attr("x", -t8_chart_axes_width)
      .attr("y", -t8_chart_unit_height)
      .attr("text-anchor", "start")
      .attr("font-size", fontSize.xsmall)
      .attr("letter-spacing", letterSpacing)
      .attr("font-weight", fontWeight.thin);

  t8_chart.append("text")
      .text("(TWh)")
      .attr("x", 0)
      .attr("y", -t8_chart_unit_height / 2)
      .attr("text-anchor", "end")
      .attr("font-size", fontSize.xsmall)
      .attr("letter-spacing", letterSpacing)
      .attr("font-weight", fontWeight.thin);


  // Y2-Axis
  t8_chart.append("g")
      .attr("id", "t8_y2axis")
      .attr("transform", `translate(${t8_chart_width}, 0)`)
      .call(
          d3.axisRight(t8_y2)
      )
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("fill", wwfColor.gray2)
      .attr("font-size", fontSize.xsmall)
      .attr("letter-spacing", letterSpacing)
      .attr("font-weight", fontWeight.thin);
  d3.select("#t8_y2axis").select('.domain').attr('stroke-width', 0);
  d3.select("#t8_y2axis").selectAll(".tick").select("line").attr("stroke-width", 0);

  t8_chart.append("text")
      .text("(GW)")
      .attr("x", t8_chart_width)
      .attr("y", -t8_chart_unit_height)
      .attr("text-anchor", "start")
      .attr("font-size", fontSize.xsmall)
      .attr("letter-spacing", letterSpacing)
      .attr("font-weight", fontWeight.thin);

  // Wind and PV areas
  const t8_stacked_data = d3.stack().keys(["pv", "wind"])(tiles[8]);
  const t8_area = d3
      .area()
      .x(d => t8_x(d.data.year))
      .y0(d => t8_y2(d[0]))
      .y1(d => t8_y2(d[1]));

  const t8_series = t8_chart
      .selectAll(".series")
      .data(t8_stacked_data)
      .enter()
      .append("g")
      .attr("class", "series");

  t8_series
      .append("path")
      .style("fill", d => t8_color(d.key))
      .attr("stroke", d => t8_color(d.key))
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", line_width)
      .attr("d", d => t8_area(d));

  // Primary and Power lines
  for (const sector of ["primary", "power"]) {
    t8_chart.append("path")
        .datum(tiles[8])
        .attr("fill", "none")
        .attr("stroke", function (d) {
          return t8_color(sector);
        })
        .attr("stroke-width", line_width)
        .attr("d", d3.line()
            .x(function (d) {
              return t8_x(d.year);
            })
            .y(function (d) {
              return t8_y(d[sector]);
            })
        );
  }

  t8_chart.append("text")
      .text("Primärenergiebedarf")
      .attr("x", t8_x(tiles[8][0].year))
      .attr("y", t8_y(tiles[8][0].primary) - t8_chart_primary_power_offset)
      .attr("text-anchor", "start")
      .attr("fill", t8_color("primary"))
      .attr("font-size", fontSize.xsmall)
      .attr("letter-spacing", letterSpacing)
      .attr("font-weight", fontWeight.bold);

  t8_chart.append("text")
      .text("Strombedarf")
      .attr("x", t8_x(tiles[8][tiles[8].length - 1].year))
      .attr("y", t8_y(tiles[8][tiles[8].length - 1].power) - t8_chart_primary_power_offset)
      .attr("text-anchor", "end")
      .attr("fill", t8_color("power"))
      .attr("font-size", fontSize.xsmall)
      .attr("letter-spacing", letterSpacing)
      .attr("font-weight", fontWeight.bold);


  function t8_change_year(year_index) {
    const year = t8_years[year_index];
    const year_data = tiles[8].find(element => element.year == year);
    let wind = year_data.wind;
    let pv = year_data.pv;
    if (year > tiles[8][0].year) {
      const last_year = (year == tiles[8][1].year) ? tiles[8][0].year : t8_years[year_index - 1];
      const last_year_data = tiles[8].find(element => element.year == last_year);
      wind -= last_year_data.wind;
      pv -= last_year_data.pv;
    }

    t8_chart.select("#t8_year_line").remove();
    t8_chart.append("line")
        .attr("id", "t8_year_line")
        .attr("x1", t8_x(year))
        .attr("x2", t8_x(year))
        .attr("y1", 0)
        .attr("y2", t8_chart_height)
        .attr("stroke", wwfColor.black)
        .attr("stroke-width", dash_width)
        .attr("stroke-dasharray", dash_spacing);

    t8_bar.select("#t8_expansion").remove();
    const t8_expansion = t8_bar.append("g")
        .attr("id", "t8_expansion")
        .attr("transform", `translate(0, ${t8_bar_title_height + 2 * t8_bar_vspace})`);

    const middle = width * (wind / (wind + pv));
    t8_expansion.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", middle)
        .attr("height", t8_bar_height)
        .attr("fill", t8_color("wind"));
    t8_expansion.append("rect")
        .attr("x", middle)
        .attr("y", 0)
        .attr("width", width - middle)
        .attr("height", t8_bar_height)
        .attr("fill", t8_color("pv"));
    if (middle > 0) {
      $(t8_expansion.node().appendChild(icons.i_wind_onshore.documentElement.cloneNode(true)))
          .attr("x", middle / 2 - 2 * t8_icon_size - t8_icon_hspace / 2)
          .attr("y", t8_bar_height / 2 - t8_icon_size / 2)
          .attr("width", t8_icon_size)
          .attr("height", t8_icon_size)
          .attr("preserveAspectRatio", "xMidYMid slice");
      t8_expansion.append("text")
          .text(wind.toFixed(0) + " GW")
          .attr("x", middle / 2 + -t8_icon_size - t8_icon_hspace / 2)
          .attr("y", t8_bar_height / 2)
          .attr("text-anchor", "left")
          .attr("dominant-baseline", "central")
          .attr("fill", wwfColor.black)
          .attr("font-size", fontSize.large)
          .attr("letter-spacing", letterSpacing)
          .attr("font-weight", fontWeight.bold);
    }
    if (width - middle > 0) {
      $(t8_expansion.node().appendChild(icons.i_pv.documentElement.cloneNode(true)))
          .attr("x", middle + (width - middle) / 2 - 2 * t8_icon_size - t8_icon_hspace / 2)
          .attr("y", t8_bar_height / 2 - t8_icon_size / 2)
          .attr("width", t8_icon_size)
          .attr("height", t8_icon_size)
          .attr("preserveAspectRatio", "xMidYMid slice");
      t8_expansion.append("text")
          .text(pv.toFixed(0) + " GW")
          .attr("x", middle + (width - middle) / 2 - t8_icon_size + t8_icon_hspace / 2)
          .attr("y", t8_bar_height / 2)
          .attr("text-anchor", "left")
          .attr("dominant-baseline", "central")
          .attr("fill", wwfColor.black)
          .attr("font-size", fontSize.large)
          .attr("letter-spacing", letterSpacing)
          .attr("font-weight", fontWeight.bold);
    }
  }

  if ("year" in initials) {
    const init_data = $("#t8_year").data("ionRangeSlider");
    init_data.update({from: t8_years.indexOf(parseInt(initials.year))});
  } else {
    t8_change_year(t8_years.length - 1);
  }

});
