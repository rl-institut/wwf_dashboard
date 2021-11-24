
import js2xml
import requests
from bs4 import BeautifulSoup


r = requests.get('https://www.agora-energiewende.de/agorameter-widget-landscape.html')
soup = BeautifulSoup(r.content, features="lxml")
data_raw = soup.findAll('script')[2].text
parsed = js2xml.parse(data_raw)
data = [(d, d.xpath(".//array/number/@value")) for d in parsed.xpath("//property[@name='data']")]
print(data)
