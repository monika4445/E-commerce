import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await fetch("http://localhost:5000/users");
  const json = await res.json();
  return json;
});

export const register = createAsyncThunk(
  "users/register",
  async ({ user }) => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      } else {
        const errorMsg = await res.json();
        throw new Error(errorMsg.error);
      }
    } catch (err) {
      console.log(err, 'err');
      throw new Error(err);
    }
  }
);

export const login = createAsyncThunk(
  "users/login",
  async ({ user }) => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const status = res.status;
      const json = await res.json();

      if (status === 200) {
        return json;
      } else {
        throw new Error(json);
      }
    } catch (err) {
      throw new Error(err);
    }
  }
);

const initialState = {
  users: [],
  payl: null,
  errorLogin: null,
  errorRegister: null,
  status: "idle",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "success";
        state.users.push(action.payload);
        console.log(action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "error";
        console.log(action, 'a');
        state.errorRegister = action.error.message;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = "success";
        state.payl = payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        console.log(action, 'a');
        state.errorLogin = action.error.message;
      });
  },
});

export default usersSlice.reducer;
