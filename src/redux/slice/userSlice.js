import { createSlice } from "@reduxjs/toolkit";
import { login ,logoutUser,updateProfile} from "../action/userActions"; 

const initialState = {
    userInfo: null,
};

const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {}, // You can remove this if you don't have any normal reducers
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.userInfo = action.payload.userInfo;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                console.log("fullfilled",action)
                state.userInfo = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.userInfo = null;
            });
    }
});

export default userSlice.reducer;
