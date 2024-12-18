export const getCsrfToken = (): string | undefined => {
    const csrfToken = document.cookie
        .split(';')
        .find((cookie) => cookie.trim().startsWith('csrftoken='))
        ?.split('=')[1];
    return csrfToken;
};