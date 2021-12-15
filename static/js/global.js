
const margin = {top: 30, right: 50, bottom: 70, left: 50};
const width = $("#t1").width() - margin.left - margin.right;
const height = Math.min($(window).height(), 766) - margin.top - margin.bottom;

const linewidth = 2;
const circlewidth = 6;
const rectround = 16;


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