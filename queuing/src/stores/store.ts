import {configureStore} from '@reduxjs/toolkit';
import { deviceSlice } from './deviceSlice';
import deviceReducer from './deviceSlice';
import serviceReducer from './serviceSlice';
import queueReducer from './queueSlice';
import roleReducer from './roleSlice';
import accountReducer from './accountSlice';
import userLogReducer from './userLogSlice';
export const store = configureStore({
    reducer: {
        device: deviceReducer,
        service: serviceReducer,
        queue: queueReducer,
        role: roleReducer,
        account: accountReducer,
        userLog: userLogReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;