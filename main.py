import asyncio
import nest_asyncio
import datetime as dt
import json
from flask import Flask, render_template, request
from flask_cors import CORS

import settings
from settings import DEBUG, ICONS, FLAGS, PASSWORD, VERSION
import scrape
import share

nest_asyncio.apply()

from logging.config import dictConfig

dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
            }
        },
        "handlers": {
            "wsgi": {
                "class": "logging.StreamHandler",
                "stream": "ext://flask.logging.wsgi_errors_stream",
                "formatter": "default",
            }
        },
        "root": {"level": "INFO", "handlers": ["wsgi"]},
    }
)

app = Flask(__name__)
CORS(app, origins=settings.CORS_ORIGINS)


@app.route("/", methods=["GET"])
def dashboard():
    return render_template(
        "index.html",
        icons=ICONS,
        flags=FLAGS,
        debug="true" if DEBUG else "false",
        password=PASSWORD,
        version=VERSION,
    )


@app.route("/<int:tile>", methods=["GET"])
def get_tile(tile):
    return render_template(
        "single_tile.html",
        tile_html=f"tiles/tile{tile}.html",
        tile_config_js=f"static/js/tile{tile}_config.js",
        tile_js=f"static/js/tile{tile}.js",
        initials=json.dumps(request.args),
        icons=ICONS,
        flags=FLAGS,
        debug="true" if DEBUG else "false",
        password=PASSWORD,
    )


@app.route("/agora", methods=["GET"])
def get_agora_data():
    date_str = request.args.get("date", default=dt.date.today().strftime("%d.%m.%Y"))
    date = dt.datetime.strptime(date_str, "%d.%m.%Y").date()
    agora_data, res_share = scrape.get_smard_data_for_day(date)
    if agora_data:
        return {"data": agora_data, "res_share": res_share}
    else:
        return {}, 503


@app.route("/share/<int:tile>", methods=["POST"])
async def share_tile(tile):
    options = json.loads(request.form["options"])
    options["header"] = "true"
    if tile == 10:
        return {"share_link": f"static/images/drought/{options['year']}_small.gif"}
    filename = asyncio.new_event_loop().run_until_complete(
        share.share_svg(tile, options, request)
    )
    return {"share_link": filename}

if DEBUG:
    @app.route("/iframe", methods=["GET"])
    def get_iframe():
        return render_template(
            "iframe.html",
            iframe_source=f"http://127.0.0.1:5000",
            debug="true" if DEBUG else "false",
        )

    @app.route("/iframe/<int:tile>", methods=["GET"])
    def get_iframe_tile(tile):
        return render_template(
            "iframe.html",
            iframe_source=f"http://127.0.0.1:5000/{tile}",
            debug="true" if DEBUG else "false",
        )


if __name__ == "__main__":
    app.run(debug=True, threaded=True, use_debugger=False, passthrough_errors=True)
