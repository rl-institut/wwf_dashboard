
import datetime as dt
import scrape


def test_agora_data():
    date = dt.date(2023, 8, 14)
    agora_data = scrape.get_agora_data_for_day(date)
    assert len(agora_data[0]) == 24


def test_start_of_week():
    assert scrape.get_start_of_week(dt.date(2023, 8, 14)) == dt.date(2023, 8, 14)
    assert scrape.get_start_of_week(dt.date(2023, 8, 15)) == dt.date(2023, 8, 14)
    assert scrape.get_start_of_week(dt.date(2023, 8, 16)) == dt.date(2023, 8, 14)
    assert scrape.get_start_of_week(dt.date(2023, 8, 17)) == dt.date(2023, 8, 14)
    assert scrape.get_start_of_week(dt.date(2023, 8, 18)) == dt.date(2023, 8, 14)
    assert scrape.get_start_of_week(dt.date(2023, 8, 19)) == dt.date(2023, 8, 14)
    assert scrape.get_start_of_week(dt.date(2023, 8, 20)) == dt.date(2023, 8, 14)
    assert scrape.get_start_of_week(dt.date(2023, 8, 1)) == dt.date(2023, 7, 31)
    assert scrape.get_start_of_week(dt.date(2023, 7, 1)) == dt.date(2023, 6, 26)
    assert scrape.get_start_of_week(dt.date(2023, 1, 1)) == dt.date(2022, 12, 26)



def test_smard_data():
    date = dt.date(2023, 8, 14)
    smard_data = scrape.get_smard_data_for_day(date)
    assert len(smard_data[0]) == 24
