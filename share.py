
import pathlib
import datetime as dt
from requests_html import AsyncHTMLSession
from bs4 import BeautifulSoup
from cairosvg import svg2png
import pyppeteer
import logging


SHARE_FOLDER = "static/share"


class AsyncHTMLSessionFixed(AsyncHTMLSession):
    """
    pip3 install websockets==6.0 --force-reinstall
    """
    def __init__(self, **kwargs):
        super(AsyncHTMLSessionFixed, self).__init__(**kwargs)
        self.__browser_args = kwargs.get("browser_args", ["--no-sandbox"])

    @property
    async def browser(self):
        if not hasattr(self, "_browser"):
            self._browser = await pyppeteer.launch(
                ignoreHTTPSErrors=not(self.verify),
                headless=True,
                handleSIGINT=False,
                handleSIGTERM=False,
                handleSIGHUP=False,
                args=self.__browser_args
            )

        return self._browser


async def share_svg(tile, options, request):
    logger = logging.getLogger()
    filename = get_tile_filename(tile, options)
    share_path = pathlib.Path(SHARE_FOLDER) / filename
    if share_path.exists():
        return str(share_path)
    session = AsyncHTMLSessionFixed()
    if tile == 6:
        options_path = f"date={dt.datetime.strptime(options['date'], '%d.%m.%Y').date().isoformat()}"
    else:
        options_path = "&".join(f"{k}={v}" for k, v in options.items())
    share_url = f'{request.host_url}{tile}?{options_path}'
    logger.info(f"Requesting share for '{share_url}'")
    r = await session.get(share_url)
    logger.info("Rendering html for share url")
    await r.html.arender()
    soup = BeautifulSoup(r.html.html, features="lxml")
    svg = soup.find("svg")
    logger.info(f"Saving svg as png to '{share_path}'")
    svg2png(bytestring=svg.prettify(), write_to=str(share_path))
    return str(share_path)


def get_tile_filename(tile, options):
    if tile == 6:
        date = dt.datetime.strptime(options['date'], "%d.%m.%Y").date()
        return f"t{tile}_{date.isoformat()}.png"
    option_str = "_".join(options.values())
    return f"t{tile}_{option_str}.png"
