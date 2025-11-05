import { createSlice } from '@reduxjs/toolkit';

interface CoursesState {
  courses: any[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
  lastFetch: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
});

export default coursesSlice.reducer;
export type { CoursesState };

