
const t5_chart_yaxis_width = 30;
const t5_chart_xaxis_height = 30;
const t5_chart_width = width - t5_chart_yaxis_width;
const t5_chart_height = 230;
const t5_chart_total_height = t5_chart_height + t5_chart_xaxis_height;


const t5_icon_offset = 30;
const t5_icon_width = 90;
const t5_icon_height = 26;
const t5_icon_size = 20;
const t5_icon_hspace = (width - 3 * t5_icon_width) / 4;
const t5_icon_vspace = 10;
const t5_icon_text_height = 30;
const t5_icon_wrap_height = 20;
const t5_icon_row_height = t5_icon_size + 2 * t5_icon_vspace + t5_icon_height + t5_icon_text_height;
const t5_icon_total_height = t5_icon_offset + 2 * t5_icon_row_height + t5_icon_wrap_height;

const t5_min_height = t5_chart_total_height + t5_icon_total_height;
