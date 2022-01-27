
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
  },
  onUpdate: function (data) {
    t7_change_distance(data.from)
  }
});

const t7_height = (typeof t8_min_height !== 'undefined') ? Math.max(t7_min_height, t8_min_height) : t7_min_height;
const t7_puffer = is_mobile ? 0 : (t7_height - t7_min_height);

const t7_routes = [
  ["Berlin-Mitte", "Berlin-Neukölln"],
  ["Berlin-Mitte", "Potsdam"],
  ["Berlin-Mitte", "Frankfurt/Main"],
  ["Berlin-Mitte", "Barcelona"]
]

const t7_vehicle_labels = [
  ["Fahrrad /", "Fußgänger"],
  ["Bahn"],
  ["E-PKW"],
  ["Bus"],
  ["PKW"],
  ["Flugzeug"],
]

const t7_vehicle_icons = [
  "i_fussgaenger_fahrrad", "i_bahn", "i_e_auto", "i_fernbus", "i_verkehr", "i_flugzeug"
]

const t7_vehicle_names = {
  "bicycle": "Fahrrad",
  "e_pkw": "PKW (Elektro mit Ökostrom)",
  "train_short": "Bahn (Nahverkehr)",
  "train_long": "Bahn (Fernverkehr)",
  "bus_short": "ÖPNV (Bus, konventionell)",
  "bus_long": "Fernlinienbus (konventionell)",
  "pkw": "PKW (konventionell)",
  "airplane_short": "Flugzeug (Inland)",
  "airplane_long": "Flugzeug (Fern)"
}

const t7_vehicles_at_distance = {
  5: ["bicycle","train_short", "e_pkw", "bus_short", "pkw"],
  35: ["bicycle", "train_short", "e_pkw", "bus_short", "pkw"],
  550: ["train_long", "e_pkw", "bus_long", "pkw", "airplane_short"],
  1900: ["train_long", "e_pkw", "bus_long", "pkw", "airplane_long"],
}

const t7_svg = d3.select("#t7")
  .append("svg")
    .attr("width", width + 2 * share_margin)
    .attr("height", t7_header_height + t7_height + 2 * share_margin);

t7_svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "white");

draw_header(t7_svg, 7, t7_header);

const t7_tile = t7_svg.append("g")
  .attr("transform", `translate(${share_margin}, ${t7_header_height + t7_route_offset + share_margin})`);

// Route
t7_tile.append("text")
  .text("Entspricht der folgenden Strecke:")
  .attr("x", width / 2)
  .attr("y", 0)
  .style("text-anchor", "middle")
  .attr("letter-spacing", letterSpacing);

t7_tile.append("rect")
  .attr("x", 0)
  .attr("y", t7_route_space + t7_route_upper_padding)
  .attr("width", width)
  .attr("height", t7_route_height)
  .attr("fill", "#F3F3F3");

t7_tile.append("text")
  .text("< >")
  .attr("x", width / 2)
  .attr("y", t7_route_space + t7_route_height / 2 + t7_route_upper_padding)
  .attr("font-weight", "bold")
  .style("text-anchor", "middle")
  .style("dominant-baseline", "central")
  .attr("letter-spacing", letterSpacing);

// CHART

const t7_x = d3.scaleBand()
  .range([ 0, t7_chart_width ])
  .domain([0, 1, 2, 3, 4, 5]);

const t7_chart_area = t7_tile.append("g")
  .attr("transform", `translate(${t7_chart_hoffset}, ${t7_route_space + t7_route_height + t7_route_offset + t7_route_upper_padding * 2})`);

t7_chart_area.append("text")
  .text("CO2-Emissionen pro Person in")
  .attr("x", 0)
  .attr("y", 0)
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size",fontSize.small);
t7_chart_area.append("text")
  .text("kg nach Verkehrsmittel")
  .attr("x", 0)
  .attr("y", 20)
  .attr("font-weight", fontWeight.normal)
  .attr("letter-spacing", letterSpacing)
  .attr("font-size",fontSize.small);

const t7_chart = t7_chart_area.append("g")
  .attr("transform", `translate(0, ${t7_unit_height})`);

for (const [i, labels] of t7_vehicle_labels.entries()) {
  const x = t7_x(i) + t7_x.bandwidth() / 2;
  let y = t7_chart_height + t7_icon_size + 2 * t7_icon_space;
  for (const [l, label] of labels.entries()) {
    t7_chart.append("text")
      .attr("id", "t7_text_" + i + l)
      .text(label)
      .attr("transform", `rotate(-45, ${x}, ${y})`)
      .attr("x", x)
      .attr("y", y + l * 20)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "hanging")
      .attr("font-weight", fontWeight.normal)
      .attr("letter-spacing", letterSpacing)
      .attr("font-size",fontSize.xsmall);
    }
}

for (const [i, icon] of t7_vehicle_icons.entries()) {
  $(t7_chart.node().appendChild(icons[icon].documentElement.cloneNode(true)))
    .attr("id", "t7_icon_" + i)
    .attr("x", t7_x(i) + t7_x.bandwidth() / 2 - t7_icon_size / 2)
    .attr("y", t7_chart_height + t7_icon_space)
    .attr("width", t7_icon_size)
    .attr("height", t7_icon_size)
    .attr("preserveAspectRatio", "xMidYMid slice");
}

t7_chart.append("line")
  .attr("x1", 0)
  .attr("x2", t7_chart_width)
  .attr("y1", t7_chart_height)
  .attr("y2", t7_chart_height)
  .attr("stroke", wwfColor.black)
  .attr("stroke-width", chart_axis_stroke_width);


function t7_change_distance(distance) {
  t7_change_route(distance);
  t7_change_bars(distance);
}

function t7_change_route(distance) {
  t7_tile.select("#t7_route").remove();
  const t7_route = t7_tile.append("g")
    .attr("id", "t7_route");
  t7_route.append("text")
    .text(t7_routes[distance][0])
    .attr("x", width / 2 - t7_route_text_space)
    .attr("y", t7_route_space + t7_route_height / 2 + t7_route_upper_padding)
    .attr("font-weight", fontWeight.bold)
    .style("text-anchor", "end")
    .style("dominant-baseline", "central");
  t7_route.append("text")
    .text(t7_routes[distance][1])
    .attr("x", width / 2 + t7_route_text_space)
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

  // Gray-out
  if (distance_index < distance_switch) {
    t7_chart.select("#t7_text_00").attr("fill", wwfColor.black);
    t7_chart.select("#t7_text_01").attr("fill", wwfColor.black);
    t7_chart.select("#t7_text_50").attr("fill", wwfColor.gray3);
    t7_chart.select("#t7_icon_0").selectAll("path").style("fill", wwfColor.black)
    t7_chart.select("#t7_icon_5").selectAll("path").style("fill", wwfColor.gray3)
  } else {
    t7_chart.select("#t7_text_50").attr("fill", wwfColor.black);
    t7_chart.select("#t7_text_00").attr("fill", wwfColor.gray3);
    t7_chart.select("#t7_text_01").attr("fill", wwfColor.gray3);
    t7_chart.select("#t7_icon_0").selectAll("path").style("fill", wwfColor.gray3)
    t7_chart.select("#t7_icon_5").selectAll("path").style("fill", wwfColor.black)
  }
}

if ("distance" in initials) {
  const init_data = $("#t7_distance").data("ionRangeSlider");
  init_data.update({from: distances.indexOf(parseInt(initials.distance))})
} else {
  t7_change_distance(0);
}
