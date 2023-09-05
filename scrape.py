import calendar
import datetime as dt
import logging
import pathlib
import json
import js2xml
import requests
import pandas
import time
from collections import defaultdict

RAW_DATA_FOLDER = "agora_data"
AGORA_DATA_URL = "https://www.agora-energiewende.de/service/agorameter/chart/data/power_generation/{date}/{date}/today/chart.json"
SMARD_DATA_URL = "https://www.smard.de/app/chart_data/{technology_id}/DE/{technology_id}_DE_hour_{date}.json"

MAX_DATA_VALUE = 120000


def get_agora_data_for_day(date: dt.date) -> tuple[dict, float]:
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


def get_start_of_week(date: dt.date):
    start_of_week_day = date.day - date.weekday()
    year = date.year
    month = date.month
    if start_of_week_day < 1:
        month = month - 1
        if month < 1:
            month = 12
            year = year - 1
        start_of_week_day = calendar.monthrange(year, month)[1] + start_of_week_day
    return dt.date(year=year, month=month, day=start_of_week_day)


def get_smard_data_for_day(date: dt.date) -> tuple[dict, float]:
    """Return data and renewable share for given date"""
    technology_ids = {
        "wind_onshore": 4067,
        "pv": 4068,
        "lignite": 1223,
        "hard_coal": 4069,
        "gas": 4071,
        "fossils": 1227,
        "biomass": 4066,
        "hydro": 1226,
        "wind_offshore": 1225,
        "renewables": 1228,
        "pump_storages": 4070,
    }
    week_date = get_start_of_week(date)
    timestamp = time.mktime(
        dt.datetime(week_date.year, week_date.month, week_date.day).timetuple()
    )
    timestamp_formatted = str(int(timestamp)) + "000"

    week_day_index = 24 * date.weekday()

    data = defaultdict(list)
    for technology, technology_id in technology_ids.items():
        url = SMARD_DATA_URL.format(
            technology_id=technology_id, date=timestamp_formatted
        )
        response = requests.get(url)
        if response.status_code != 200:
            logging.error(f"Could not scrape SMARD data for {url=}. Status code {response.status_code}, reason: {response.reason}, details: {response.text}")
            raise ValueError(f"No SMARD data for {technology=}")
        technology_data = response.json()
        for i in range(week_day_index, week_day_index + 24):
            value = technology_data["series"][i][1]
            if value is None:
                break
            data[technology].append(value)

    production = {
        "pv": data["pv"],
        "wind_onshore": data["wind_onshore"],
        "fossil": [
            sum(z)
            for z in zip(*[data[i] for i in ("lignite", "hard_coal", "gas", "fossils")])
        ],
        "renewables": [
            sum(z)
            for z in zip(
                *[
                    data[i]
                    for i in (
                        "biomass",
                        "hydro",
                        "wind_offshore",
                        "renewables",
                        "pump_storages",
                    )
                ]
            )
        ],
    }
    min_series_length = min(len(series) for series in production.values())
    result_data = []
    for i in range(min_series_length):
        hourly_data = {key: value[i] * 1e-3 for key, value in production.items()}
        hourly_data["index"] = i
        result_data.append(hourly_data)

    renewables_sum = sum(
        sum(production[tech]) for tech in ("pv", "wind_onshore", "renewables")
    )
    share = renewables_sum / (renewables_sum + sum(production["fossil"])) * 100

    return result_data, share
