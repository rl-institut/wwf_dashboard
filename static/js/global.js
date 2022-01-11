
const cgreen = "rgb(122 182 56)";

// Width of one tile is representative for all tiles:
const width = find_tile().clientWidth;
const margin = {top: 30, right: 50, bottom: 30, left: 50};
const chart_width = width - margin.left - margin.right;
const height = 766 - margin.top - margin.bottom;
const tile_breakpoint = 500;

const line_width = 3;
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

const icon_names = ["i_bus", "i_fussgaenger", "i_e_auto_normal", "i_bahn", "i_fernbus", "i_verkehr", "i_flugzeug"];
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
