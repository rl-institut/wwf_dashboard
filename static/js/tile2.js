document.addEventListener("globalSetupComplete", function (e) {
  if (debug) {
    console.log("Setup tile #2");
  }

  const t2_header = ("year" in initials) ? initials.year : "";
  const t2_header_height = get_header_height(2);

  const t2_bar_offset = 0;
  const t2_bar_title_height = 20;
  const t2_bar_height = 20;
  const t2_bar_vspace = 10;
  const t2_bar_xaxis_height = 20;
  const t2_bar_total_height = t2_bar_offset + t2_bar_title_height + t2_bar_height + t2_bar_vspace + t2_bar_xaxis_height;

  const t2_icon_offset_ideal = 30;
  let t2_icon_offset = -20;
  const t2_icons_rect_height = 26;
  const t2_icon_size = 16;
  const t2_icon_vspace = 5;
  const t2_icon_hspace = 14;
  const t2_icon_text_height = 20;
  const t2_icon_margin_ideal = 20;
  let t2_icon_margin = 0;
  const t2_icon_row_height = t2_icon_size + 2 * t2_icon_vspace + t2_icons_rect_height + t2_icon_text_height;
  const t2_icon_total_height = t2_icon_offset + 2 * t2_icon_row_height + t2_icon_margin;

  const t2_arrow_offset_ideal = 30;
  let t2_arrow_offset = 0;
  const t2_arrow_width = 50;
  const t2_arrow_height = 65;
  const t2_arrow_height_measured = 40;
  const t2_arrow_text_height = 24;
  const t2_arrow_total_height = t2_arrow_offset + t2_arrow_height_measured;

  const t2_pie_offset_ideal = 40;
  let t2_pie_offset = 10;
  const t2_pie_radius = 38;
  const t2_pie_hspace = (width - 6 * t2_pie_radius) / 4;
  const t2_pie_vspace = 5;
  const t2_pie_icon_size = 20;
  const t2_pie_legend_size = 12;
  const t2_pie_legend_padding_top_ideal = 10;
  let t2_pie_legend_padding_top = 0;
  const t2_pie_legend_hspace = 10;
  const t2_pie_legend_width = width - 2 * (t2_pie_hspace + t2_pie_radius);
  const t2_pie_total_height = t2_pie_offset + t2_pie_icon_size + 2 * t2_pie_vspace + 2 * t2_pie_radius + t2_pie_legend_padding_top + t2_pie_legend_size;

  const t2_min_height = t2_bar_total_height + t2_icon_total_height + t2_arrow_total_height + t2_pie_total_height;
  if (debug) {console.log("Puffer #2 min height = ", t2_min_height);}
  const t2_height = get_tile_height(2);
  const t2_ideal_height = t2_arrow_offset_ideal + t2_icon_margin_ideal + t2_pie_offset_ideal + t2_pie_legend_padding_top_ideal + t2_icon_offset_ideal;
  if (debug) {console.log("Puffer #2 ideal height = ", t2_ideal_height);}
  let t2_puffer;
  if (t2_height - t2_min_height > t2_ideal_height) {
    t2_arrow_offset = t2_arrow_offset_ideal;
    t2_icon_margin = t2_icon_margin_ideal;
    t2_pie_offset = t2_pie_offset_ideal;
    t2_pie_legend_padding_top = t2_pie_legend_padding_top_ideal;
    t2_icon_offset = t2_icon_offset_ideal;
    t2_puffer = Math.max(0, is_mobile ? 0 : (t2_height - t2_min_height - t2_ideal_height));
  } else {
    t2_puffer = Math.max(0, is_mobile ? 0 : (t2_height - t2_min_height));
  }
  if (debug) {console.log("Puffer #2 height = ", t2_puffer);}

  $("#t2_year").ionRangeSlider({
    grid: true,
    prettify_enabled: false,
    skin: "round",
    hide_min_max: true,
    min: tiles[2][0].year,
    max: tiles[2][tiles[2].length - 1].year,
    from: tiles[2][tiles[2].length - 1].year,
    onChange: function (data) {
      t2_change_year(data.from);
    },
    onUpdate: function (data) {
      t2_change_year(data.from);
    }
  });

  const t2_resources = ["renewables", "oil", "gas", "coal", "nuclear", "others", "savings"];
  const t2_resources_names = {
    "renewables": "Erneuerbare Energien",
    "oil": "Öl",
    "gas": "Gas",
    "coal": "Kohle",
    "nuclear": "Atom",
    "others": "Sonstiges",
    "savings": "Einsparungen"
  };
  const t2_icons = ["i_wind_onshore", "i_oel", "i_gas", "i_coal", "i_pollution", "i_industrie", "i_blaetter"];
  const t2_pie_positions = {"power": 0, "heat": 1, "traffic": 2};
  const t2_pie_sectors = [
    {"title": "Strom", "icon": "i_strom"},
    {"title": "Wärme", "icon": "i_waerme"},
    {"title": "Verkehr", "icon": "i_verkehr"}
  ];

  const t2_max = t2_resources.reduce(
      (sum, key) => {
        return sum += tiles[2][7][key];
      },
      0
  );

  const t2_bar_color = d3.scaleOrdinal()
      .domain(t2_resources)
      .range([wwfColor.mediumGreen, "black", "#3A3A3A", "#5A5A5A", "#808080", "#9E9E9E", wwfColor.aqua]);

  const t2_pie_color = d3.scaleOrdinal()
      .domain(["ee", "ne", "ne2"])
      .range([wwfColor.mediumGreen, wwfColor.black, wwfColor.black]);

  const t2_svg = d3.select("#t2")
      .append("svg")
      .attr("width", width + 2 * share_margin)
      .attr("height", t2_header_height + t2_height + 2 * share_margin);

  t2_svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");

  draw_header(t2_svg, 2, t2_header);

  const t2_tile = t2_svg.append("g")
      .attr("transform", `translate(${share_margin}, ${t2_header_height + share_margin})`);

  const t2_bars = t2_tile.append("g")
      .attr("transform", `translate(0, ${t2_puffer / 4})`);

  t2_bars.append("text")
      .text("Energieverbrauch in Deutschland (TWh)")
      .attr("x", width / 2)
      .attr("y", t2_bar_offset)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .attr("letter-spacing", letterSpacing);

  // BAR X-Axis ticks

  t2_bars.append("text")
      .text("0")
      .attr("x", 0)
      .attr("y", t2_bar_total_height - t2_bar_xaxis_height)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "hanging")
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.small)
      .attr("fill", wwfColor.gray1);

  t2_bars.append("text")
      .text(t2_max.toFixed(0))
      .attr("x", width)
      .attr("y", t2_bar_total_height - t2_bar_xaxis_height)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "hanging")
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.small)
      .attr("fill", wwfColor.gray1);

  // ICONS

  t2_icon_renewables = t2_bars.append("g")
      .attr("transform", `translate(0, ${t2_bar_total_height + t2_icon_offset})`);
  t2_draw_icons(t2_icon_renewables, ["renewables", "savings"], fontWeight.bold);

  t2_icon_fossils = t2_bars.append("g")
      .attr("transform", `translate(0, ${t2_bar_total_height + t2_icon_offset + t2_icon_row_height + t2_icon_margin})`);
  t2_draw_icons(t2_icon_fossils, ["oil", "gas", "coal", "nuclear", "others"]);

  // ARROW

  const t2_arrow = t2_tile.append("g")
      .attr("transform", `translate(0, ${t2_bar_total_height + t2_icon_total_height + t2_arrow_offset + t2_puffer / 2})`);

  $(t2_arrow.node().appendChild(icons.arrow.documentElement.cloneNode(true)))
      .attr("x", width / 2 - t2_arrow_width / 2)
      .attr("y", 0)
      .attr("width", t2_arrow_width)
      .attr("height", t2_arrow_height)
      .attr("preserveAspectRatio", "xMidYMid slice");

  t2_arrow.append("text")
      .text("Diese Energieträger verwenden wir in")
      .attr("x", width / 2)
      .attr("y", t2_arrow_height / 2.5 - t2_arrow_text_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-weight", fontWeight.normal)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.small);

  t2_arrow.append("text")
      .text("Deutschland in folgenden Sektoren (%)")
      .attr("x", width / 2)
      .attr("y", t2_arrow_height / 2.5 + t2_arrow_text_height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-weight", fontWeight.normal)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size", fontSize.small);

  // PIE

  const t2_pie = t2_tile.append("g")
      .attr("transform", `translate(${t2_pie_hspace}, ${t2_bar_total_height + t2_icon_total_height + t2_arrow_total_height + t2_pie_offset + t2_puffer * 3/4})`);

  for (const [i, sector] of t2_pie_sectors.entries()) {
    const x = i * (t2_pie_hspace + 2 * t2_pie_radius);
    $(t2_pie.node().appendChild(icons[sector.icon].documentElement.cloneNode(true)))
        .attr("x", x)
        .attr("y", 0)
        .attr("width", t2_pie_icon_size)
        .attr("height", t2_pie_icon_size)
        .attr("preserveAspectRatio", "xMidYMid slice");

    t2_pie.append("text")
        .text(sector.title)
        .attr("x", x + t2_pie_icon_size + t2_pie_legend_hspace / 2)
        .attr("y", t2_pie_icon_size / 2)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "central")
        .attr("font-weight", fontWeight.normal)
        .attr("letter-spacing", letterSpacing)
        .attr("font-size", fontSize.small);
  }

  const t2_pie_legend = t2_pie.append("g")
      .attr("transform", `translate(${t2_pie_radius}, ${t2_pie_icon_size + 2 * t2_pie_vspace + 2 * t2_pie_radius + t2_pie_legend_padding_top})`);
  t2_pie_legend.append("rect")
      .attr("width", t2_pie_legend_size)
      .attr("height", t2_pie_legend_size)
      .attr("fill", wwfColor.mediumGreen);
  t2_pie_legend.append("text")
      .text("Erneuerbar")
      .attr("font-weight", fontWeight.thin)
      .attr("x", t2_pie_legend_size + t2_pie_legend_hspace)
      .attr("y", t2_pie_legend_size / 2)
      .attr("dominant-baseline", "central")
      .attr("letter-spacing", letterSpacing)
      .style("font-size", fontSize.small);
  t2_pie_legend.append("rect")
      .attr("x", t2_pie_legend_width / 2)
      .attr("width", t2_pie_legend_size)
      .attr("height", t2_pie_legend_size)
      .attr("fill", wwfColor.black);
  t2_pie_legend.append("text")
      .text("Konventionell")
      .attr("font-weight", fontWeight.thin)
      .attr("x", t2_pie_legend_width / 2 + t2_pie_legend_size + t2_pie_legend_hspace)
      .attr("y", t2_pie_legend_size / 2)
      .attr("dominant-baseline", "central")
      .attr("letter-spacing", letterSpacing)
      .style("font-size", fontSize.small);

  if (is_mobile) {
    t2_pie_legend.selectAll("text").style("font-size", fontSize.xsmall);
  }

  function t2_get_x_scale(year_data) {
    const max_value = Object.entries(year_data).reduce(
        function (sum, current) {
          if (t2_resources.includes(current[0])) {
            return sum + current[1];
          } else {
            return sum;
          }
        },
        0
    );
    return d3.scaleLinear()
        .domain([0, max_value])
        .range([0, width]);
  }

  function t2_change_year(year) {
    t2_tile.select("#t2_bars").remove();
    t2_tile.selectAll("t2_pie").remove();

    const year_data = tiles[2].find(element => element.year === year);
    t2_draw_bars(year_data);
    t2_draw_pie(year_data, "power");
    t2_draw_pie(year_data, "heat");
    t2_draw_pie(year_data, "traffic");
  }

  function t2_draw_bars(year_data) {
    let t2_x = t2_get_x_scale(year_data);
    const t2_stacked_data = d3.stack().keys(t2_resources)([year_data]);

    const t2_bars = t2_tile
        .append("g")
        .attr("transform", `translate(0, ${t2_bar_offset + t2_bar_title_height + t2_puffer / 4})`)
        .attr("id", "t2_bars")
        .selectAll(null)
        .data(t2_stacked_data)
        .enter()
        .append("g");

    t2_bars.append("rect")
        .attr("x", function (d) {
          return t2_x(d[0][0]);
        })
        .attr("y", 0)
        .attr("width", function (d) {
          return t2_x(d[0][1]) - t2_x(d[0][0]);
        })
        .attr("height", t2_bar_height)
        .attr("fill", function (d) {
          return t2_bar_color(d.key);
        });

    for (const resource of t2_resources) {
      t2_tile.select("#t2_icon_" + resource).text(year_data[resource].toLocaleString(undefined, {maximumFractionDigits: 0}));
    }
  }

  function t2_draw_pie(year_data, type) {
    const pie_data_raw = {"ne": (100 - year_data[type]) / 2, "ee": year_data[type], "ne2": (100 - year_data[type]) / 2};
    const pie = d3.pie().value(function (d) {
      return d[1];
    }).sort(null);
    const pie_data = pie(Object.entries(pie_data_raw));

    const position = t2_pie_positions[type];
    const x = t2_pie_radius + t2_pie_hspace * position + t2_pie_radius * 2 * position;
    const arc = d3.arc().innerRadius(0).outerRadius(t2_pie_radius);
    t2_pie.selectAll("t2_pie")
        .data(pie_data)
        .enter()
        .append('path')
        .attr("transform", `translate(${x}, ${t2_pie_icon_size + t2_pie_vspace + t2_pie_radius})`)
        .attr("stroke", function (d) {
          return t2_pie_color(d.data[0]);
        })
        .attr('d', arc)
        .attr('fill', function (d) {
          return t2_pie_color(d.data[0]);
        });

    const pie_text = t2_pie.append("g")
        .attr("id", "t2_" + type + "_text");

    pie_text.append("text")
        .text(year_data[type])
        .attr("x", x)
        .attr("y", t2_pie_icon_size + t2_pie_vspace + t2_pie_radius + t2_pie_radius / 2)
        .style("fill", wwfColor.white)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .style("font-size", fontSize.small)
        .attr("font-weight", fontWeight.bold)
        .attr("letter-spacing", letterSpacing);

    pie_text.append("text")
        .text(100 - year_data[type])
        .attr("x", x)
        .attr("y", t2_pie_icon_size + t2_pie_vspace + t2_pie_radius - t2_pie_radius / 2)
        .style("fill", wwfColor.white)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .style("font-size", fontSize.small)
        .attr("font-weight", fontWeight.bold)
        .attr("letter-spacing", letterSpacing);
  }

  function t2_draw_icons(group, resources, weight = fontWeight.normal) {
    const rect_width = (width - (resources.length - 1) * t2_icon_hspace) / resources.length;
    for (const [i, resource] of resources.entries()) {
      const ri = t2_resources.indexOf(resource);
      const middle = i * (rect_width + t2_icon_hspace) + rect_width / 2;
      $(group.node().appendChild(icons[t2_icons[ri]].documentElement.cloneNode(true)))
          .attr("x", middle - t2_icon_size / 2)
          .attr("y", 0)
          .attr("width", t2_icon_size)
          .attr("height", t2_icon_size)
          .attr("preserveAspectRatio", "xMidYMid slice");

      group.append("rect")
          .attr("x", i * (rect_width + t2_icon_hspace))
          .attr("y", t2_icon_size + t2_icon_vspace)
          .attr("width", rect_width)
          .attr("height", t2_icons_rect_height)
          .attr("fill", t2_bar_color(resource));

      group.append("text")
          .attr("id", "t2_icon_" + resource)
          .attr("x", middle)
          .attr("y", t2_icon_size + t2_icon_vspace + t2_icons_rect_height / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", fontSize.small)
          .attr("font-weight", fontWeight.bold)
          .attr("fill", "white");

      group.append("text")
          .text(t2_resources_names[resource])
          .attr("x", middle)
          .attr("y", t2_icon_size + 2 * t2_icon_vspace + t2_icons_rect_height)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "hanging")
          .attr("font-size", (is_mobile) ? fontSize.xsmall : fontSize.small)
          .attr("font-weight", weight)
          .attr("fill", t2_bar_color(resource));
    }
  }

  if ("year" in initials) {
    const year_data = $("#t2_year").data("ionRangeSlider");
    year_data.update({from: initials.year});
  } else {
    t2_change_year(tiles[2][tiles[2].length - 1].year);
  }
});
