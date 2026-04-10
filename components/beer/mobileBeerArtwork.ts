const beerMobileIconById: Record<string, string> = {
  "my-juicy-gf": "/beer_icons/my_juicy_gf.png",
  "foxy-librarian-2025": "/beer_icons/foxy_librarian.png",
  menotomator: "/beer_icons/menotomator.png",
  "time-only-goes": "/beer_icons/time_only_goes.png",
  "bike-path": "/beer_icons/bike_path.png",
  jedermann: "/beer_icons/jedermann.png",
  "marleys-ghost": "/beer_icons/marleys_ghost.png",
  "money-comes-and-goes": "/beer_icons/money_comes_and_goes.png",
  "my-new-gf": "/beer_icons/my_new_gf.png",
  presita: "/beer_icons/presita.png",
  "spy-p-a": "/beer_icons/spy_p_a.png",
  "stave-450": "/beer_icons/stave_450.png",
  "trafford-ale": "/beer_icons/trafford_ale.png",
  walter: "/beer_icons/walter.png",
}

export const HOME_MOBILE_BEER_FINDER_ICON_SRC = "/beer_icons/my_juicy_gf.png"
export const BEER_FINDER_MOBILE_ICON_SRC = "/beer_icons/menotomator.png"

export function getMobileBeerIconSrc(beerId: string) {
  return beerMobileIconById[beerId] ?? "/beer_icons/my_new_gf.png"
}
