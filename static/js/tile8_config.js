const t8_header = ("year" in initials) ? initials.year : "";
const t8_header_height = get_header_height(8)

const t8_bar_height = 52;
const t8_bar_title_height = 20;
const t8_bar_vspace = 15;
const t8_bar_total_height = t8_bar_title_height + 4 * t8_bar_vspace + t8_bar_height;

const t8_icon_size = 22;
const t8_icon_hspace = 6;

const t8_chart_unit_height = 30;
const t8_chart_primary_power_offset = 5;
const t8_chart_axes_width = 60;
const t8_chart_xaxis_height = 40;
const t8_chart_width = width - 2 * t8_chart_axes_width;
const t8_chart_height = 260;
const t8_chart_offset = 60;
const t8_chart_total_height = t8_chart_offset + t8_chart_height + t8_chart_xaxis_height;

const t8_min_height = t8_bar_total_height + t8_chart_total_height;
