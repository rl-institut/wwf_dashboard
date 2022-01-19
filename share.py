
import datetime as dt
from requests_html import AsyncHTMLSession
from bs4 import BeautifulSoup
from cairosvg import svg2png
import pyppeteer


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
            self._browser = await pyppeteer.launch(ignoreHTTPSErrors=not(self.verify), headless=True, handleSIGINT=False, handleSIGTERM=False, handleSIGHUP=False, args=self.__browser_args)

        return self._browser


async def share_svg(tile, options):
    filename = get_tile_filename(tile, options)
    session = AsyncHTMLSessionFixed()
    r = await session.get(f'http://localhost:5000/{tile}')
    await r.html.arender()
    soup = BeautifulSoup(r.html.html)
    svg = soup.find("svg")
    svg2png(bytestring=svg.prettify(), write_to=f"static/share/{filename}.png")
    return filename


def get_tile_filename(tile, options):
    if tile in [1, 2, 4]:
        return f"t{tile}_{options['year']}.png"
    if tile == 6:
        date = dt.datetime.strptime(options['date'], "%d.%m.%Y").date()
        return f"t{tile}_{date.isoformat()}.png"
    if tile == 7:
        return f"t{tile}_{options['distance']}.png"
