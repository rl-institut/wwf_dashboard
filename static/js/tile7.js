
const distances = [5, 35, 550, 1900];
const distance_switch = 2;  // At which distance aiplanes are shown instead of bicycles

$("#t7_distance").ionRangeSlider({
  grid: true,
  prettify_enabled: false,
  skin: "round",
  hide_min_max: true,
  values: distances,
  from: 0,
  postfix: " km",
  onChange: function (data) {
    t7_change_distance(data.from)
  }
});

const t7_routes = [
  ["Berlin-Mitte", "Berlin-Neukölln"],
  ["Berlin-Mitte", "Potsdam"],
  ["Berlin-Mitte", "Frankfurt/Main"],
  ["Berlin-Mitte", "Barcelona"]
]

const t7_vehicle_labels = [
  "Fahrrad/Fußgänger",
  "Mittelklasse-Elektro-PKW (Ökostrom)",
  "Bahn",
  "Fernlinienbus (Ökostrom)",
  "Mittelklasse-PKW",
  "Flugzeug"
]

const t7_vehicle_icons = [
  "i_fussgaenger", "i_e_auto_normal", "i_bahn", "i_fernbus", "i_verkehr", "i_flugzeug"
]

const t7_vehicle_names = {
  "bicycle": "Fahrrad",
  "e_pkw": "PKW (Elektro mit Ökostrom)",
  "train_short": "Bahn (Nahverkehr)",
  "train_long": "Bahn (Fernverkehr)",
  "e_bus": "Fernlinienbus (Elektro mit Ökostrom)",
  "pkw": "PKW (konventionell)",
  "airplane_short": "Flugzeug (Inland)",
  "airplane_long": "Flugzeug (Fern)"
}

const t7_vehicles_at_distance = {
  5: ["bicycle", "e_pkw", "train_short", "e_bus", "pkw"],
  35: ["bicycle", "e_pkw", "train_short", "e_bus", "pkw"],
  550: ["e_pkw", "train_long", "e_bus", "pkw", "airplane_short"],
  1900: ["e_pkw", "train_long", "e_bus", "pkw", "airplane_long"],
}

const t7_route_space = 7;
const t7_route_height = 40;
const t7_route_text_space = 15;
const t7_route_offset = 30;

const t7_chart_height = 230;
const t7_bar_gap = 10;
const t7_bar_text_space = 8;
const t7_icon_size = 21;
const t7_icon_space = 10;

const t7_svg = d3.select("#t7")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Route
t7_svg.append("text")
  .text("Entspricht der folgenden Strecke:")
  .attr("x", chart_width / 2)
  .attr("y", 0)
  .style("text-anchor", "middle");

t7_svg.append("rect")
  .attr("x", 0)
  .attr("y", t7_route_space + t7_route_upper_padding)
  .attr("width", chart_width)
  .attr("height", t7_route_height)
  .attr("fill", "#F3F3F3");

t7_svg.append("text")
  .text("< >")
  .attr("x", chart_width / 2)
  .attr("y", t7_route_space + t7_route_height / 2 + t7_route_upper_padding)
  .attr("font-weight", "bold")
  .style("text-anchor", "middle")
  .style("dominant-baseline", "central");

// CHART

const t7_x = d3.scaleBand()
  .range([ 0, chart_width ])
  .domain([0, 1, 2, 3, 4, 5]);

const t7_chart = t7_svg.append("g")
  .attr("transform", "translate(0," + (t7_route_space + t7_route_height + t7_route_offset + t7_route_upper_padding * 2) + ")")

t7_svg.append("text")
  .text("CO2-Emissionen pro Person in")
  .attr("x", 0)
  .attr("y", t7_route_space + t7_route_height + t7_route_offset + t7_route_upper_padding * 2)
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size",fontSize.small);
t7_svg.append("text")
  .text("kg nach Verkehrsmittel")
  .attr("x", 0)
  .attr("y", t7_route_space + t7_route_height + t7_route_offset + t7_route_upper_padding * 2 + 20)
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size",fontSize.small);

t7_chart.append("g")
  .attr("id", "t7_xaxis")
  .attr("transform", "translate(0," + t7_chart_height + ")")
  .call(
    d3.axisBottom(t7_x).ticks().tickFormat(
      function(d) {
        return t7_vehicle_labels[d];
      }
    )
  )
  .selectAll("text")
    .attr("transform", "translate(-10,30)rotate(-45)")
    .style("text-anchor", "end")
    .attr("font-weight", fontWeight.normal)
    .attr("letter-spacing", letterSpacing)
    .attr("font-size", fontSize.xsmall);
  d3.select("#t7_xaxis").select('.domain').attr('stroke-width', 0);
  d3.select("#t7_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

for (const [i, icon] of t7_vehicle_icons.entries()) {
  $(t7_chart.node().appendChild(icons[icon].documentElement.cloneNode(true)))
    .attr("x", t7_x(i) + t7_x.bandwidth() / 2 - t7_icon_size / 2)
    .attr("y", t7_chart_height + t7_icon_space)
    .attr("width", t7_icon_size)
    .attr("height", t7_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");
}

t7_chart.append("line")
  .attr("x1", 0)
  .attr("x2", chart_width)
  .attr("y1", t7_chart_height)
  .attr("y2", t7_chart_height)
  .attr("stroke", wwfColor.black)
  .attr("stroke-width", chart_axis_stroke_width)


function t7_change_distance(distance) {
  t7_change_route(distance);
  t7_change_bars(distance);
}

function t7_change_route(distance) {
  t7_svg.select("#t7_route").remove();
  const t7_route = t7_svg.append("g")
    .attr("id", "t7_route");
  t7_route.append("text")
    .text(t7_routes[distance][0])
    .attr("x", chart_width / 2 - t7_route_text_space)
    .attr("y", t7_route_space + t7_route_height / 2 + t7_route_upper_padding)
    .attr("font-weight", fontWeight.bold)
    .style("text-anchor", "end")
    .style("dominant-baseline", "central");
  t7_route.append("text")
    .text(t7_routes[distance][1])
    .attr("x", chart_width / 2 + t7_route_text_space)
    .attr("y", t7_route_space + t7_route_height / 2 + t7_route_upper_padding)
    .attr("font-weight", fontWeight.bold)
    .style("text-anchor", "starts")
    .style("dominant-baseline", "central");
}

function t7_change_bars(distance_index) {
  t7_chart.select("#t7_bars").remove();
  const t7_bars = t7_chart.append("g")
    .attr("id", "t7_bars");

  let emissions = [0, 0, 0, 0, 0, 0];

  for (const [i, vehicle] of t7_vehicles_at_distance[distances[distance_index]].entries()) {
    let bar_index = i;
    if (distance_index >= distance_switch) {
      bar_index += 1;
    }
    const emissions_per_km = tiles[7].find(element => element.vehicle == t7_vehicle_names[vehicle]).emission;
    emissions[bar_index] = emissions_per_km * distances[distance_index];
  }

  const t7_y = d3.scaleLinear()
    .range([ t7_chart_height, 0 ])
    .domain([0, Math.max(...emissions)]);

  for (let i = 0; i < 6; i++) {
    const x = t7_x(i);
    const height = t7_y(emissions[i]);
    t7_bars.append("rect")
      .attr("x", x + t7_bar_gap / 2)
      .attr("y", height)
      .attr("width", t7_x.bandwidth() - t7_bar_gap)
      .attr("height", t7_chart_height - height)

    if (((distance_index < distance_switch) && (i < 5)) || ((distance_index >= distance_switch) && (i > 0))) {
      t7_bars.append("text")
        .text(emissions[i].toFixed(0))
        .attr("x", x + t7_x.bandwidth() / 2)
        .attr("y", height - t7_bar_text_space)
        .attr("text-anchor", "middle")
        .attr("font-weight", fontWeight.bold)
        .attr("letter-spacing", letterSpacing)
        .attr("font-size",fontSize.small);
    }
  }
}

t7_change_distance(0);
