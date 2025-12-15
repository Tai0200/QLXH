import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DeviceType } from "../dataTypes/dataTypes";

export const addDevice = createAsyncThunk<DeviceType, DeviceType>(
    'device/addDevice',
    async (device) => {
        let res = await fetch('http://localhost:3001/devices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(device)
        });
        let data = await res.json();
        return data;
    }
);

export const updateDevice = createAsyncThunk<DeviceType, DeviceType>(
    'device/updateDevice',
    async (device) => {
        const deviceId = device.id || (device as any).key;
        if (!deviceId) {
            throw new Error('Device ID is missing');
        }
        let res = await fetch(`http://localhost:3001/devices/${deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(device)
        });
        if (!res.ok) {
            throw new Error(`Failed to update device: ${res.statusText}`);
        }
        let data = await res.json();
        return data;
    }
);

export const deviceSlice = createSlice({
    name:'device',
    initialState: [] as DeviceType[],
    reducers: {
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceList.pending, (state) => {
        //state.loading = true;
        //state.error = null;
      })
      .addCase(fetchDeviceList.fulfilled, (state, action) => {
        //state.loading = false;
        return action.payload;
      })
      .addCase(fetchDeviceList.rejected, (state, action) => {
        //state.loading = false;
        return [];
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const payload = action.payload;
        const index = state.findIndex(d => {
          const dId = d.id || (d as any).key;
          const pId = payload.id || (payload as any).key;
          return String(dId) === String(pId);
        });
        if (index !== -1) {
          state[index] = payload;
        } else {
          // If not found, try to add it (shouldn't happen but just in case)
          state.push(payload);
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        console.error('Update device failed:', action.error);
      });
  },
});
export const fetchDeviceList = createAsyncThunk<DeviceType[], void>(
    'device/fetchdeviceList',
    async () => {
        let res = await fetch('http://localhost:3001/devices/?pageNumber=1&pageSize=20', {
    method:'GET',
    headers: {
      'Content-Type': 'application/json'
    }})
        let data = await res.json();
        console.log(data);
        return data;
    }
)
export default deviceSlice.reducer;