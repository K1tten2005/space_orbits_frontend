export interface Orbit {
    id: number;
    height: number;
    type: string;
    full_description: string;
    short_description: string;
    image: string;
  }

  export interface LoginResponse {
    success: boolean;
    message?: string; // Сообщение об ошибке или успехе
}

  
  export interface OrbitResult {
    orbits: Orbit[];
  }

  export const getOrbitsByHeight = async (height = ''): Promise<OrbitResult> => {
    const url = `/api/orbits/?orbit_height=${encodeURIComponent(height)}`;
    return fetch(url)
        .then((response) => response.json())
        .then((data) => ({
            orbits: Array.isArray(data.orbits) ? data.orbits : [],
        }));
};

  export const getOrbitById = async (orbitId: number | string): Promise<Orbit> => {
    const url = `/api/orbits/${encodeURIComponent(orbitId)}`;
    return fetch(url)
      .then((response) => response.json());
  };

  export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    const url = `/api/users/login/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ username, password }).toString(),
        });

        if (response.ok) {
            // Сохранение session_id в куки
            const sessionId = response.headers.get("Set-Cookie"); // Если сервер отправляет cookie
            if (sessionId) {
                document.cookie = `session_id=${sessionId}; path=/;`; // Пример, сохранение cookie
            }
            return { success: true };
        } else {
            const data = await response.json();
            return { success: false, message: data.error || 'Ошибка авторизации' };
        }
    } catch (error) {
        console.error('Ошибка подключения к серверу:', error);
        return { success: false, message: 'Ошибка подключения к серверу' };
    }
};

export interface CartDetailsResponse {
  draft_transition: number;
  orbits_to_transfer: number;
}


