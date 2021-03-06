
const num_tiles = 11;
// Historically, tile number equals position on dashboard - but meanwhile postion and tile number diverged.
// Neighbours: Position-Tile pairs
const neighbours = {
  1: 1,
  2: 10,
  3: 11,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  10: 8,
  11: 9,
}

const tiles_with_no_slider = [6, 8];
const slider_height = 120;

function get_tile_height(tile) {
  const tile_min_height = eval(`t${tile}_min_height`);
  const tile_position = Object.keys(neighbours).find(key => neighbours[key] === tile);
  const neighbour_position = tile_position & 1 ? parseInt(tile_position) + 1 : parseInt(tile_position) - 1;
  const neighbour_tile = neighbours[neighbour_position];
  try {
    neighbour_min_height = eval(`t${neighbour_tile}_min_height`);
  } catch(e) {
    return tile_min_height;
  }
  if (is_mobile || neighbour_position > num_tiles) {
    return tile_min_height;
  }
  let reduce_height = 0;
  if (tiles_with_no_slider.includes(tile) && !tiles_with_no_slider.includes(neighbour_tile)) {
    reduce_height = slider_height;
  }
  return Math.max(neighbour_min_height - reduce_height, tile_min_height)
}

const wwfColor = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  gray1: "rgb(96, 96, 96)",
  gray2: "rgb(90, 90, 90)",
  gray3: "rgb(221, 221, 221)",
  yellow: "rgb(243, 204, 0)",
  orange: "rgb(240, 124, 36)",
  red: "rgb(216, 45, 69)",
  redViolet: "rgb(166, 48, 102)",
  berry: "rgb(114, 66, 132)",
  darkBlue: "rgb(0, 99, 134)",
  mediumBlue: "rgb(112, 182, 214)",
  aqua: "rgb(0, 138, 136)",
  darkGreen: "rgb(19, 117, 52)",
  mediumGreen: "rgb(122, 182, 56)",
  olive: "rbg(128, 130, 33)",
  darkBrown: "rgb(108, 59, 36)",
  brown: "rgb(156, 106, 46)",
  base: "rgb(195, 183, 140)"
};

tickColor = "#E3E3E3";
tickStrokeWidth = 1;

const fontWeight = {
  thin: 300,
  normal: 400,
  semibold: 500,
  bold: 600
};

const fontSize = {
  xxsmall: "10px",
  xsmall: "12px",
  small: "14px",
  normal: "16px",
  large: "18px"
};

const letterSpacing = "0.3px";
const legendLeftPadding = 8;

// Width of one tile is representative for all tiles:
const width = find_tile().clientWidth;
const tile_breakpoint = 500;
const tile_breakpoint_xs = 400;
const is_mobile = width < tile_breakpoint;
const is_mobile_xs = width < tile_breakpoint_xs;

const margin = {top: 30, right: 50, bottom: 30, left: 50};
const chart_width = width - margin.left - margin.right;
const height = 766 - margin.top - margin.bottom;

const line_width = 3;
const dash_width = 1;
const dash_spacing = 2;
const chart_axis_stroke_width = 1;
const circle_width = 6;
const rect_round = 16;

const headers = [
  {
    title: ["CO2-Aussto?? versch??rft Klimakrise"],
    description: ["Mit den weltweit steigenden Emissionen steigen Jahr f??r", "Jahr auch die CO2-Konzentration in der Atmosph??re und die", "Temperatur auf der Erde."]
  },
  {
    title: ["Energieversorgung wird effizienter und", "erneuerbar"],
    description: ["Unser Energieverbrauch basiert immer noch weitgehend auf ??l,", "Gas und Kohle. Vor allem im W??rme- und Verkehrssektor ist der", "Anteil der Erneuerbaren Energien gering. Aber das ??ndert sich."]
  },
  {
    title: ["Klimaschutz in allen Sektoren"],
    description: ["Bis 2045 soll Deutschland klimaneutral sein.", "Daf??r muss der CO2-Aussto?? in allen Sektoren gesenkt werden."]
  },
  {
    title: ["Klimatechnologien sind im Kommen"],
    description: ["Strombasierte Technologien finden immer breitere", "Anwendung, egal ob beim Heizen, in der Mobilit??t oder", "als Speicherl??sungen."]
  },
  {
    title: ["Immer mehr Erneuerbare Energien"],
    description: ["Kohle, Gas, ??l und Atomenergie sind seit den 90er Jahren", "auf dem R??ckzug. Wind- und Solarkraftwerke gewinnen" ,"hingegen bei der Stromerzeugung an Bedeutung."]
  },
  {
    title: ["Der Strommix ver??ndert sich von Tag zu Tag"],
    description: ["Die Stromerzeugung schwankt je nach Wind,", "Sonnenschein und Stromverbrauch. Immer zur Mittagszeit", "gibt es am meisten PV. An Wochenenden brauchen wir", "weniger Strom."]
  },
  {
    title: ["Klimafreundliche Mobilit??t"],
    description: ["Eine kluge Verkehrswende ist auch Mobilit??tswende:", "Auf die bewusste Auswahl klimafreundlicher Verkehrsmittel", "kommt es an."]
  },
  {
    title: ["Elektrifizierung f??hrt zu steigendem", "Strombedarf"],
    description: ["F??r Elektroautos und strombasierte Heizungen brauchen wir ", "immer mehr Strom. Dies schaffen wir durch den beschleunigten ", "Ausbau von Wind- und Solarkraftwerken."]
  },
  {
    title: ["Zu viele fossile Heizungen"],
    description: ["Die W??rmewende gilt als der ???schlafender Riese??? f??r den", "Klimaschutz. Noch immer werden viele fossil befeuerte", "Heizungen verbaut. Dabei gibt es l??ngst klimafreundliche", "Alternativen zu ??l und Gas."]
  },
  {
    title: "Placeholder for tile 10, which is shared as GIF"
  },
  {
    title: ["Mit Erneuerbaren und", "Effizienz fossile", "Abh??ngigkeiten ersetzen"],
    description: ["Bei Erdgas, ??l und Steinkohle ist Deutschland ", "fast g??nzlich von Importen aus dem Ausland abh??ngig.", "Indem wir Erneuerbare Energien ausbauen und", "Energie einsparen, erh??hen wir die Energiesicherheit."]
  }
];

const header_margin = 20;
const header_title_height = 30;
const header_line_height = 24;
const has_header = "header" in initials;
const share_margin = has_header * 32;



function find_tile() {
  for (let i = 1; i <= num_tiles; i++) {
    let tile = document.getElementById("t" + i);
    if (tile) {return tile;}
  }
}


function share(tile, options) {
  const tile_svg = document.getElementById("t" + tile).firstChild;
  $.post(
    {
      url: "share/" + tile,
      data: {
        options: JSON.stringify(options),
      },
      dataType: "json",
      success: function(result){
        const download_link = document.getElementById("download");
        download_link.href = result.share_link;
        download_link.download = "wwf_share.png";
        download_link.click();
      }
    }
  );
}

var tiles = {};
for (let i = 1; i <= num_tiles; i++) {
  $.ajax(
    {
      url: "static/data/tile" + i + ".json",
      async: false,
      success: function(data) {
        tiles[i] = data;
      }
    }
  );
}

var icons = {};
for (let i = 0; i < icon_names.length; i++) {
  let name = icon_names[i];
  $.ajax(
    {
      url: "static/icons/" + name + ".svg",
      async: false,
      success: function(data) {
        icons[name] = data;
      }
    }
  );
}

for (let i = 0; i < flags.length; i++) {
  let name = flags[i];
  $.ajax(
    {
      url: "static/images/flags/" + name + ".svg",
      async: false,
      success: function(data) {
        icons[name] = data;
      }
    }
  );
}

$.ajax(
  {
    url: "static/images/agora_logo.svg",
    async: false,
    success: function(data) {
      icons["agora_logo"] = data;
    }
  }
);

$.ajax(
  {
    url: "static/logos/WWF_Logo.svg",
    async: false,
    success: function(data) {
      icons["wwf_logo"] = data;
    }
  }
);
const wwfLogo = {width: 32, height: 47};

function get_header_height(tile, with_subtitle=true) {
  if (!has_header) {return 0;}
  let height = headers[tile - 1].title.length * header_title_height + headers[tile - 1].description.length * header_line_height + 3 * header_margin;
  if (with_subtitle) {
    height += header_line_height + 2 * header_margin;
  }
  return height;
}

function draw_header(svg, tile, scenario) {
  if (!has_header) {return;}
  const header_height = get_header_height(tile, false);
  const header = svg.append("g")
    .attr("transform", `translate(${share_margin}, ${share_margin})`);

  header.append("rect")
    .attr("width", width)
    .attr("height", header_height)
    .attr("stroke", "black")
    .attr("fill", "white");

  $(header.node().appendChild(icons["wwf_logo"].documentElement.cloneNode(true)))
    .attr("x", width - header_margin - wwfLogo.width)
    .attr("y", header_margin)
    .attr("width", wwfLogo.width)
    .attr("height", wwfLogo.height)
    .attr("preserveAspectRatio", "xMidYMid slice");

  for (const [i, title] of headers[tile - 1].title.entries()) {
    header.append("text")
      .text(title)
      .attr("x", header_margin)
      .attr("y", header_margin + i * header_title_height)
      .attr("font-family", "WWF, sans-serif")
      .attr("font-size", 30)
      .attr("dominant-baseline", "hanging");
  }
  for (const [i, line] of headers[tile - 1].description.entries()) {
    header.append("text")
      .text(line)
      .attr("x", header_margin)
      .attr("y", headers[tile - 1].title.length * header_title_height + 2 * header_margin + i * header_line_height)
      .attr("font-family", "Open Sans, sans-serif")
      .attr("dominant-baseline", "hanging");
  }
  header.append("text")
    .text(scenario)
    .attr("x", width / 2)
    .attr("y", header_height + header_margin)
    .attr("font-family", "Open Sans, sans-serif")
    .attr("font-weight", fontWeight.bold)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging");
}
