
import json
import random
from cairosvg import svg2png
from flask import Flask, render_template, request

from settings import DEBUG
import tiles

app = Flask(__name__)


@app.route("/", methods=["GET"])
def dashboard():
    return render_template("index.html", debug=DEBUG)


@app.route("/<int:tile>", methods=["GET"])
def get_tile(tile):
    return render_template(
        "single_tile.html",
        tile_html=f"tiles/tile{tile}.html",
        tile_js=f"static/js/tile{tile}.js",
        debug=DEBUG
    )


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
