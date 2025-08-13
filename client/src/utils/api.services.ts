import { api } from "./axios"
import type { Products } from "./types"

export const createProduct = async(products : Products)=>{
    const res =  await api.post("/products/",products)
    return res.data
}