import { createSlice } from '@reduxjs/toolkit';

interface NewsState {
  news: any[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
  lastFetch: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
});

export default newsSlice.reducer;
export type { NewsState };

