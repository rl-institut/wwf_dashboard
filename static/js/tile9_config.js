const t9_header = "";
const t9_header_height = get_header_height(9, false)

const t9_emissions_color = "black";
const t9_bar_ticks_width = width / 2.5;
const t9_bar_width = width - t9_bar_ticks_width;
const t9_bar_height = 180;
const t9_bar_title_height = 30;
const t9_bar_offset = 50;
const t9_bar_hspace = 5;
const t9_bar_gap = 12;
const t9_solar_text_offset = -9;
const t9_bar_total_height = t9_bar_offset + t9_bar_title_height + t9_bar_height;

const t9_icon_offset = 40;
const t9_circle_size = 40;
const t9_circe_color_gray = "#ECECEC";
const t9_icon_size = 20;
const t9_icon_hspace = 6;
const t9_icon_vspace = 20;
const t9_icon_title_height = 22;
const t9_icon_total_height = t9_icon_offset + t9_circle_size + 2 * t9_icon_vspace + t9_icon_title_height;

const t9_chart_unit_height = 22;
const t9_chart_axes_width = 20;
const t9_chart_yaxis_width = 33;
const t9_chart_xaxis_height = 20;
const t9_chart_width = width - 2 * t9_chart_axes_width;
const t9_chart_height = 260;
const t9_chart_total_height = t9_chart_unit_height + t9_chart_height + t9_chart_xaxis_height;

const t9_min_height = t9_bar_total_height + t9_icon_total_height + t9_chart_total_height;
