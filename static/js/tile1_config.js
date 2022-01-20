
const t1_temperature_colors = ["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"];

const t1_mode_width = 280;
const t1_mode_height = 24;

const t1_chart_offset = 20;
const t1_chart_unit_height = 44;
const t1_chart_unit_offset = 10;
const t1_chart_height = 242;
const t1_chart_xaxis_height = 50;
const t1_chart_axes_width = 60;
const t1_chart_total_height = t1_chart_offset + t1_chart_unit_height + t1_chart_unit_offset + t1_chart_height + t1_chart_xaxis_height;

const t1_icon_size = 24;
const t1_icon_vspace = 10;
const t1_icon_hspace = 30;
const t1_icon_width = (width - 2 * t1_icon_hspace) / 3;
const t1_icon_height = 26;
const t1_icon_text_height = 16;
const t1_icon_total_height = t1_icon_size + 2 * t1_icon_vspace + t1_icon_height + t1_icon_text_height;

const t1_temperature_offset = 40;
const t1_temperature_lrspace = 100;
const t1_temperature_text_height = 20;
const t1_temperature_vspace = 5;
const t1_temperature_size = (width - 2 * t1_temperature_lrspace) / t1_temperature_colors.length;
const t1_temperature_total_height = t1_temperature_offset + 2 * t1_temperature_text_height + 2 *  + t1_temperature_size + 2 * t1_temperature_vspace;

const t1_min_height = t1_chart_total_height + t1_icon_total_height + t1_temperature_total_height;
