const target_tauri = false

export const api_proxy_addr = "http://192.168.0.109:8000"
export const img_proxy_addr = "http://192.168.0.109:9000"
export const dest_api = (target_tauri) ? api_proxy_addr : "api"
export const dest_img =  (target_tauri) ?  img_proxy_addr : "img-proxy"
export const dest_root = (target_tauri) ? "" : "/space_orbits_frontend"