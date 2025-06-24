import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
};
const userSlice = createSlice({ name: "user", initialState, reducers: {} });
export default userSlice.reducer;
