import datetime as dt
import pathlib
import json
import js2xml
import requests
import pandas

RAW_DATA_FOLDER = "agora_data"
AGORA_DATA_URL = "https://www.agora-energiewende.de/service/agorameter/chart/data/power_generation/{date}/{date}/today/chart.json"


def get_agora_data_for_day(date: dt.date):
    if date == dt.date.today():
        filename = f"{date.isoformat()}_{dt.datetime.now().hour}.json"
    else:
        filename = f"{date.isoformat()}.json"
    path = pathlib.Path(RAW_DATA_FOLDER) / filename
    if path.exists():
        with open(path, "r") as jsonfile:
            return json.load(jsonfile)

    print("Loading Agora URL...")
    url = AGORA_DATA_URL.format(
        date=date.strftime("%d.%m.%Y"),
    )
    response = requests.get(url)
    with open(path, "w") as jsonfile:
        jsonfile.write(response.content.decode("utf-8"))
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
    df = df[["wind_onshore", "pv", "fossil", "renewables"]].reset_index()
    df.to_json(path, orient="records")
    return df.to_dict(orient="records")
