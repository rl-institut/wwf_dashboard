const t11_header = ("year" in initials) ? initials.year : "";
const t11_header_height = get_header_height(11)

const t11_icon_offset = 40;
const t11_circle_size = 40;
const t11_circe_color_gray = "#ECECEC";
const t11_icon_size = 20;
const t11_icon_hspace = 6;
const t11_icon_vspace = 20;
const t11_icon_title_height = 22;
const t11_icon_total_height = t11_icon_offset + t11_circle_size + 2 * t11_icon_vspace + t11_icon_title_height;

const t11_chart_unit_height = 30;
const t11_chart_axes_width = 40;
const t11_chart_xaxis_height = 40;
const t11_chart_width = width - 2 * t11_chart_axes_width;
const t11_chart_height = 260;
const t11_chart_sector_space = 10;
const t11_chart_total_height = t11_chart_unit_height + t11_chart_height + t11_chart_xaxis_height;

const t11_bar_color_reduction = "#008A88";
const t11_bar_height = 40;
const t11_bar_title_height = 48;
const t11_bar_vspace = 15;
const t11_bar_legend_size = 16;
const t11_bar_total_height = t11_bar_title_height + 4 * t11_bar_vspace + t11_bar_height + t11_bar_legend_size;

const t11_min_height = t11_bar_total_height + t11_icon_total_height + t11_chart_total_height;
