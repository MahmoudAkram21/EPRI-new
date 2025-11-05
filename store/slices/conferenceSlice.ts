import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api';

interface ConferenceState {
  data: any | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: ConferenceState = {
  data: null,
  loading: false,
  error: null,
  lastFetch: null,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const fetchConference = createAsyncThunk(
  'conference/fetch',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const data = await apiClient.getAdminEvents();
      const conference = data.events.find((event: any) => event.is_conference);
      return conference;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch conference');
    }
  }
);

const conferenceSlice = createSlice({
  name: 'conference',
  initialState,
  reducers: {
    clearConference: (state: ConferenceState) => {
      state.data = null;
      state.lastFetch = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchConference.pending, (state: ConferenceState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConference.fulfilled, (state: ConferenceState, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchConference.rejected, (state: ConferenceState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearConference } = conferenceSlice.actions;

// Selector to check if data needs refresh
export const selectShouldFetchConference = (state: { conference: ConferenceState }): boolean => {
  const { data, lastFetch } = state.conference;
  if (!data || !lastFetch) return true;
  return Date.now() - lastFetch > CACHE_DURATION;
};

export default conferenceSlice.reducer;
export type { ConferenceState };

