
const margin = {top: 30, right: 30, bottom: 70, left: 60};

const linewidth = 2;
const circlewidth = 6;
const rectround = 16;


function share(tile, options) {
  const tile_svg = document.getElementById(tile).firstChild;
  $.post(
    {
      url: "share/1",
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