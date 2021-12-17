
const t3_sectors = {
  "agriculture": "Landwirtschaft",
  "industry": "Industrie",
  "traffic": "Verkehr",
  "house": "Gebäude",
  "energy": "Energiewirtschaft",
  "total": "Gesamt"
};

document.getElementsByName("sector").forEach((node) => node.addEventListener("change", t3_change_sector));

const t3_max = tiles[3].reduce(function(max, current){if (current.total > max) {return current.total} else {return max}}, 0);

const t3_chart_height = 230;
const t3_bar_chart_width = 180;
const t3_bar_chart_height = 80;
const t3_bar_height = height - t3_chart_height - margin.top - margin.bottom;

const t3_x = d3.scaleBand()
  .range([ 0, chart_width ])
  .domain(tiles[3].map(function(d) { return d.year; }))
const t3_y = d3.scaleLinear()
  .range([ t3_chart_height, 0 ])
  .domain([0, t3_max]);
const t3_color = d3.scaleOrdinal()
  .domain(Object.keys(t3_sectors))
  .range(["#6C3B24", "#724284", "#006386", "#D82D45", "#A63066", "#137534"]);

const t3_svg = d3.select("#t3")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// CHART
const t3_chart = t3_svg.append("g").attr("transform", "translate(0, " + t3_bar_height + ")");

// X-Axis
t3_chart.append("g")
  .attr("id", "t3_xaxis")
  .attr("transform", "translate(0," + t3_chart_height + ")")
  .call(
    d3.axisBottom(t3_x).tickValues(
      t3_x.domain().filter(function(d, idx) { return idx % 2 == 0 })
    )
  )
  .selectAll("text")
    .attr("text-anchor", "end");
d3.select("#t3_xaxis").select('.domain').attr('stroke-width', 0);
d3.select("#t3_xaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Y-Axis
t3_chart.append("g")
  .attr("id", "t3_yaxis")
  .call(
    d3.axisLeft(t3_y)
  )
  .select('.domain')
    .attr('stroke-width', 0);
d3.select("#t3_yaxis").selectAll(".tick").select("line").attr("stroke-width", 0);

// Grayed sector paths
for (const sector of Object.keys(t3_sectors)) {
  t3_chart.append("path")
    .datum(tiles[3])
    .attr("fill", "none")
    .attr("stroke", "#E2E2E2")
    .attr("stroke-width", line_width)
    .attr("d", d3.line()
      .x(function(d) {return t3_x(d.year)})
      .y(function(d) {return t3_y(d[sector])})
    )
}

function t3_draw_bars(sector) {

}

function t3_draw_current_sector(sector) {
  t3_chart.select("#sector_line").remove();
  t3_chart.append("g")
    .attr("id", "sector_line")
    .append("path")
      .datum(tiles[3])
      .attr("fill", "none")
      .attr("stroke", t3_color(sector))
      .attr("stroke-width", line_width)
      .attr("d", d3.line()
        .x(function(d) {return t3_x(d.year)})
        .y(function(d) {return t3_y(d[sector])})
      )
}

function t3_change_sector() {
  const sector = this.id
  t3_draw_bars(sector);
  t3_draw_current_sector(sector);
}
