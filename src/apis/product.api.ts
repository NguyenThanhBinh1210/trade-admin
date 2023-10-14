import http from '~/utils/http'

export const getProduct = (params?: unknown) => http.get('/product/get-all', { params })
export const getAllKey = () => http.get('/key')
export const blockKey = (body: { key: string; code: string }) => http.post('/key/block-key', body)
export const removeKey = (body: { key: string }) => http.post('/key/delete-key', body)
export const searchKey = (username: string) => http.get(`/user/auth/search?q=${username}`)
export const searchUser = (username: string) => http.get(`/user/auth/info?q=${username}`)
export const searchComment = (title: string) => http.get(`/v1/comment/search?content=${title}`)
// export const deleteComment = (id: string[]) => http.delete(`/v1/comment/delete`, { id: id })
export const createKey = (body: { date: number; username: string }) => http.post('key/create', body)
export const getAllComment = (params?: unknown) => http.get('/v1/comment/get-all-comment', { params })
export const updateConfig = (body: { title: string; price: number; url_tele: string; content: string[] }) =>
  http.post('/config/update', body)
export const getAllUser = () => http.get('user/auth/info')
