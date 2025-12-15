import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RoleType } from "../dataTypes/dataTypes";

export const fetchRoleList = createAsyncThunk<RoleType[], void>(
    'role/fetchRoleList',
    async () => {
        try {
            let res = await fetch('http://localhost:3001/roles', {
                method:'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching roles:', error);
            return [];
        }
    }
);

export const addRole = createAsyncThunk<RoleType, RoleType>(
    'role/addRole',
    async (role) => {
        let res = await fetch('http://localhost:3001/roles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(role)
        });
        let data = await res.json();
        return data;
    }
);

export const updateRole = createAsyncThunk<RoleType, RoleType>(
    'role/updateRole',
    async (role) => {
        const roleId = role.id || (role as any).key;
        if (!roleId) {
            throw new Error('Role ID is missing');
        }
        let res = await fetch(`http://localhost:3001/roles/${roleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(role)
        });
        if (!res.ok) {
            throw new Error(`Failed to update role: ${res.statusText}`);
        }
        let data = await res.json();
        return data;
    }
);

export const roleSlice = createSlice({
    name:'role',
    initialState: [] as RoleType[],
    reducers: {
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchRoleList.pending, (state) => {
      })
      .addCase(fetchRoleList.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchRoleList.rejected, (state, action) => {
        return [];
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const payload = action.payload;
        const index = state.findIndex(r => {
          const rId = r.id || (r as any).key;
          const pId = payload.id || (payload as any).key;
          return String(rId) === String(pId);
        });
        if (index !== -1) {
          state[index] = payload;
        } else {
          state.push(payload);
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        console.error('Update role failed:', action.error);
      });
  },
});

export default roleSlice.reducer;

