
$("#t6_date").datepicker(
  {
    format: "dd.mm.yyyy",
    startDate: "01.01.2021",
    endDate: "0d",
  }
);
$("#t6_date").on("changeDate", t6_change_date);

const t6_height = (typeof t5_min_height !== 'undefined') ? Math.max(t5_min_height, t6_min_height) : t6_min_height;
const t6_puffer = is_mobile ? 0 : (t6_height - t6_min_height);

const t6_technologies = {
  "renewables": {"title": "Sonstige Erneuerbare", "icon": "i_sonstige_ee", "icon_color": "white"},
  "wind_onshore": {"title": "Windenergie an Land", "icon": "i_wind_onshore", "icon_color": "black"},
  "pv": {"title": "Photovoltaik", "icon": "i_pv", "icon_color": "black"},
  "fossil": {"title": "Konventionelle Kraftwerke", "icon": "i_pollution", "icon_color": "white"},
};

const y_max = 120000;

const t6_x = d3.scaleLinear()
  .range([ 0, chart_width ])
  .domain([0, 23])
const t6_y = d3.scaleLinear()
  .range([ t6_chart_height, 0 ])
  .domain([0, y_max]);
const t6_color = d3.scaleOrdinal()
  .domain(Object.keys(t6_technologies))
  .range(["#008a88", "#70B6D6", "#F3CC00", "#000000"]);

const t6_pie_color = d3.scaleOrdinal()
  .domain(["ee", "ne", "ne2"])
  .range([wwfColor.mediumGreen, wwfColor.black, wwfColor.black])

const t6_svg = d3.select("#t6")
  .append("svg")
    .attr("width", width)
    .attr("height", t6_height)
  .append("g")
    .attr("transform", `translate(${t6_chart_yaxis_width}, 0)`);


// PIE

const t6_pie_legend = t6_svg.append("g")
  .attr("transform", `translate(${t6_pie_legend_x}, ${t6_pie_legend_y})`);
t6_pie_legend.append("rect")
  .attr("width", t6_pie_legend_rect)
  .attr("height", t6_pie_legend_rect)
  .attr("fill", "#7ab638");
t6_pie_legend.append("text")
  .text("Erneuerbar")
  .attr("x", t6_pie_legend_rect + legendLeftPadding)
  .attr("y", t6_pie_legend_rect / 2)
  .attr("dominant-baseline", "central")
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .style("font-size", fontSize.xsmall)
t6_pie_legend.append("rect")
  .attr("x", t6_pie_legend_width / 2)
  .attr("width", t6_pie_legend_rect)
  .attr("height", t6_pie_legend_rect)
  .attr("fill", wwfColor.black);
t6_pie_legend.append("text")
  .text("Konventionell")
  .attr("x", t6_pie_legend_width / 2 + t6_pie_legend_rect + legendLeftPadding)
  .attr("y", t6_pie_legend_rect / 2)
  .attr("dominant-baseline", "central")
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .style("font-size", fontSize.xsmall);

t6_svg.append("text")
  .text("Anteil Erneuerbarer")
  .attr("x", chart_width / 2 + t6_pie_hspace)
  .attr("y", t6_pie_offset + t6_pie_radius - t6_pie_text_height / 2)
  .attr("letter-spacing", letterSpacing)
  .style("font-size", fontSize.small);
t6_svg.append("text")
  .text("an diesem Tag")
  .attr("x", chart_width / 2 + t6_pie_hspace)
  .attr("y", t6_pie_offset + t6_pie_radius + t6_pie_text_height / 2)
  .style("text-anchor", "left")
  .attr("letter-spacing", letterSpacing)
  .style("font-size", fontSize.small);

// DIVIDING-line
t6_svg.append("line")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", t6_pie_total_height + t6_puffer / 2 + t6_chart_offset / 2)
  .attr("y2", t6_pie_total_height + t6_puffer / 2 + t6_chart_offset / 2)
  .attr("stroke", wwfColor.gray1)
  .attr("stroke-width", 1);

// CHART
const t6_chart = t6_svg.append("g")
  .attr("transform", `translate(0, ${t6_pie_total_height + t6_puffer + t6_chart_offset})`);

// X-Axis
t6_chart.append("g")
  .attr("id", "t6_xaxis")
  .attr("transform", "translate(0," + t6_chart_height + ")")
  .call(d3.axisBottom(t6_x))
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("fill", wwfColor.gray1)
    .attr("font-weight", fontWeight.thin)
    .attr("letter-spacing", letterSpacing)
    .attr("font-size", fontSize.xsmall)
d3.select("#t6_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t6_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

t6_chart.append("line")
  .attr("x1", 0)
  .attr("x2", chart_width)
  .attr("y1", t6_chart_height)
  .attr("y2", t6_chart_height)
  .attr("stroke", wwfColor.black)
  .attr("stroke-width", chart_axis_stroke_width);

// Y-Axis
t6_chart.append("g")
  .attr("id", "t6_yaxis")
  .call(
    d3.axisLeft(t6_y)
  )
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("fill", wwfColor.gray1)
  .attr("font-weight", fontWeight.thin)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size", fontSize.xsmall)
d3.select("#t6_yaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t6_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// ICONS

const t6_icons = t6_svg.append("g")
  .attr("transform", `translate(0, ${t6_pie_total_height + t6_puffer + t6_chart_total_height + t6_icon_offset})`);

for (const technology of Object.keys(t6_technologies)) {
  const i = Object.keys(t6_technologies).indexOf(technology)
  const x = (i % t6_icon_wrap) * chart_width / 2;
  const y = (parseInt(i / t6_icon_wrap)) * (t6_icon_size + t6_icon_row_height);

  // Icon text gets 1/5 of height, symbol and rect get 2/5 of height
  t6_icons.append("text")
    .text(t6_technologies[technology].title)
    .attr("x", x + t6_icon_size + t6_icon_padding)
    .attr("y", y + t6_icon_size / 2)
    .attr("text-anchor", "left")
    .attr("dominant-baseline", "central")
    .attr("font-weight", fontWeight.normal)
    .attr("letter-spacing", letterSpacing)
    .style("font-size", fontSize.xsmall)

  t6_icons.append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("width", t6_icon_size)
    .attr("height", t6_icon_size)
    .attr("fill", t6_color(technology));

  $(t6_icons.node().appendChild(icons[t6_technologies[technology].icon].documentElement.cloneNode(true)))
    .attr("id", "t6_icon_" + technology)
    .attr("x", x + t6_icon_margin)
    .attr("y", y + t6_icon_margin)
    .attr("width", t6_icon_size - 2 * t6_icon_margin)
    .attr("height", t6_icon_size - 2 * t6_icon_margin)
    .attr("preserveAspectRatio", "xMidYMid slice")

  t6_icons.select("#t6_icon_" + technology)
    .selectAll("path")
      .style("fill", t6_technologies[technology].icon_color);
}

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
    .attr("transform", `translate(${chart_width / 2 - t6_pie_radius - t6_pie_hspace}, ${t6_pie_offset + t6_pie_radius})`)
    .attr("stroke", function(d){return t6_pie_color(d.data[0])})
    .attr('d', arc)
    .attr('fill', function(d){return t6_pie_color(d.data[0])})

  t6_svg.append("text")
    .attr("id", "t6_pie_text")
    .text(res_share.toFixed(0) + "%")
    .attr("x", chart_width / 2 - t6_pie_radius - t6_pie_hspace)
    .attr("y", t6_pie_offset + t6_pie_radius * 3 / 2 + 5)
    .style("fill", wwfColor.white)
    .style("dominant-baseline", "middle")
    .style("text-anchor", "middle")
    .attr("font-weight", fontWeight.bold)
    .attr("letter-spacing", letterSpacing)
    .style("font-size", fontSize.small)
}

function t6_decrease_date() {
  let date = $("#t6_date").datepicker("getDate");
  date.setDate(date.getDate() - 1);
  date.setHours(23);
  if (date >= $("#t6_date").datepicker("getStartDate")) {$("#t6_date").datepicker("setDate", date);}
}

function t6_increase_date() {
  let date = $("#t6_date").datepicker("getDate");
  date.setDate(date.getDate() + 1);
  date.setHours(0);
  if (date <= $("#t6_date").datepicker("getEndDate")) {$("#t6_date").datepicker("setDate", date);}
}

$("#t6_date").datepicker("setDate", "now");
