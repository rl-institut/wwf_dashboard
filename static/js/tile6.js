
$("#t6_date").datepicker(
  {
    format: "dd.mm.yyyy",
  }
);
$("#t6_date").on("changeDate", t6_change_date);

const t6_technologies = {
  "renewables": "Sonstige Erneuerbare",
  "wind_onshore": "Windenergie an Land",
  "pv": "Photovoltaik",
  "fossil": "Konventionelle Kraftwerke",
};

const t6_pie_radius = 38;
const t6_pie_text_width = 195;
const t6_pie_text_height = 20;
const t6_pie_margin = 15;
const t6_pie_area_width = 2 * t6_pie_radius + t6_pie_margin + t6_pie_text_width;
const t6_pie_offset = 30;
const t6_pie_height = 2 * t6_pie_radius + t6_pie_margin + t6_pie_text_height;
const t6_pie_legend_width = 300;
const t6_pie_legend_x = chart_width / 2 - t6_pie_legend_width / 2;
const t6_pie_legend_y = 2 * t6_pie_radius + t6_pie_margin;
const t6_pie_legend_rect = 12;

const t6_chart_height = 230;
const t6_chart_offset = 30;

const t6_icon_width = 89;
const t6_icon_height = 26;
const t6_icon_size = 20;
const t6_icon_margin = 8;
const t6_icon_wrap = 2;
const t6_icon_area_height = height - t6_pie_height - t6_pie_offset - t6_chart_height - t6_chart_offset - margin.top - margin.bottom;
const t6_icon_vertical_space = (t6_icon_area_height - t6_icon_size - t6_icon_margin - t6_icon_height) / 3;
const t6_icon_horizontal_space = (chart_width - 3 * t6_icon_width) / 4;

let t6_x = d3.scaleLinear()
  .range([ 0, chart_width ])
  .domain([0, 24])
let t6_y;
const t6_color = d3.scaleOrdinal()
  .domain(Object.keys(t6_technologies))
  .range(["#008a88", "#70B6D6", "#F3CC00", "#000000"]);

const t6_pie_color = d3.scaleOrdinal()
  .domain(["ee", "ne", "ne2"])
  .range(["green", "black", "black"])

const t6_svg = d3.select("#t6")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// PIE

const t6_pie_legend = t6_svg.append("g")
  .attr("transform", `translate(${t6_pie_legend_x}, ${t6_pie_legend_y})`);
t6_pie_legend.append("rect")
  .attr("width", t6_pie_legend_rect)
  .attr("height", t6_pie_legend_rect)
  .attr("fill", "green");
t6_pie_legend.append("text")
  .text("Erneuerbar")
  .attr("x", t6_pie_legend_rect + 5)
  .attr("y", t6_pie_legend_rect / 2)
  .attr("dominant-baseline", "middle");
t6_pie_legend.append("rect")
  .attr("x", t6_pie_legend_width / 2)
  .attr("width", t6_pie_legend_rect)
  .attr("height", t6_pie_legend_rect)
  .attr("fill", "black");
t6_pie_legend.append("text")
  .text("Konventionell")
  .attr("x", t6_pie_legend_width / 2 + t6_pie_legend_rect + 5)
  .attr("y", t6_pie_legend_rect / 2)
  .attr("dominant-baseline", "middle");

t6_svg.append("text")
  .text("Anteil Erneuerbarer")
  .attr("x", chart_width / 2 - t6_pie_area_width / 2 + t6_pie_radius * 2 + t6_pie_margin)
  .attr("y", t6_pie_radius - t6_pie_text_height / 2);
t6_svg.append("text")
  .text("an diesem Tag")
  .attr("x", chart_width / 2 - t6_pie_area_width / 2 + t6_pie_radius * 2 + t6_pie_margin)
  .attr("y", t6_pie_radius + t6_pie_text_height / 2)
  .style("text-anchor", "left");

// CHART
const t6_chart = t6_svg.append("g")
  .attr("transform", "translate(0," + (t6_pie_height + t6_pie_offset) + ")");

// X-Axis
t6_chart.append("g")
  .attr("id", "t6_xaxis")
  .attr("transform", "translate(0," + t6_chart_height + ")")
  .call(d3.axisBottom(t6_x))
  .selectAll("text")
    .style("text-anchor", "end");
d3.select("#t6_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t6_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);


function t6_change_date() {
  t6_chart.select("#t6_area").remove();
  const date = $("#t6_date").val();
  $.get(
    {
      url: "agora",
      async: false,
      data: {date: date},
      dataType: "json",
      success: function(result){
        t6_draw_chart(result.data);
        t6_draw_pie(result.res_share);
      }
    }
  );
}

function t6_draw_chart(agora_data) {
  const stacked_data = d3.stack().keys(Object.keys(t6_technologies))(agora_data);
  const y_max = d3.max(stacked_data[stacked_data.length - 1], d => d[1]);

  t6_update_y_axis(y_max);

  const area = d3
    .area()
    .x(d => t6_x(d.data.index))
    .y0(d => t6_y(d[0]))
    .y1(d => t6_y(d[1]));

  const area_chart = t6_chart.append("g")
    .attr("id", "t6_area")

  const series = area_chart
    .selectAll(".series")
    .data(stacked_data)
    .enter()
    .append("g")
    .attr("class", "series");

  series
    .append("path")
    .style("fill", d => t6_color(d.key))
    .attr("stroke", d => t6_color(d.key))
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", line_width)
    .attr("d", d => area(d));
}

function t6_draw_pie(res_share) {
  const t6_pie_data_raw = {"ne": (100 - res_share) / 2, "ee": res_share, "ne2": (100 - res_share) / 2}
  const t6_pie = d3.pie().value(function(d) {return d[1]}).sort(null)
  const t6_pie_data = t6_pie(Object.entries(t6_pie_data_raw))

  const arc = d3.arc().innerRadius(0).outerRadius(t6_pie_radius)
  t6_svg
    .selectAll("t6_pie")
    .data(t6_pie_data)
    .enter()
    .append('path')
    .attr("transform", `translate(${chart_width / 2 - t6_pie_area_width / 2}, ${t6_pie_radius})`)
    .attr("stroke", "black")
    .attr('d', arc)
    .attr('fill', function(d){return t6_pie_color(d.data[0])})

  t6_svg.append("text")
    .attr("id", "t6_pie_text")
    .text(res_share.toFixed(0) + "%")
    .attr("x", chart_width / 2 - t6_pie_area_width / 2)
    .attr("y", t6_pie_radius * 3 / 2)
    .style("fill", "white")
    .style("dominant-baseline", "middle")
    .style("text-anchor", "middle")
    .style("font-size", 17)
}

function get_xy_for_icon(technology) {
  const i = Object.keys(t6_technologies).indexOf(technology)
  const x = (i % t6_icon_wrap) * t6_icon_width + t6_icon_horizontal_space * (i % t6_icon_wrap + 1);
  const y = (parseInt(i / t6_icon_wrap)) * (t6_icon_height + t6_icon_vertical_space) + t6_icon_vertical_space;
  return [x, y]
}

function t6_update_y_axis(y_max) {
  t6_chart.select("#t6_yaxis").remove();
  t6_y = d3.scaleLinear()
    .range([ t6_chart_height, 0 ])
    .domain([0, y_max]);

  // Y-Axis
  t6_chart.append("g")
    .attr("id", "t6_yaxis")
    .call(
      d3.axisLeft(t6_y)
    )
    .select('.domain')
      .attr('stroke-width', 0);
  d3.select("#t6_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);
}

$("#t6_date").datepicker("setDate", "now");
