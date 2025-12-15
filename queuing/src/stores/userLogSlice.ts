import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserLogType } from "../dataTypes/dataTypes";

export const fetchUserLogList = createAsyncThunk<UserLogType[], void>(
    'userLog/fetchUserLogList',
    async () => {
        try {
            let res = await fetch('http://localhost:3001/userLogs', {
                method:'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching user logs:', error);
            return [];
        }
    }
);

export const userLogSlice = createSlice({
    name:'userLog',
    initialState: [] as UserLogType[],
    reducers: {
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchUserLogList.pending, (state) => {
      })
      .addCase(fetchUserLogList.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchUserLogList.rejected, (state, action) => {
        return [];
      });
  },
});

export default userLogSlice.reducer;

