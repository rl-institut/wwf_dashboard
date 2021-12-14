
import os
import pandas

DATA_PATH = "static/data"
RAW_DATA_PATH = "raw_data"


def tile_1():
    filename = "WWF_Daten_Dashboard_Version 2.2.xlsx"

    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, filename),
        sheet_name="01 CO2 Konzentration",
        header=5,
        usecols=[2, 3, 4, 5, 7],
        nrows=51,
    )
    data = data.applymap(lambda x: x.replace("\xa0", "") if isinstance(x, str) else x)
    data.columns = ["year", "co2", "ppm", "temperature", "de_temperature"]
    data = data.astype({"year": int, "co2": float, "ppm": float, "temperature": float, "de_temperature": float})
    data = data.sort_values("year")
    data.to_json(os.path.join(DATA_PATH, "tile1.json"), orient="records")

tile_1()
