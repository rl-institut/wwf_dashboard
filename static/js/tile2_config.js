
const t2_bar_offset = 20;
const t2_bar_title_height = 20;
const t2_bar_title_padding_bottom = 24;
const t2_bar_height = 40;
const t2_bar_vspace = 10;
const t2_bar_ticks_height = 100;
const t2_bar_padding_bottom = 70;
const t2_bar_total_height = t2_bar_offset + t2_bar_title_height + 2 * t2_bar_vspace + t2_bar_ticks_height + t2_bar_padding_bottom ;

const t2_arrow_offset = 10;
const t2_arrow_width = 50;
const t2_arrow_height = 80;
const t2_arrow_text_height = 24;
const t2_arrow_total_height = t2_arrow_offset + t2_arrow_height;

const t2_pie_offset = 90;
const t2_pie_radius = 38;
const t2_pie_hspace = (width - 6 * t2_pie_radius) / 4;
const t2_pie_vspace = 10;
const t2_pie_icon_size = 20;
const t2_pie_legend_size = 12;
const t2_pie_legend_padding_top = 12;
const t2_pie_legend_hspace = 10;
const t2_pie_legend_width = width - 2 * (t2_pie_hspace + t2_pie_radius);
const t2_pie_total_height = t2_pie_offset + t2_pie_icon_size + 2 * t2_pie_vspace + 2 * t2_pie_radius + t2_pie_legend_padding_top + t2_pie_legend_size;

const t2_min_height = t2_bar_total_height + t2_arrow_total_height + t2_pie_total_height;
