
$("#t2_year").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  min: tiles[2][0].year,
  max: tiles[2][tiles[2].length - 1].year,
  from: tiles[2][tiles[2].length - 1].year,
  onChange: function (data) {
    t2_change_year(data.from)
  }
});

const t2_height = (typeof t1_min_height !== 'undefined') ? Math.max(t1_min_height, t2_min_height) : t2_min_height;
const t2_puffer = is_mobile ? 0 : (t2_height - t2_min_height);

const t2_resources = ["renewables", "oil", "gas", "coal", "nuclear", "savings"];
const t2_resources_names = {
  "renewables": "Erneuerbare Energien",
  "oil": "Öl",
  "gas": "Gas",
  "coal": "Kohle",
  "nuclear": "Atom",
  "savings": "Einsparungen"
};
const t2_pie_positions = {"power": 0, "heat": 1, "traffic": 2};
const t2_pie_sectors = [
  {"title": "Strom", "icon": "i_strom"},
  {"title": "Wärme", "icon": "i_waerme"},
  {"title": "Verkehr", "icon": "i_verkehr"}
];

const t2_bar_color = d3.scaleOrdinal()
  .domain(t2_resources)
  .range([wwfColor.mediumGreen, "co#000", "#3A3A3A", "#5A5A5A", "#808080", wwfColor.aqua]);

const t2_pie_color = d3.scaleOrdinal()
    .domain(["ee", "ne", "ne2"])
    .range([wwfColor.mediumGreen, wwfColor.black, wwfColor.black]);

const t2_svg = d3.select("#t2")
  .append("svg")
    .attr("width", width)
    .attr("height", t2_height);

t2_svg.append("text")
  .text("Energieverbrauch in Deutschland (GWh)")
  .attr("x", width / 2)
  .attr("y", t2_bar_offset)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("letter-spacing", letterSpacing);

// ARROW

const t2_arrow = t2_svg.append("g")
  .attr("transform", `translate(0, ${t2_bar_total_height + t2_puffer / 2})`)

$(t2_arrow.node().appendChild(icons["arrow"].documentElement.cloneNode(true)))
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

const t2_pie = t2_svg.append("g")
  .attr("transform", `translate(${t2_pie_hspace}, ${t2_bar_total_height + t2_arrow_total_height + t2_pie_offset + t2_puffer / 2})`);

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
  .style("font-size",fontSize.small);

function t2_get_x_scale(year_data) {
  const max_value = Object.entries(year_data).reduce(
    function(sum, current) {
      if (t2_resources.includes(current[0])) {
        return sum + current[1]
      } else {
        return sum
      }
    },
    0
  )
  return d3.scaleLinear()
    .domain([0, max_value])
    .range([ 0, width]);
}

function t2_adjust_text(x, y, bar_width) {
  if (bar_width < 20) {
    return {
      "x": x,
      "y": y, "transform": "rotate(-90 " + x + " " + y + ")",
      "text-anchor": "middle",
      "dominant-baseline": "text-before-edge",
      "font-weight": fontWeight.bold,
      "font-size": fontSize.xsmall,
      "letter-spacing": letterSpacing
    }
  } else if (bar_width < 40) {
    return {
      "x": x,
      "y": y, "transform": "rotate(-90 " + x + " " + y + ")",
      "text-anchor": "middle",
      "dominant-baseline": "text-before-edge",
      "font-weight": fontWeight.bold,
      "font-size": fontSize.xsmall,
      "letter-spacing": letterSpacing
    }
  } else {
    return {"x": x + bar_width / 2, "y": y, "text-anchor": "middle", "dominant-baseline": "central", "font-weight": fontWeight.bold, "font-size": fontSize.xsmall, "letter-spacing": letterSpacing}
  }
}

function t2_change_year(year) {
  t2_svg.select("#t2_bars").remove();
  t2_svg.selectAll("t2_pie").remove();

  const year_data = tiles[2].find(element => element.year == year);
  t2_draw_bars(year_data);
  t2_draw_pie(year_data, "power");
  t2_draw_pie(year_data, "heat");
  t2_draw_pie(year_data, "traffic");
}

function t2_draw_bars(year_data) {
  let t2_x = t2_get_x_scale(year_data)
  const t2_stacked_data = d3.stack().keys(t2_resources)([year_data]);

  const t2_bars = t2_svg
    .append("g")
    .attr("transform", `translate(0, ${t2_bar_offset + t2_bar_title_height + t2_bar_title_padding_bottom})`)
    .attr("id", "t2_bars")
      .selectAll(null)
      .data(t2_stacked_data)
      .enter()
      .append("g")

  t2_bars.append("rect")
    .attr("x", function(d) { return t2_x(d[0][0]); })
    .attr("y", 0)
    .attr("width", function(d) {return t2_x(d[0][1]) - t2_x(d[0][0]);})
    .attr("height", t2_bar_height )
    .attr("fill", function(d) {return t2_bar_color(d.key);});

  t2_bars.append("text")
    .each(function(d) {
      d3.select(this).text(Math.round(d[0].data[d.key]));
      d3.select(this).attr("fill", wwfColor.white);
      const adjustment = t2_adjust_text(t2_x(d[0][0]), t2_bar_height / 2, t2_x(d[0][1]) - t2_x(d[0][0]));
      for (const key in adjustment) {
        d3.select(this).attr(key, adjustment[key]);
      }
    })

  t2_bars.append("text")
    .attr("transform", function(d) { return "rotate(-90 " + t2_x(d[0][0]) + ", " + 0 + ")"; })
    .text(function(d) {return t2_resources_names[d.key];})
    .attr("x", function(d) { return t2_x(d[0][0]) - t2_bar_height - t2_bar_vspace; })
    .attr("y", function(d) { return (t2_x(d[0][1]) - t2_x(d[0][0])) / 2})
    .attr("fill", function(d) {
      if (d.key == "renewables") {
        return "#137534"
      } else {
        return wwfColor.black
      }
    })
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .attr("font-size", fontSize.small)
    .attr("letter-spacing", letterSpacing);
}

function t2_draw_pie(year_data, type) {
  const pie_data_raw = {"ne": (100 - year_data[type]) / 2, "ee": year_data[type], "ne2": (100 - year_data[type]) / 2}
  const pie = d3.pie().value(function(d) {return d[1]}).sort(null)
  const pie_data = pie(Object.entries(pie_data_raw))

  const position = t2_pie_positions[type];
  const x = t2_pie_radius + t2_pie_hspace * position + t2_pie_radius * 2 * position;
  const arc = d3.arc().innerRadius(0).outerRadius(t2_pie_radius)
  t2_pie.selectAll("t2_pie")
    .data(pie_data)
    .enter()
    .append('path')
    .attr("transform", `translate(${x}, ${t2_pie_icon_size + t2_pie_vspace + t2_pie_radius})`)
    .attr("stroke", function(d){return t2_pie_color(d.data[0])})
    .attr('d', arc)
    .attr('fill', function(d){return t2_pie_color(d.data[0])});

  const pie_text = t2_pie.append("g")
    .attr("id", "t2_" + type + "_text")

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

t2_change_year(2020);
