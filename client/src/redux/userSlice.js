import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        isLoading:true
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
            state.isLoading=false
        },
        clearUserData:(state)=>{
            state.userData=null
            state.isLoading=false
        },
        setAuthLoading:(state,action)=>{
            state.isLoading=action.payload
        }
    }

})

export const {setUserData, clearUserData, setAuthLoading}= userSlice.actions
export default userSlice.reducer