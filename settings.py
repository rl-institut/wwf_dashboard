
import pathlib
import environs

env = environs.Env()

DEBUG = env.bool("DEBUG", False)
PASSWORD = env.str("PASSWORD", None)


ICONS = [icon.name[:-4] for icon in pathlib.Path("static/icons").iterdir() if icon.suffix == ".svg"]

CORS_ORIGINS = env.list("CORS_ORIGIN", [])
