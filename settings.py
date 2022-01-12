
import pathlib
import environs

env = environs.Env()

DEBUG = env.bool("DEBUG", False)


ICONS = [icon.name[:-4] for icon in pathlib.Path("static/icons").iterdir() if icon.suffix == ".svg"]
