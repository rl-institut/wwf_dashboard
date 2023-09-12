document.addEventListener("globalSetupComplete", function (e) {
  if (debug) {
    console.log("Setup tile #10");
  }

  const t10_drought_height = get_tile_height(10);
  if (debug) {console.log("#10 height = ", t10_drought_height);}
  const t10_device = is_mobile ? "small" : t10_drought_height < 500 ? "wide" : "small";
  if (debug) {console.log("#10 device = ", t10_device);}

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
      t10_change_year(data.from);
    }
  });

  const t10_ratio = t10_device === "small" ? 1.5 : 0.86;

  const drought = document.getElementById("drought");
  drought.width = Math.min(t10_drought_height / t10_ratio, width);
  drought.height = Math.min(drought.width * t10_ratio, t10_drought_height);


  function t10_change_year(to_year) {
    const year = years[to_year];
    drought.src = "static/images/drought/" + year + "_" + t10_device + ".gif";
  }

  t10_change_year(6);

});
