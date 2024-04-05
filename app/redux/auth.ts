import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    name: string;
    id: number;
    email: string;
    description: string;
}

const initialState: AuthState = {
    token: "",
    name: "",
    id: 0,
    email: "邮箱为空",
    description: "目前还没有个人描述",
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setId: (state, action: PayloadAction<number>) => {
            state.id = action.payload;
        },
        resetAuth: (state) => {
            state.token = "";
            state.name = "";
            state.id = 0;
            state.email="邮箱为空";
            state.description="目前还没有个人描述";
        },
        //以下为修改内容
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
    },
});

export const {setToken, setName, setId, resetAuth, 
              setEmail, setDescription} = authSlice.actions;
export default authSlice.reducer;
