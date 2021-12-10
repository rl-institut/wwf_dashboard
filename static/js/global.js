
function share(tile) {
  const tile_svg = document.getElementById(tile);
  $.post(
    {
      url: "share/1",
      data: {"svg": tile_svg.outerHTML},
      dataType: "json",
      success: function(result){
        alert(result.share_link);
      }
    }
  );
}