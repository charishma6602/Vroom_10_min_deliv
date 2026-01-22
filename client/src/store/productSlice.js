import { createSlice } from "@reduxjs/toolkit";

const initialVal = {
    allCategories : [],
    allSubCategories : [],
    products : [],
    loadingCategories : true,
}

const productSlice = createSlice({
    name : "products",
    initialState : initialVal ,
    reducers : {
        setAllCategories : (state, action)=>{
            state.allCategories = [...action.payload]
        },
        setAllSubCategories : (state, action)=>{
            state.allSubCategories = [...action.payload]
        },
        setloadingCategories : (state, action)=>{
            state.loadingCategories = action.payload
        },
    }
})
export const {setAllCategories, setAllSubCategories, setloadingCategories} = productSlice.actions


export default productSlice.reducer