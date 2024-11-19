export const ROUTES = {
    HOME: "/",
    ORBITS: "/orbits"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    ORBITS: "Орбиты",
}

