const t4_header = ("year" in initials) ? initials.year : "";
const t4_header_height = get_header_height(4)

const t4_icon_offset = 10;
const t4_icon_title_height = 20;
const t4_icon_vspace = 10;
const t4_icon_size = 30;
const t4_icon_width = 75;
const t4_icon_hspace = (width - 2 * t4_icon_width) / 3;
const t4_icon_height = 30;
const t4_icon_wrap_height = 20;

const t4_icon_total_height = t4_icon_offset + 3 * t4_icon_title_height + 5 * t4_icon_vspace + 2 * t4_icon_size + 2 * t4_icon_height + t4_icon_wrap_height;

const t4_chart_offset = 30;
const t4_chart_unit_height = 40;
const t4_chart_unit_vspace = 10;
const t4_chart_height = 270;
const t4_chart_yaxis_width = 45;
const t4_chart_xaxis_height = 40;
const t4_chart_width = width - 2 * t4_chart_yaxis_width;
const t4_chart_total_height = t4_chart_offset + t4_chart_unit_height + t4_chart_unit_vspace + t4_chart_height + t4_chart_xaxis_height;

const t4_min_height = t4_icon_total_height + t4_chart_total_height;
