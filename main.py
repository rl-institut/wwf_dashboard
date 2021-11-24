
import random
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def dashboard():
    data = [
        {
            "year": year,
            "ppm": random.randint(80, 100) / 100 * (year - 1900),
            "co2": 20 + random.randint(80, 100) / 100 * (year - 1900) / 10,
            "temperature": random.randint(0, 15)
        }
        for year in range(1900, 2022)
    ]
    return render_template("index.html", data=data)


if __name__ == "__main__":
    app.run(
        debug=True, use_debugger=False, use_reloader=True, passthrough_errors=True
    )
