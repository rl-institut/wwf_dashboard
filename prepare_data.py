
import os
import json
import pandas
import pathlib
from PIL import Image, ImageDraw, ImageFont

FILENAME = "WWF_Daten_Dashboard_Version 3.5.xlsx"

DATA_PATH = "static/data"
RAW_DATA_PATH = "raw_data"
DROUGHT_DATA = "static/images/drought"


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
    emissions = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="03 Sektorziele CO2-Neutralität",
        header=11,
        usecols=range(4, 7),
        nrows=7,
    )
    emissions.columns = ["year", "reduction_percent", "emissions"]
    emissions = emissions.fillna(0)
    sectors = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="03 Sektorziele CO2-Neutralität",
        header=11,
        usecols=range(8, 16),
        nrows=11,
    )
    sectors.columns = ["year", "energy", "industry", "house", "agriculture", "traffic", "waste", "total"]
    sectors = sectors.interpolate()
    data = {"emissions": emissions.to_dict(orient="records"), "sectors": sectors.to_dict(orient="records")}
    with open(os.path.join(DATA_PATH, "tile3.json"), "w") as json_file:
        json.dump(data, json_file)


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


def tile7():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="07 Emissionen nach Personen-km",
        header=8,
        usecols=[2, 3, 5],
        nrows=30,
    )
    data.columns = ["vehicle", "emission", "type"]
    data = data.fillna(method='ffill')
    data.to_json(os.path.join(DATA_PATH, "tile7.json"), orient="records")


def tile8():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="08 Steigender Strombedarf",
        header=9,
        usecols=range(2, 8),
        nrows=11,
    )
    data.columns = ["year", "primary", "power", "pv", "wind_onshore", "wind_offshore"]
    data = data.interpolate()
    data["wind"] = data["wind_onshore"] + data["wind_offshore"]
    data[["year", "primary", "power", "pv", "wind"]].to_json(os.path.join(DATA_PATH, "tile8.json"), orient="records")


def tile9():
    installations = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="09 Gebäudewärme",
        header=7,
        usecols=range(3, 9),
        nrows=11,
    )
    installations.columns = ["year", "biomass", "heatpump", "gas", "oil", "solar"]
    emissions = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="09 Gebäudewärme",
        header=7,
        usecols=range(12, 19),
        nrows=1,
    )
    emissions.columns = ["biomass", "heatpump", "gas", "oil", "solar"]
    data = {
        "installations": installations.to_dict(orient="records"),
        "emissions": emissions.iloc[0].to_dict()
    }
    with open(os.path.join(DATA_PATH, "tile9.json"), "w") as json_file:
        json.dump(data, json_file)


def tile10():
    drought_folder = pathlib.Path(DROUGHT_DATA)
    font = ImageFont.truetype("static/fonts/WWF.woff", 30)
    years = {
        2014: ((56, 7, 633, 757), -6),
        2015: ((56, 7, 633, 757), -6),
        2016: ((56, 7, 633, 757), -9),
        2017: ((59, 10, 636, 760), -9),
        2018: ((59, 10, 636, 760), -9),
        2019: ((59, 10, 636, 760), -9),
        2020: ((59, 10, 636, 760), -9),
    }
    months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    for year, (crop, m) in years.items():
        year_folder = pathlib.Path(RAW_DATA_PATH) / "drought" / str(year)

        images = {}
        for drought_raw in year_folder.iterdir():
            month = drought_raw.name[m:m + 2]
            im = Image.open(drought_raw)
            im = im.crop(crop)
            draw = ImageDraw.Draw(im)
            draw.rectangle((10, 40, 130, 80), fill="#97b6e1")
            draw.text((10, 10), text=months[int(month) - 1], fill="black", font=font)
            images[int(month)] = im

        drought_file = drought_folder / f"{year}.gif"
        sorted_images = [images[k] for k in sorted(images.keys())]
        sorted_images[0].save(drought_file, save_all=True, append_images=sorted_images[1:], duration=1000, loop=0)

    data = [{"year": year} for year in years]
    with open(os.path.join(DATA_PATH, "tile10.json"), "w") as json_file:
        json.dump(data, json_file)


tile9()
