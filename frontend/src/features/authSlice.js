import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../services/api";






export const authLoginThunk = createAsyncThunk("auth/login",async (formData)=>{

    const response = await axiosInstance.post("/auth/login",formData);

    return response;

})

export const authLogoutThunk = createAsyncThunk("auth/logout",async ()=>{

    const response = await axiosInstance.post("auth/logout");

    return response;

})

export const checkAuthThunk = createAsyncThunk("auth/checkAuth",async ()=>{
    const response = await axiosInstance.post("auth/checkAuth");

    return response;
})

const initialState = {
    isLoggedIn:false,
    showError:false,
    firstName:"",
    lastName:"",
    userId:"",
    email:""


}


const authSlice = createSlice({

    name:"auth",
    initialState,

    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(authLoginThunk.fulfilled,(state,action)=>{
            state.isLoggedIn=true,
            state.showError=false,
            state.userId=action.payload.data.userId,
            state.firstName=action.payload.data.firstName,
            state.lastName=action.payload.data.lastName
            state.email=action.payload.data.email
        });

        builder.addCase(authLoginThunk.rejected,(state)=>{
            state.isLoggedIn=false,
            state.showError=true,
            state.firstName="",
            state.lastName="",
            state.userId="",
            state.email=""    

        })

        builder.addCase(authLogoutThunk.fulfilled,(state)=>{
            state.isLoggedIn=false,
            state.showError=false,
            state.firstName="",
            state.lastName="",
            state.userId="",
            state.email=""
        })

        builder.addCase(authLogoutThunk.rejected,(state)=>{
            state.isLoggedIn=true,
            state.showError=true,
            state.firstName="",
            state.lastName="",
            state.userId="",
            state.email=""
        })

        builder.addCase(checkAuthThunk.fulfilled,(state,action)=>{
            state.isLoggedIn=true,
            state.showError=false,
            state.userId=action.payload.data.id,
            state.firstName=action.payload.data.firstName,
            state.lastName=action.payload.data.lastName
            state.email=action.payload.data.email
            
        })

        builder.addCase(checkAuthThunk.rejected,(state)=>{
            state.isLoggedIn=false,
            state.firstName="",
            state.lastName="",
            state.userId="",
            state.email=""

        })

    }

})

export const authReducer=authSlice.reducer