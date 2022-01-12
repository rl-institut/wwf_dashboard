
import datetime as dt
import json
from cairosvg import svg2png
from flask import Flask, render_template, request

from settings import DEBUG, ICONS
import tiles
import scrape

app = Flask(__name__)


@app.route("/", methods=["GET"])
def dashboard():
    return render_template("index.html", icons=ICONS, debug=DEBUG)


@app.route("/<int:tile>", methods=["GET"])
def get_tile(tile):
    return render_template(
        "single_tile.html",
        tile_html=f"tiles/tile{tile}.html",
        tile_config_js=f"static/js/tile{tile}_config.js",
        tile_js=f"static/js/tile{tile}.js",
        icons=ICONS,
        debug=DEBUG
    )


@app.route("/agora", methods=["GET"])
def get_agora_data():
    date_str = request.args.get('date', default=dt.date.today().strftime("%d.%m.%Y"))
    date = dt.datetime.strptime(date_str, "%d.%m.%Y").date()
    agora_data, res_share = scrape.get_agora_data_for_day(date)
    return {"data": agora_data, "res_share": res_share}


@app.route("/share/<int:tile>", methods=["POST"])
async def share(tile):
    svg = request.form["svg"]
    options = json.loads(request.form["options"])
    filename = tiles.get_tile_filename(tile, options)
    svg2png(bytestring=svg, write_to=f"static/share/{filename}")
    return {"share_link": filename}


if __name__ == "__main__":
    app.run(
        debug=True, threaded=True, use_debugger=False, use_reloader=True, passthrough_errors=True
    )
