import http from '~/utils/http'

export const getChatResults = () => http.get('/chat/get-all')
export const createChatResult = (body: any) => http.post('/chat/create', body)
export const deleteChatResult = (id?: string) => http.delete(`/chat/delete-result/${id}`)
// export const getCategory = (id: unknown) => http.get<Category>(`/category/get-details/${id}`)
export const updateChatResult = (id: string, body: any) => http.put(`/chat/update-result/${id}`, body)
