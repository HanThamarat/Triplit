/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosInstanceWithoutAuth } from "@/lib/axisInstance";
import { sendEmailVerifyResponse, confirmEmailVerifyResponse, checkEmailResponse } from "@/@types/auth";

export interface sendEmailVerifyProps {
    email: string;
}

export const sendEmailVerify = createAsyncThunk("auth/sendEmailVerify", async(data: sendEmailVerifyProps) => {
    try {
        const response = await AxiosInstanceWithoutAuth.post('/auth/email-verify', data);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});

export interface confrimEmailVerifyProps {
    email: string;
    code: string;
}

export const confrimEmailVerify = createAsyncThunk("auth/confrimEmailVerify", async (data: confrimEmailVerifyProps) => {
    try {
        const response = await AxiosInstanceWithoutAuth.post("/auth/email-verify/confirm", data);

        return { status: true, data: response.data.body };
    } catch (error: any) {
        return { status: false, error: error?.response.data.error };
    }
});


export interface checkEmailProps {
    email: string;
}

export const checkEmail = createAsyncThunk("auth/checkEmail", async (data: checkEmailProps) => {
    try {
        const response = await AxiosInstanceWithoutAuth.post("/auth/email-check", data);

        return { status: true, data: response.data.body as checkEmailResponse };
    } catch (error: any) {
        return { status: false, error: error?.response?.data?.error };
    }
});


interface authType {
  sendEmail: sendEmailVerifyResponse | null;
  comfirmStatus: confirmEmailVerifyResponse | null;
  loading: boolean;
  error: unknown;
}

const initialState: authType = {
  sendEmail: null,
  comfirmStatus: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action: PayloadAction<{ data?: any }>) => {
          state.loading = false;
          if (action.type.includes("sendEmailVerify")) {
            state.sendEmail = action.payload.data as sendEmailVerifyResponse;
          } else if (action.type.includes("confrimEmailVerify")) {
            state.comfirmStatus = action.payload.data as confirmEmailVerifyResponse;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default authSlice.reducer;
export const authSelector = (state: RootState) => state.auth;
