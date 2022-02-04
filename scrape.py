import datetime as dt
import pathlib
import json
import js2xml
import requests
import pandas

RAW_DATA_FOLDER = "agora_data"
AGORA_DATA_URL = "https://www.agora-energiewende.de/service/agorameter/chart/data/power_generation/{date}/{date}/today/chart.json"

MAX_DATA_VALUE = 120000


def get_agora_data_for_day(date: dt.date):
    if date == dt.date.today():
        suffix = f"{date.isoformat()}_{dt.datetime.now().hour}.json"
    else:
        suffix = f"{date.isoformat()}.json"
    ts_filename = f"ts_{suffix}"
    share_filename = f"share_{suffix}"
    if (pathlib.Path(RAW_DATA_FOLDER) / ts_filename).exists():
        with open(pathlib.Path(RAW_DATA_FOLDER) / ts_filename, "r") as jsonfile:
            ts = json.load(jsonfile)
        with open(pathlib.Path(RAW_DATA_FOLDER) / share_filename, "r") as jsonfile:
            share = json.load(jsonfile)
        return ts, share["renewable_share"]

    print("Loading Agora URL...")
    url = AGORA_DATA_URL.format(
        date=date.strftime("%d.%m.%Y"),
    )
    response = requests.get(url)

    try:
        data_raw = json.loads(response.content)

        parsed = js2xml.parse(data_raw["js"])
        data = [
            (d, d.xpath(".//array/number/@value"))
            for d in parsed.xpath("//property[@name='data']")
        ]
        df = pandas.DataFrame.from_records(
            [[float(value) for i, value in enumerate(d[1]) if i % 2] for d in data[:-1]]
        )
        df = df.transpose()
        if df.max().max() > MAX_DATA_VALUE:
            raise ValueError
        columns = [
            "pv",
            "wind_onshore",
            "wind_offshore",
            "hydro",
            "biomass",
            "pump",
            "gas",
            "hard_coal",
            "lignite",
            "nuclear",
            "other",
            "power",
            "fossil",
            "co2_t",
            "co2_gkWh",
        ]
        # Agora data sometimes does not include c02_gkWh
        df.columns = columns if len(df.columns) == 15 else columns[:-1]
        df["renewables"] = df[["wind_offshore", "hydro", "biomass", "pump"]].sum(axis=1)
        df = df / 1000
        df = df[["wind_onshore", "pv", "fossil", "renewables"]].reset_index()
        df.to_json(pathlib.Path(RAW_DATA_FOLDER) / ts_filename, orient="records")
        share = {"renewable_share": (1 - df["fossil"].sum() / df.sum().sum()) * 100}
        with open(pathlib.Path(RAW_DATA_FOLDER) / share_filename, "w") as jsonfile:
            json.dump(share, jsonfile)
        return df.to_dict(orient="records"), share["renewable_share"]
    except:
        return None, None
