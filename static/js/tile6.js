
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

const t6_chart_height = 230;
const t6_chart_offset = 30;

const t6_icon_width = 89;
const t6_icon_height = 26;
const t6_icon_size = 20;
const t6_icon_margin = 8;
const t6_icon_wrap = 3;

let t6_x = d3.scaleLinear()
  .range([ 0, chart_width ])
  .domain([0, 24])
let t6_y;
const t6_color = d3.scaleOrdinal()
  .domain(Object.keys(t6_technologies))
  .range(["#008a88", "#70B6D6", "#F3CC00", "#000000"]);

const t6_svg = d3.select("#t6")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// CHART
const t6_chart = t6_svg.append("g");

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
  let agora_data;
  $.get(
    {
      url: "agora",
      async: false,
      data: {date: date},
      dataType: "json",
      success: function(result){
        agora_data = result.data;
      }
    }
  );

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
