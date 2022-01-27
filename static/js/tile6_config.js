const t6_header = ("date" in initials) ? initials.date : "";
const t6_header_height = get_header_height(6);

const t6_pie_offset = 10;
const t6_pie_radius = 38;
const t6_pie_text_width = 0;
const t6_pie_text_height = 20;
const t6_pie_hspace = 10;
const t6_pie_vspace = 10;
const t6_pie_legend_width = 200;
const t6_pie_legend_x = chart_width / 2 - t6_pie_legend_width / 2;
const t6_pie_legend_y = t6_pie_offset + 2 * t6_pie_radius + t6_pie_vspace;
const t6_pie_legend_rect = 12;
const t6_pie_total_height = t6_pie_offset + 2 * t6_pie_radius + t6_pie_vspace + t6_pie_legend_rect;

const t6_chart_offset = 60;
const t6_chart_title_height = 30;
const t6_chart_height = 230;
const t6_chart_yaxis_width = 60;
const t6_chart_total_height = t6_chart_offset + t6_chart_title_height + t6_chart_height;

const t6_icon_offset = 40;
const t6_icon_size = 24;
const t6_icon_margin = 4;
const t6_icon_padding = 8;
const t6_icon_row_height = 10;
const t6_icon_wrap = (is_mobile) ? 1 : 2
const t6_icon_total_height = t6_icon_offset + (4 / t6_icon_wrap) * t6_icon_size + (4 / t6_icon_wrap - 1) * t6_icon_row_height;

const t6_bottom_offset = 20;

const t6_min_height = t6_pie_total_height + t6_chart_total_height + t6_icon_total_height + t6_bottom_offset;
