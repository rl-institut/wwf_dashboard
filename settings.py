
import environs

env = environs.Env()

DEBUG = env.bool("DEBUG", False)
