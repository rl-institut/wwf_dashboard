import os
import json
import pandas
import pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFont

FILENAME = "WWF_Daten_Dashboard_Überarbeitung_Stand 06 Sept 2023_V2.5.xlsx"

DATA_PATH = "static/data"
RAW_DATA_PATH = "raw_data"
DROUGHT_DATA = "static/images/drought"


def tile1():
    global_data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="01 CO2 Konzentration",
        header=5,
        usecols=[2, 3, 4, 5],
        nrows=51,
    )
    global_data = global_data.applymap(
        lambda x: x.replace("\xa0", "") if isinstance(x, str) else x
    )
    global_data.columns = ["year", "co2", "ppm", "temperature"]
    global_data = global_data.astype(
        {"year": int, "co2": float, "ppm": float, "temperature": float}
    )
    global_data = global_data.sort_values("year")

    brd_data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="01 CO2 Konzentration",
        header=5,
        usecols=[2, 4, 6, 7],
        nrows=51,
    )
    brd_data = brd_data.applymap(
        lambda x: x.replace("\xa0", "") if isinstance(x, str) else x
    )
    brd_data.columns = ["year", "ppm", "co2", "temperature"]
    brd_data["co2"].iloc[31:] = None
    brd_data = brd_data.astype(
        {"year": int, "ppm": float, "co2": float, "temperature": float}
    )
    brd_data = brd_data.replace({np.nan: None})
    brd_data = brd_data.sort_values("year")

    data = {
        "global": global_data.to_dict(orient="records"),
        "brd": brd_data.to_dict(orient="records"),
    }
    with open(os.path.join(DATA_PATH, "tile1.json"), "w") as json_file:
        json.dump(data, json_file)


def tile2():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="04 Energieverbrauch",
        header=6,
        usecols=[3, 4, 5, 6, 7, 9, 10, 11, 12, 14],
        nrows=33,
    )
    data.columns = [
        "year",
        "coal1",
        "coal2",
        "oil",
        "gas",
        "renewables",
        "others",
        "export",
        "nuclear",
        "savings",
    ]
    data["coal"] = data["coal1"] + data["coal2"]
    data["others"] = data["others"] + data["export"]
    technologies = ["coal", "oil", "gas", "renewables", "others", "nuclear", "savings"]
    data = data[["year"] + technologies]
    PJ_to_TWh = 0.27777777777778
    data[technologies] = data[technologies] * PJ_to_TWh
    data[data < 10] = 0

    traffic = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="04 Energieverbrauch",
        header=6,
        usecols=[16, 17, 18],
        nrows=33,
    )
    data["traffic"] = traffic["Erneuerbar"]

    power = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="04 Energieverbrauch",
        header=6,
        usecols=[22, 23, 24],
        nrows=33,
    )
    data["power"] = power["Erneuerbar.1"]

    heat = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="04 Energieverbrauch",
        header=6,
        usecols=[28, 29, 30],
        nrows=33,
    )
    data["heat"] = heat["Erneuerbar.2"]

    data.to_json(os.path.join(DATA_PATH, "tile2.json"), orient="records")


def tile3():
    emissions = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="05 Sektorziele CO2-Neutralität",
        header=11,
        usecols=range(4, 7),
        nrows=7,
    )
    emissions.columns = ["year", "reduction_percent", "emissions"]
    emissions = emissions.fillna(0)
    sectors = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="05 Sektorziele CO2-Neutralität",
        header=11,
        usecols=range(8, 16),
        nrows=11,
    )
    sectors.columns = [
        "year",
        "energy",
        "industry",
        "house",
        "agriculture",
        "traffic",
        "waste",
        "total",
    ]
    sectors = sectors.interpolate()
    data = {
        "emissions": emissions.to_dict(orient="records"),
        "sectors": sectors.to_dict(orient="records"),
    }
    with open(os.path.join(DATA_PATH, "tile3.json"), "w") as json_file:
        json.dump(data, json_file)


def tile4():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="06 Klimatechnologien",
        header=6,
        usecols=[3, 4, 5, 6, 7],
        nrows=23,
    )
    data.columns = ["year", "ecars", "charging", "storages", "heatpumps"]
    data.to_json(os.path.join(DATA_PATH, "tile4.json"), orient="records")


def tile5():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="07 Immer mehr EE",
        header=9,
        usecols=[1, 2, 3, 12, 14, 16, 17, 18],
        nrows=33,
        index_col=0,
    )
    data = data.applymap(lambda x: None if x == "k.A." else x)
    data = data.interpolate(limit_direction="both")
    data = data.divide(data["Bruttostromerzeugung gesamt"], axis="index") * 100
    data = data.reset_index()
    data.columns = [
        "year",
        "total",
        "fossil",
        "wind_onshore",
        "wind_offshore",
        "hydro",
        "biomass",
        "pv",
    ]
    data.iloc[30, 0] = 2020
    data.to_json(os.path.join(DATA_PATH, "tile5.json"), orient="records")


def tile7():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="09 Klima-Mobilität",
        header=8,
        usecols=[2, 3, 5],
        nrows=30,
    )
    data.columns = ["vehicle", "emission", "type"]
    data = data.fillna(method="ffill")
    data.to_json(os.path.join(DATA_PATH, "tile7.json"), orient="records")


def tile8():
    data = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="10 Steigender Strombedarf",
        header=9,
        usecols=range(2, 8),
        nrows=31,
    )
    data.columns = ["year", "primary", "power", "pv", "wind_onshore", "wind_offshore"]
    data = data.interpolate()
    data["wind"] = data["wind_onshore"] + data["wind_offshore"]
    data[["year", "primary", "power", "pv", "wind"]].to_json(
        os.path.join(DATA_PATH, "tile8.json"), orient="records"
    )


def tile9():
    installations = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="11 Heizungen",
        header=7,
        usecols=range(3, 9),
        nrows=13,
    )
    installations.columns = ["year", "biomass", "heatpump", "gas", "oil", "solar"]
    emissions = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="11 Heizungen",
        header=7,
        usecols=range(12, 19),
        nrows=1,
    )
    emissions.columns = ["solar", "heatpump", "gas", "biomass", "oil"]
    data = {
        "installations": installations.to_dict(orient="records"),
        "emissions": emissions.iloc[0].to_dict(),
    }
    with open(os.path.join(DATA_PATH, "tile9.json"), "w") as json_file:
        json.dump(data, json_file)


def tile10():
    original_size = (577, 750)
    drought_folder = pathlib.Path(DROUGHT_DATA)
    font_month = ImageFont.truetype("static/fonts/WWF.woff", 30)
    font_legend = ImageFont.truetype("static/fonts/OpenSans-Regular.woff", 16)
    legend = [
        ("#EFD655", "Ungewöhnlich trocken"),
        ("#EEC095", "Moderate Dürre"),
        ("#EA885E", "Schwere Dürre"),
        ("#B03131", "Extreme Dürre"),
        ("#740F0F", "Außergewöhnliche Dürre"),
    ]
    legend_size = 16
    legend_vspace = 10
    legend_hspace = 8
    legend_margin = 24
    height = original_size[1] + 2 * legend_margin + 3 * legend_size + 2 * legend_vspace
    years = {
        2014: ((56, 7, 633, 757), -6),
        2015: ((56, 7, 633, 757), -6),
        2016: ((56, 7, 633, 757), -9),
        2017: ((59, 10, 636, 760), -9),
        2018: ((59, 10, 636, 760), -9),
        2019: ((59, 10, 636, 760), -9),
        2020: ((59, 10, 636, 760), -9),
        2021: ((59, 10, 636, 760), -9),
        2022: ((59, 10, 636, 760), -9),
    }
    months = [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ]
    for year, (crop, m) in years.items():
        year_folder = pathlib.Path(RAW_DATA_PATH) / "drought" / str(year)

        images = {}
        for drought_raw in year_folder.iterdir():
            month = drought_raw.name[m : m + 2]
            im_drought = Image.open(drought_raw)
            im_drought = im_drought.crop(crop)

            im = Image.new(
                im_drought.mode, size=(original_size[0], height), color="white"
            )
            im.paste(im_drought, (0, 0))

            draw = ImageDraw.Draw(im)

            # Add month
            draw.rectangle((10, 40, 130, 80), fill="#97b6e1")
            draw.text(
                (10, 10), text=months[int(month) - 1], fill="black", font=font_month
            )

            # Add legend
            # draw.rectangle((0, 749, original_size[0] - 1, height - 1), outline="black")
            for i, (color, label) in enumerate(legend):
                x = legend_margin + int(i / 3) * original_size[0] / 2
                y = (
                    original_size[1]
                    + legend_margin
                    + (i % 3) * (legend_size + legend_vspace)
                )
                draw.rectangle((x, y, x + legend_size, y + legend_size), fill=color)
                draw.text(
                    (x + legend_size + legend_hspace, y + legend_size / 2),
                    text=label,
                    fill="black",
                    font=font_legend,
                    anchor="lm",
                )

            images[int(month)] = im

        drought_file = drought_folder / f"{year}.gif"
        sorted_images = [images[k] for k in sorted(images.keys())]
        sorted_images[0].save(
            drought_file,
            save_all=True,
            append_images=sorted_images[1:],
            duration=1000,
            loop=0,
        )

    data = [{"year": year} for year in years]
    with open(os.path.join(DATA_PATH, "tile10.json"), "w") as json_file:
        json.dump(data, json_file)


def tile11():
    imports = pandas.read_excel(
        os.path.join(RAW_DATA_PATH, FILENAME),
        sheet_name="03 Fossile Abhängigkeiten",
        header=7,
        usecols="D:G",
        nrows=7,
    )
    imports.columns = ["year", "coal", "oil", "gas"]

    data = {
        "imports": imports.to_dict(orient="records"),
    }

    nrows = 5
    for i, type_ in enumerate(("coal", "oil", "gas")):
        header = 7 + i * (4 + nrows)
        df = pandas.read_excel(
            os.path.join(RAW_DATA_PATH, FILENAME),
            sheet_name="03 Fossile Abhängigkeiten",
            header=header,
            usecols=[8, 15],
            nrows=7,
            index_col=0,
        )
        df.columns = ["import"]
        df = (df * 100).round()
        df.index.name = "year"
        df = df.reset_index()
        data[type_] = df.to_dict(orient="records")

    with open(os.path.join(DATA_PATH, "tile11.json"), "w") as json_file:
        json.dump(data, json_file)


for tile_id in range(1, 12):
    if tile_id == 6:
        continue
    exec(f"tile{tile_id}()")
