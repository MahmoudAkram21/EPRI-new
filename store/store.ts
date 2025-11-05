import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from './slices/departmentsSlice';
import servicesReducer from './slices/servicesSlice';
import coursesReducer from './slices/coursesSlice';
import newsReducer from './slices/newsSlice';
import eventsReducer from './slices/eventsSlice';
import conferenceReducer from './slices/conferenceSlice';

export const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    services: servicesReducer,
    courses: coursesReducer,
    news: newsReducer,
    events: eventsReducer,
    conference: conferenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

