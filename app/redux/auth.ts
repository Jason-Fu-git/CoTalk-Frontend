import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    name: string;
    id: number;
    email: string;
    description: string;
    friends: Array<number>;
}

const initialState: AuthState = {
    token: "",
    name: "",
    id: 0,
    email: "邮箱为空",
    description: "目前还没有个人描述",
    friends: [],
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
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setFriends: (state, action: PayloadAction<Array<number>>) => {
            state.friends=action.payload;
        },
        resetAuth: (state) => {
            state.token = "";
            state.name = "";
            state.id = 0;
            state.email="邮箱为空";
            state.description="目前还没有个人描述";
            state.friends=[];
        },
    },
});

export const {setToken, setName, setId, setEmail,
            setDescription, setFriends, resetAuth} = authSlice.actions;
export default authSlice.reducer;
