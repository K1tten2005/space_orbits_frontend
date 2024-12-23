export const ROUTES = {
    HOME: "/",
    ORBITS: "/orbits",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    TRANSITIONS: "/transitions",
    PAGE403: "/403",
    PAGE404: "/404",
    EDIT_ORBITS: "/edit"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    ORBITS: "Орбиты",
    LOGIN: "Аутентификация",
    REGISTER: "Регистрация",
    PROFILE: "Профиль",
    TRANSITIONS: "Переходы",
    PAGE403: "Доступ запрещен",
    PAGE404: "Страница не найдена",
    EDIT_ORBITS: "Редактировать орбиты"
}

