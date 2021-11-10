
import random
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def dashboard():
    data = [{"year": year, "value": random.randint(80, 100) / 100 * (year - 1900)} for year in range(1900, 2022)]
    temperatures = [random.randint(0, 15) for _ in range(1900, 2022)]
    return render_template("index.html", data=data, temperatures=temperatures)


if __name__ == "__main__":
    app.run(
        debug=True, use_debugger=False, use_reloader=True, passthrough_errors=True
    )
