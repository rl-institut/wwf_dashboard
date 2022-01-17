const wwfColor = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  gray1: "rgb(96, 96, 96)",
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

const fontWeight = {
  thin: 300,
  normal: 400,
  semibold: 500,
  bold: 600
}

const fontSize = {
  xsmall: "12px",
  small: "14px",
  normal: "16px",
  large: "18px"
}

const letterSpacing = "0.3px";
const legendLeftPadding = 8;

// Width of one tile is representative for all tiles:
const width = find_tile().clientWidth;
const tile_breakpoint = 500;
const is_mobile = width < tile_breakpoint;

const margin = {top: 30, right: 50, bottom: 30, left: 50};
const chart_width = width - margin.left - margin.right;
const height = 766 - margin.top - margin.bottom;

const line_width = 3;
const chart_axis_stroke_width = 2;
const circle_width = 6;
const rect_round = 16;


function find_tile() {
  for (let i = 1; i <= 10; i++) {
    let tile = document.getElementById("t" + i);
    if (tile) {return tile}
  }
}


function share(tile, options) {
  const tile_svg = document.getElementById("t" + tile).firstChild;
  $.post(
    {
      url: "share/" + tile,
      data: {
        svg: tile_svg.outerHTML,
        options: JSON.stringify(options),
      },
      dataType: "json",
      success: function(result){
        alert(result.share_link);
      }
    }
  );
}

var tiles = {};
for (let i = 1; i <= 10; i++) {
  $.ajax(
    {
      url: "static/data/tile" + i + ".json",
      async: false,
      success: function(data) {
        tiles[i] = data;
      }
    }
  )
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
  )
}

$.ajax(
    {
      url: "static/images/agora_logo.svg",
      async: false,
      success: function(data) {
        icons["agora_logo"] = data;
      }
    }
  )

// Embed icons via:
// svg.node().appendChild(icons["i_bus"].documentElement)
