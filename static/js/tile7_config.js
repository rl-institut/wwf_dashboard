const t7_header = ("distance" in initials) ? initials.distance + " km" : "";
const t7_header_height = get_header_height(7);

const t7_route_offset = 30;
const t7_route_upper_padding = 16;
const t7_route_space = 7;
const t7_route_height = 40;
const t7_route_text_space = 15;

const t7_route_total_height = t7_route_offset + t7_route_space + t7_route_height + t7_route_upper_padding * 2;

const t7_unit_height = 60;
const t7_chart_hoffset = 10;
const t7_chart_width = width - 2 * t7_chart_hoffset;
const t7_chart_height = 230;
const t7_bar_gap = 30;
const t7_bar_text_space = 8;
const t7_icon_size = 21;
const t7_icon_space = 10;
const t7_legend_height = 110;

const t7_chart_total_height = t7_unit_height + t7_chart_height + t7_icon_size + 2 * t7_icon_space + t7_legend_height;

const t7_min_height = t7_route_total_height + t7_chart_total_height;
