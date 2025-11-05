import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api';

interface EventsState {
  events: any[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
  lastFetch: null,
};

const CACHE_DURATION = 5 * 60 * 1000;

export const fetchEvents = createAsyncThunk(
  'events/fetch',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const data = await apiClient.getAdminEvents();
      return data.events;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch events');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEvents: (state: EventsState) => {
      state.events = [];
      state.lastFetch = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchEvents.pending, (state: EventsState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state: EventsState, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.events = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchEvents.rejected, (state: EventsState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEvents } = eventsSlice.actions;
export const selectShouldFetchEvents = (state: { events: EventsState }): boolean => {
  const { events, lastFetch } = state.events;
  if (!events.length || !lastFetch) return true;
  return Date.now() - lastFetch > CACHE_DURATION;
};

export default eventsSlice.reducer;
export type { EventsState };

