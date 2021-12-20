
import os
import pandas

FILENAME = "20211126-WWF_Daten_Dashboard_Version 2.6.xlsx"

DATA_PATH = "static/data"
RAW_DATA_PATH = "raw_data"


def tile1():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
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


def tile2():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="02 Primärenergieverbrauch (2)",
        header=6,
        usecols=[3, 4, 5, 6, 7, 8, 9, 12, 14],
        nrows=31,
    )
    data.columns = ["year", "coal1", "coal2", "oil", "gas1", "gas2", "renewables", "nuclear", "savings"]
    data["coal"] = data["coal1"] + data["coal2"]
    data["gas"] = data["gas1"] + data["gas2"]
    data = data[["year", "coal", "oil", "gas", "renewables", "nuclear", "savings"]]

    traffic = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="02 Primärenergieverbrauch (2)",
        header=6,
        usecols=[16, 17, 18],
        nrows=31,
    )
    data["traffic"] = traffic["Erneuerbar"]

    power = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="02 Primärenergieverbrauch (2)",
        header=6,
        usecols=[22, 23, 24],
        nrows=31,
    )
    data["power"] = power["Erneuerbar.1"]

    heat = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="02 Primärenergieverbrauch (2)",
        header=6,
        usecols=[28, 29, 30],
        nrows=31,
    )
    data["heat"] = heat["Erneuerbar.2"]

    data.to_json(os.path.join(DATA_PATH, "tile2.json"), orient="records")


def tile3():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="03 Sektorziele CO2-Neutralität",
        header=11,
        usecols=range(8, 16),
        nrows=11,
    )
    data.columns = ["year", "energy", "industry", "house", "agriculture", "traffic", "waste", "total"]
    data = data.interpolate()
    data.to_json(os.path.join(DATA_PATH, "tile3.json"), orient="records")


def tile4():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="04 Klimatechnologien",
        header=6,
        usecols=[3, 4, 5, 6, 7],
        nrows=21,
    )
    data.columns = ["year", "ecars", "charging", "storages", "heatpumps"]
    data.to_json(os.path.join(DATA_PATH, "tile4.json"), orient="records")


def tile5():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="05 Immer mehr EE",
        header=9,
        usecols=[1, 2, 3, 12, 14, 16, 17, 18],
        nrows=31,
        index_col=0
    )
    data = data.applymap(lambda x: None if x == "k.A." else x)
    data = data.interpolate(limit_direction="both")
    data = data.divide(data["Bruttostromerzeugung gesamt"], axis="index") * 100
    data = data.reset_index()
    data.columns = ["year", "total", "fossil", "wind_onshore", "wind_offshore", "hydro", "biomass", "pv"]
    data.iloc[30, 0] = 2020
    data.to_json(os.path.join(DATA_PATH, "tile5.json"), orient="records")


tile5()
