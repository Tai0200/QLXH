import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ServiceType } from "../dataTypes/dataTypes";

export const fetchServiceList = createAsyncThunk<ServiceType[], void>(
    'service/fetchServiceList',
    async () => {
        let res = await fetch('http://localhost:3001/services/?pageNumber=1&pageSize=20', {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await res.json();
        return data;
    }
);

export const addService = createAsyncThunk<ServiceType, ServiceType>(
    'service/addService',
    async (service) => {
        let res = await fetch('http://localhost:3001/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service)
        });
        let data = await res.json();
        return data;
    }
);

export const updateService = createAsyncThunk<ServiceType, ServiceType>(
    'service/updateService',
    async (service) => {
        const serviceId = service.id || (service as any).key;
        if (!serviceId) {
            throw new Error('Service ID is missing');
        }
        let res = await fetch(`http://localhost:3001/services/${serviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service)
        });
        if (!res.ok) {
            throw new Error(`Failed to update service: ${res.statusText}`);
        }
        let data = await res.json();
        return data;
    }
);

export const serviceSlice = createSlice({
    name:'service',
    initialState: [] as ServiceType[],
    reducers: {
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchServiceList.pending, (state) => {
      })
      .addCase(fetchServiceList.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchServiceList.rejected, (state, action) => {
        return [];
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const payload = action.payload;
        const index = state.findIndex(s => {
          const sId = s.id || (s as any).key;
          const pId = payload.id || (payload as any).key;
          return String(sId) === String(pId);
        });
        if (index !== -1) {
          state[index] = payload;
        } else {
          state.push(payload);
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        console.error('Update service failed:', action.error);
      });
  },
});

export default serviceSlice.reducer;

