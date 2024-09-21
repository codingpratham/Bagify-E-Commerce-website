import { Children, createContext ,useState,useContext} from 'react'

const cartContext=createContext()

export const cartProvider=({children})=>{
    const [cartItems, setCartItems]=useState([])
    
    const addToCart=(product)=>{
        setCartItems((prevCart)=>{[
            ...prevCart,product]
        })
    }

    const removeFromCart=(productId)=>{
        setCartItems((prevCart)=>{
            return prevCart.filter((item)=>{
                item.id!==productId
            })
        })
    }

    return (
        <>
        <cartContext.Provider value={{cart,addToCart,removeFromCart}}>
            {children}
        </cartContext.Provider>
        </>
    )
}

export const useCart=()=>useContext(cartContext)

