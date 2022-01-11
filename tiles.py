import datetime as dt


def get_tile_filename(tile, options):
    if tile in [1, 2, 4]:
        return f"t{tile}_{options['year']}.png"
    if tile == 6:
        date = dt.datetime.strptime(options['date'], "%d.%m.%Y").date()
        return f"t{tile}_{date.isoformat()}.png"
    if tile == 7:
        return f"t{tile}_{options['distance']}.png"
