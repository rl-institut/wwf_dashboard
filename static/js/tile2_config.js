const t2_header = ("year" in initials) ? initials.year : "";
const t2_header_height = get_header_height(2)

const t2_bar_offset = 20;
const t2_bar_title_height = 20;
const t2_bar_height = 20;
const t2_bar_vspace = 10;
const t2_bar_xaxis_height = 20;
const t2_bar_total_height = t2_bar_offset + t2_bar_title_height + t2_bar_height + t2_bar_vspace + t2_bar_xaxis_height;

const t2_icon_offset = 30;
const t2_icons_rect_height = 26;
const t2_icon_size = 16;
const t2_icon_vspace = 10;
const t2_icon_hspace = 14;
const t2_icon_text_height = 20;
const t2_icon_margin = 20;
const t2_icon_row_height = t2_icon_size + 2 * t2_icon_vspace + t2_icons_rect_height + t2_icon_text_height;
const t2_icon_total_height = t2_icon_offset + 2 * t2_icon_row_height + t2_icon_margin;

const t2_arrow_offset = 20;
const t2_arrow_width = 50;
const t2_arrow_height = 80;
const t2_arrow_text_height = 24;
const t2_arrow_total_height = t2_arrow_offset + t2_arrow_height;

const t2_pie_offset = 40;
const t2_pie_radius = 38;
const t2_pie_hspace = (width - 6 * t2_pie_radius) / 4;
const t2_pie_vspace = 10;
const t2_pie_icon_size = 20;
const t2_pie_legend_size = 12;
const t2_pie_legend_padding_top = 12;
const t2_pie_legend_hspace = 10;
const t2_pie_legend_width = width - 2 * (t2_pie_hspace + t2_pie_radius);
const t2_pie_legend_margin = 20;
const t2_pie_total_height = t2_pie_offset + t2_pie_icon_size + 2 * t2_pie_vspace + 2 * t2_pie_radius + t2_pie_legend_padding_top + t2_pie_legend_size + t2_pie_legend_margin;

const t2_min_height = t2_bar_total_height + t2_icon_total_height + t2_arrow_total_height + t2_pie_total_height;
