
def get_tile_filename(tile, options):
    if tile in [1, 2]:
        return f"t{tile}_{options['year']}.png"
