export const isHomePage = (path:string) => {
	return path == "/"
}

export const isActivityPage = (path:string) => {
    return path.match(/^\/details\/(\d+)/)
}

export const truncate = (source:string, size=100) => {
    return source.length > size ? source.slice(0, size - 1) + "…" : source;
}

export const formatDate = (value:string) => {
    if (value) {
        return new Intl.DateTimeFormat("ru",  {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        }).format(Date.parse(value));
    }
}