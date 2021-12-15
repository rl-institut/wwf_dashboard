
$("#t2_year").ionRangeSlider({
  min: tiles[2][0].year,
  max: tiles[2][tiles[2].length - 1].year,
  from: tiles[2][tiles[2].length - 1].year,
  onChange: function (data) {
    t2_change_year(data.from)
  }
});

const t2_resources = ["renewables", "oil", "gas", "coal", "nuclear", "savings"];
const t2_resources_names = {
  "renewables": "Erneuerbare Energien",
  "oil": "Öl",
  "gas": "Gas",
  "coal": "Kohle",
  "nuclear": "Atom",
  "savings": "Einsparungen"
};
const t2_bar_height = 40;
const t2_bar_text_offset = 10;

const t2_bar_color = d3.scaleOrdinal()
  .domain(t2_resources)
  .range(["green", "black", "darkgrey", "grey", "lightgrey", "teal"]);

const t2_pie_y = 350;
const t2_pie_space = 10;
const t2_pie_radius = (chart_width - 4 * t2_pie_space) / 3 / 2;
const t2_pie_positions = {"power": 0, "heat": 1, "traffic": 2}

const t2_pie_legend_width = 300;
const t2_pie_legend_x = chart_width / 2 - t2_pie_legend_width / 2;
const t2_pie_legend_y = 450;
const t2_pie_legend_rect = 20;

const t2_pie_color = d3.scaleOrdinal()
    .domain(["ee", "ne", "ne2"])
    .range(["green", "black", "black"])

const t2_svg = d3.select("#t2")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const t2_pie_legend = t2_svg.append("g")
  .attr("transform", `translate(${t2_pie_legend_x}, ${t2_pie_legend_y})`);
t2_pie_legend.append("rect")
  .attr("width", t2_pie_legend_rect)
  .attr("height", t2_pie_legend_rect)
  .attr("fill", "green");
t2_pie_legend.append("text")
  .text("Erneuerbar")
  .attr("x", t2_pie_legend_rect + 5)
  .attr("y", t2_pie_legend_rect / 2)
  .attr("dominant-baseline", "middle");
t2_pie_legend.append("rect")
  .attr("x", t2_pie_legend_width / 2)
  .attr("width", t2_pie_legend_rect)
  .attr("height", t2_pie_legend_rect)
  .attr("fill", "black");
t2_pie_legend.append("text")
  .text("Konventionell")
  .attr("x", t2_pie_legend_width / 2 + t2_pie_legend_rect + 5)
  .attr("y", t2_pie_legend_rect / 2)
  .attr("dominant-baseline", "middle");


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
    .range([ 0, chart_width]);
}

function t2_adjust_text(x, y, bar_width) {
  if (bar_width < 20) {
    return {
      "x": x,
      "y": y, "transform": "rotate(-90 " + x + " " + y + ")",
      "text-anchor": "middle",
      "dominant-baseline": "hanging"
    }
  } else if (bar_width < 40) {
    return {
      "x": x,
      "y": y, "transform": "rotate(-90 " + x + " " + y + ")",
      "text-anchor": "middle",
      "dominant-baseline": "hanging"
    }
  } else {
    return {"x": x + bar_width / 2, "y": y, "text-anchor": "middle", "dominant-baseline": "middle"}
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
      d3.select(this).attr("fill", "white");
      const adjustment = t2_adjust_text(t2_x(d[0][0]), t2_bar_height / 2, t2_x(d[0][1]) - t2_x(d[0][0]));
      for (const key in adjustment) {
        d3.select(this).attr(key, adjustment[key]);
      }
    })

  t2_bars.append("text")
    .attr("transform", function(d) { return "rotate(-90 " + t2_x(d[0][0]) + ", " + 0 + ")"; })
    .text(function(d) {return t2_resources_names[d.key];})
    .attr("x", function(d) { return t2_x(d[0][0]) - t2_bar_height - t2_bar_text_offset; })
    .attr("y", function(d) { return (t2_x(d[0][1]) - t2_x(d[0][0])) / 2})
    .attr("fill", function(d) {
      if (d.key == "renewables") {
        return "green"
      } else {
        return "black"
      }
    })
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
}

function t2_draw_pie(year_data, type) {
  const t2_pie_data_raw = {"ne": (100 - year_data[type]) / 2, "ee": year_data[type], "ne2": (100 - year_data[type]) / 2}
  const t2_pie = d3.pie().value(function(d) {return d[1]}).sort(null)
  const t2_pie_data = t2_pie(Object.entries(t2_pie_data_raw))

  const position = t2_pie_positions[type];
  const x = t2_pie_radius + t2_pie_space * (position + 1) + t2_pie_radius * 2 * position;
  const arc = d3.arc().innerRadius(0).outerRadius(t2_pie_radius)
  t2_svg
    .selectAll("t2_pie")
    .data(t2_pie_data)
    .enter()
    .append('path')
    .attr("transform", "translate(" + x + ", " + t2_pie_y + ")")
    .attr("stroke", "black")
    .attr('d', arc)
    .attr('fill', function(d){return t2_pie_color(d.data[0])})

  const pie_text = t2_svg
    .append("g")
    .attr("id", "t2_" + type + "_text")

  pie_text.append("text")
    .text(year_data[type])
    .attr("x", x)
    .attr("y", t2_pie_y + t2_pie_radius / 2)
    .style("fill", "white")
    .style("text-anchor", "middle")
    .style("font-size", 17)

  pie_text.append("text")
    .text(100 - year_data[type])
    .attr("x", x)
    .attr("y", t2_pie_y - t2_pie_radius / 2)
    .style("fill", "white")
    .style("text-anchor", "middle")
}

t2_change_year(2020);