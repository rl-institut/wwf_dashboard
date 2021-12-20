
import datetime as dt
import pathlib
import json
import js2xml
import requests
import pandas
from matplotlib import pyplot

RAW_DATA_FOLDER = "raw_data"
AGORA_DATA_FILENAME = "agora_data.json"
AGORA_DATA_URL = "https://www.agora-energiewende.de/service/agorameter/chart/data/power_generation/{from_date}/{to_date}/today/chart.json"


def _get_agora_data_for_day(date: dt.date):
    path = pathlib.Path(RAW_DATA_FOLDER) / AGORA_DATA_FILENAME
    if path.exists():
        with open(path, "r") as jsonfile:
            data_raw = json.load(jsonfile)
    else:
        print("Loading Agora URL...")
        url = AGORA_DATA_URL.format(
            from_date=date.strftime("%d.%m.%Y"),
            to_date=(date + dt.timedelta(days=1)).strftime("%d.%m.%Y")
        )
        response = requests.get(url)
        with open(path, "w") as jsonfile:
            jsonfile.write(response.content.decode("utf-8"))
        data_raw = json.loads(response.content)

    parsed = js2xml.parse(data_raw["js"])
    data = [(d, d.xpath(".//array/number/@value")) for d in parsed.xpath("//property[@name='data']")]
    df = pandas.DataFrame.from_records(
        [[float(value) for i, value in enumerate(d[1]) if i % 2] for d in data[:-1]]
    )
    df = df.transpose()
    df.columns = ["pv", "wind_onshore", "wind_offshore", "hydro", "biomass", "pump", "gas", "hard_coal", "lignite", "nuclear", "other", "power", "fossil", "co2_t", "co2_gkWh"]
    return df


agora = _get_agora_data_for_day(dt.date.today())
agora.plot()
pyplot.show()
