import http from '~/utils/http'

// Product
export const deleteProduct = (id: unknown) => http.delete(`/product/delete/${id}`)
export const addProduct = (product?: any) => http.post(`/product/create/`, product)
export const getProduct = (id: unknown) => http.get(`/product/get-details/${id}`)
export const updateProduct = (id: unknown, params: any) => http.put(`/product/update/${id}`, params)
