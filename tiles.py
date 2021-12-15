
def get_tile_filename(tile, options):
    if tile in [1, 2, 4]:
        return f"t{tile}_{options['year']}.png"
