
import pathlib
import environs

VERSION = "2.0.0"

env = environs.Env()

DEBUG = env.bool("DEBUG", False)
PASSWORD = env.str("PASSWORD", None)


ICONS = [icon.name[:-4] for icon in pathlib.Path("static/icons").iterdir() if icon.suffix == ".svg"]
FLAGS = [flag.name[:-4] for flag in pathlib.Path("static/images/flags").iterdir() if flag.suffix == ".svg"]

CORS_ORIGINS = env.list("CORS_ORIGIN", [])
