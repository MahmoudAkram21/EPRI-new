import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { services } from '@/lib/data';

interface ServicesState {
  services: any[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: ServicesState = {
  services: services,
  loading: false,
  error: null,
  lastFetch: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
});

export default servicesSlice.reducer;
export type { ServicesState };

