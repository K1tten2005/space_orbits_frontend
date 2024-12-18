export type T_Orbit = {
    id: number;
    height: number;
    active_add: boolean;
    type: string,
    full_description: string;
    short_description: string;
    image?: string | null | undefined;
  };
  
  
  export type T_Transition = {
    id: number
    planned_date: string
    planned_time: string
    spacecraft: string
    moderator: string
    user: string
    status: string
    creation_date: string
    formation_date: string
    completion_date: string
    highest_orbit: number
    orbits: T_Orbit[]
  }
  
  export type T_User = {
    id: number
    username: string
    email: string
    password: string,
    is_authenticated: boolean
    validation_error: boolean
    validation_success: boolean
    checked: boolean
    first_name: string
    last_name: string
  }
  
  export type T_LoginCredentials = {
    username: string
    password: string
  }
  
  export type T_RegisterCredentials = {
    username: string
    first_name: string
    last_name: string
    email: string
    password: string
  }
  
  export type T_OrbitsListResponse = {
    orbits: T_Orbit[],
    draft_transition: number,
    orbits_to_tranfer: number
  }