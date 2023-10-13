import http from '~/utils/http'

export const getProduct = (params?: unknown) => http.get('/product/get-all', { params })
export const getAllKey = () => http.get('/key')
export const blockKey = (body: { key: string; code: string }) => http.post('/key/block-key', body)
export const removeKey = (body: { key: string }) => http.post('/key/delete-key', body)
export const searchKey = (username: string) => http.get(`/user/auth/search?q=${username}`)
export const searchUser = (username: string) => http.get(`/user/auth/info?q=${username}`)
export const searchConfig = (title: string) => http.get(`/config?q=${title}`)
export const createKey = (body: { date: number; username: string }) => http.post('key/create', body)
export const getAllConfig = () => http.get('/config')
export const updateConfig = (body: { title: string; price: number; url_tele: string; content: string[] }) =>
  http.post('/config/update', body)
export const getAllUser = () => http.get('user/auth/info')
