import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    name: string;
    id: number;
}

const initialState: AuthState = {
    token: "",
    name: "",
    id: 0,
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
        },
    },
});

export const { setToken, setName, setId,resetAuth } = authSlice.actions;
export default authSlice.reducer;
