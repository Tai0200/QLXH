import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { QueueNumberType } from "../dataTypes/dataTypes";

export const fetchQueueNumberList = createAsyncThunk<QueueNumberType[], void>(
    'queue/fetchQueueNumberList',
    async () => {
        try {
            let res = await fetch('http://localhost:3001/queueNumbers', {
                method:'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await res.json();
            // Đảm bảo trả về là mảng
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching queue numbers:', error);
            return [];
        }
    }
);

export const addQueueNumber = createAsyncThunk<QueueNumberType, QueueNumberType>(
    'queue/addQueueNumber',
    async (queueNumber) => {
        let res = await fetch('http://localhost:3001/queueNumbers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queueNumber)
        });
        let data = await res.json();
        return data;
    }
);

export const updateQueueNumber = createAsyncThunk<QueueNumberType, QueueNumberType>(
    'queue/updateQueueNumber',
    async (queueNumber) => {
        const queueId = queueNumber.id || (queueNumber as any).key;
        if (!queueId) {
            throw new Error('Queue Number ID is missing');
        }
        let res = await fetch(`http://localhost:3001/queueNumbers/${queueId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queueNumber)
        });
        if (!res.ok) {
            throw new Error(`Failed to update queue number: ${res.statusText}`);
        }
        let data = await res.json();
        return data;
    }
);

export const queueSlice = createSlice({
    name:'queue',
    initialState: [] as QueueNumberType[],
    reducers: {
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchQueueNumberList.pending, (state) => {
      })
      .addCase(fetchQueueNumberList.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchQueueNumberList.rejected, (state, action) => {
        return [];
      })
      .addCase(addQueueNumber.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateQueueNumber.fulfilled, (state, action) => {
        const payload = action.payload;
        const index = state.findIndex(q => {
          const qId = q.id || (q as any).key;
          const pId = payload.id || (payload as any).key;
          return String(qId) === String(pId);
        });
        if (index !== -1) {
          state[index] = payload;
        } else {
          state.push(payload);
        }
      })
      .addCase(updateQueueNumber.rejected, (state, action) => {
        console.error('Update queue number failed:', action.error);
      });
  },
});

export default queueSlice.reducer;

