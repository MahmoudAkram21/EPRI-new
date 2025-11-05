import { createSlice } from '@reduxjs/toolkit';
import { departments } from '@/lib/data';

interface DepartmentsState {
  departments: any[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: DepartmentsState = {
  departments: departments,
  loading: false,
  error: null,
  lastFetch: null,
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
});

export default departmentsSlice.reducer;
export type { DepartmentsState };

