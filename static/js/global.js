
const wwfHeaderHeight = 90;
const tileMinHeight = 800;
let iFrameHeight;

const has_header = "header" in initials;

document.addEventListener("iFrameSetupComplete", function (e) {
  if (debug) {
    console.log("Setup GLOBAL");
  }

  iFrameHeight = wwfParentHeight - wwfHeaderHeight;
  if (debug) {
    console.log("iFrameHeight =", iFrameHeight);
  }

  const globalCompleteEvent = new Event("globalSetupComplete");
  document.dispatchEvent(globalCompleteEvent);
});

function get_tile_height(tile) {
  if (has_header) {return 600;}
  const header_height = find_tile(tile).parentNode.parentNode.getElementsByClassName("tile__header")[0].clientHeight;
  const tileHeight = iFrameHeight - header_height;
  if (debug) {console.log(`Tile #${tile} Original Height =`, tileHeight);}
  const tileHeightActual = Math.max(tileHeight, tileMinHeight - header_height - wwfHeaderHeight);
  if (debug) {console.log(`Tile #${tile} Actual Height =`, tileHeightActual);}
  return tileHeightActual;
}

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
};

function find_tile(tile=null) {
  return document.getElementById("t" + tile);
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
const width = document.getElementsByClassName("tile")[0].getElementsByClassName("tile__chart")[0].clientWidth;
const tile_breakpoint = 500;
const tile_breakpoint_xs = 400;
const is_mobile = width < tile_breakpoint;
if (debug) {console.log("Mobile = ", is_mobile);}
const is_mobile_xs = width < tile_breakpoint_xs;

const margin = {top: 30, right: 50, bottom: 30, left: 50};
const chart_width = width - margin.left - margin.right;
const height = 766 - margin.top - margin.bottom;

const line_width = 3;
const dash_width = 1;
const dash_spacing = 2;
const chart_axis_stroke_width = 1;
const circle_width = 6;

const headers = [
  {
    title: ["CO2-Ausstoß verschärft", "Erderhitzung"],
    description: ["Mit den von uns Menschen verursachten Emissionen steigt", "Jahr für Jahr auch die CO2-Konzentration in der Atmosphäre", "und die Temperatur auf der Erde."]
  },
  {
    title: ["Wo bleiben die Wärme-", "und Mobilitätswende?"],
    description: ["Die Energiewende beim Strom ist ein Erfolg. Unser gesamter", "Energieverbrauch basiert aber immer noch auf Öl, Gas und", "Kohle. Vor allem im Wärme- und Verkehrssektor ist der", "Anteil der Erneuerbaren Energien gering."]
  },
  {
    title: ["Klimaschutz muss es in ", "allen Sektoren geben"],
    description: ["Bis 2045 soll Deutschland klimaneutral sein. Dafür muss", "der CO2-Ausstoß in allen Sektoren gesenkt werden. Das", "muss auch in Zukunft das Ziel sein und verbindlich", "erreicht werden."]
  },
  {
    title: ["Klimatechnologien wachsen", "exponentiell"],
    description: ["Strombasierte Technologien finden immer breitere", "Anwendung, egal ob beim Heizen, in der Mobilität oder", "als Speicherlösungen. Dieser Hochlauf revolutioniert unser", "Energiesystem – im Sinne des Klimaschutzes."]
  },
  {
    title: ["Immer mehr Erneuerbare", "Energien"],
    description: ["Kohle, Gas, Öl und Atomenergie sind seit den 90er Jahren", "auf dem Rückzug. Wind- und Solarkraftwerke setzen sich" ,"hingegen bei der Stromerzeugung an die Spitze. Inzwischen", "häufen sich die Tage, an denen wir uns hauptsächlich", "erneuerbar versorgen."]
  },
  {
    title: ["Der Strommix verändert", "sich von Tag zu Tag"],
    description: ["Die Stromerzeugung schwankt je nach Wind, Sonnenschein", "und Stromverbrauch. Immer zur Mittagszeit gibt es am", "meisten PV. An Wochenenden brauchen wir weniger Strom."]
  },
  {
    title: ["Klimafreundlich mobil sein"],
    description: ["Eine kluge Verkehrswende ist auch eine Mobilitätswende:", " Auf die bewusste Auswahl klimafreundlicher Verkehrsmittel", "kommt es an. Die Politik muss für entsprechende Angebote", "sorgen."]
  },
  {
    title: ["Elektrifizierung führt zu", "steigendem Strombedarf"],
    description: ["Für Elektroautos und strombasierte Heizungen brauchen wir", "immer mehr Strom. Dies schaffen wir durch den", "beschleunigten Ausbau von Wind- und Solarkraftwerken."]
  },
  {
    title: ["Zu viele fossile Heizungen"],
    description: ["Die Wärmewende ist notwendig. Das zeigt ein Blick auf", "die Fakten. Immer noch boomen fossil befeuerte Heizungen,", "obwohl es längst tatsächlich klimafreundliche Alternativen", "gibt."]
  },
  {
    title: "Placeholder for tile 10, which is shared as GIF"
  },
  {
    title: ["Erneuerbare und Effizienz befreien uns von", "fossilen Abhängigkeiten"],
    description: ["Der Krieg in der Ukraine sowie die Energiekrise von 2022", "haben gezeigt: Deutschlands Abhängigkeit von fossilen", "Importen ist eine Gefahr für unsere Gesellschaft. Indem wir", "Erneuerbare Energien ausbauen und Energie einsparen,", "erhöhen wir die Energiesicherheit."]
  }
];

const header_margin = 20;
const header_title_height = 30;
const header_line_height = 24;
const share_margin = has_header * 32;


function share(tile, options) {
  $.post(
      {
        url: "share/" + tile,
        data: {
          options: JSON.stringify(options),
        },
        dataType: "json",
        success: function (result) {
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
        success: function (data) {
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
        success: function (data) {
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
        success: function (data) {
          icons[name] = data;
        }
      }
  );
}

$.ajax(
    {
      url: "static/images/agora_logo.svg",
      async: false,
      success: function (data) {
        icons.agora_logo = data;
      }
    }
);

$.ajax(
    {
      url: "static/logos/WWF_Logo.svg",
      async: false,
      success: function (data) {
        icons.wwf_logo = data;
      }
    }
);
const wwfLogo = {width: 32, height: 47};

function get_header_height(tile, with_subtitle = true) {
  if (!has_header) {
    return 0;
  }
  let height = headers[tile - 1].title.length * header_title_height + headers[tile - 1].description.length * header_line_height + 3 * header_margin;
  if (with_subtitle) {
    height += header_line_height + 2 * header_margin;
  }
  return height;
}

function draw_header(svg, tile, scenario) {
  if (!has_header) {
    return;
  }
  const header_height = get_header_height(tile, false);
  const header = svg.append("g")
      .attr("transform", `translate(${share_margin}, ${share_margin})`);

  header.append("rect")
      .attr("width", width)
      .attr("height", header_height)
      .attr("stroke", "black")
      .attr("fill", "white");

  $(header.node().appendChild(icons.wwf_logo.documentElement.cloneNode(true)))
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
