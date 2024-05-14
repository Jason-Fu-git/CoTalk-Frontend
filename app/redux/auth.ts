import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    name: string;
    id: number;
    email: string;
    phone: string;
    description: string;
    friends: Array<number>;
    chats: Array<number>;
}

const initialState: AuthState = {
    token: "",
    name: "",
    id: -1,
    email: "邮箱为空",
    phone: "电话为空",
    description: "目前还没有个人描述",
    friends: [],
    chats: [],
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
        setPhone: (state, action: PayloadAction<string>) => {
            state.phone = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setFriends: (state, action: PayloadAction<Array<number>>) => {
            state.friends = action.payload.concat();
        },
        setChats: (state, action: PayloadAction<Array<number>>) => {
            state.chats = action.payload.concat();
        },
        resetAuth: (state) => {
            state.token = "";
            state.name = "";
            state.id = 0;
            state.email = "邮箱为空";
            state.description = "目前还没有个人描述";
            state.friends = [];
            state.chats = [];
        },
    },
});

export const {
    setToken, setName, setId,
    setEmail, setPhone,
    setDescription, setFriends, setChats, resetAuth
} = authSlice.actions;
export default authSlice.reducer;
