
from cairosvg import svg2png
from requests_html import HTMLSession


session = HTMLSession()
r = session.get('http://localhost:5000')
r.html.render()
svg = r.html.find("svg")[0].html

svg2png(bytestring=svg, write_to='static/share/output.png')

