import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AccountType } from "../dataTypes/dataTypes";

export const fetchAccountList = createAsyncThunk<AccountType[], void>(
    'account/fetchAccountList',
    async () => {
        try {
            let res = await fetch('http://localhost:3001/accounts', {
                method:'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }
    }
);

export const addAccount = createAsyncThunk<AccountType, AccountType>(
    'account/addAccount',
    async (account) => {
        let res = await fetch('http://localhost:3001/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        });
        let data = await res.json();
        return data;
    }
);

export const updateAccount = createAsyncThunk<AccountType, AccountType>(
    'account/updateAccount',
    async (account) => {
        const accountId = account.id || (account as any).key;
        if (!accountId) {
            throw new Error('Account ID is missing');
        }
        let res = await fetch(`http://localhost:3001/accounts/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        });
        if (!res.ok) {
            throw new Error(`Failed to update account: ${res.statusText}`);
        }
        let data = await res.json();
        return data;
    }
);

export const accountSlice = createSlice({
    name:'account',
    initialState: [] as AccountType[],
    reducers: {
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchAccountList.pending, (state) => {
      })
      .addCase(fetchAccountList.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchAccountList.rejected, (state, action) => {
        return [];
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const payload = action.payload;
        const index = state.findIndex(a => {
          const aId = a.id || (a as any).key;
          const pId = payload.id || (payload as any).key;
          return String(aId) === String(pId);
        });
        if (index !== -1) {
          state[index] = payload;
        } else {
          state.push(payload);
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        console.error('Update account failed:', action.error);
      });
  },
});

export default accountSlice.reducer;

