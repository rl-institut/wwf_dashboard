document.addEventListener("globalSetupComplete", function (e) {
  if (debug) {
    console.log("Setup tile #10");
  }

  const t10_drought_height = width * 1.5;
  const t10_min_height = t10_drought_height;

  const years = tiles[10].map(function (d) {
    return d.year;
  });

  $("#t10_year").ionRangeSlider({
    grid: true,
    prettify_enabled: false,
    skin: "round",
    hide_min_max: true,
    values: years,
    from: years[years.length - 1],
    onChange: function (data) {
      t10_change_year(data.from)
    }
  });

  const t10_height = get_tile_height(10);

  const drought = document.getElementById("drought");
  drought.width = width;
  drought.height = t10_drought_height;


  function t10_change_year(to_year) {
    const year = years[to_year];
    drought.src = "static/images/drought/" + year + ".gif";
  }

  t10_change_year(6);

});
