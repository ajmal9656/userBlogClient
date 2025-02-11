// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Local storage
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import userSlice from './slice/userSlice.js'
// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  user: userSlice,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serialization warning from redux-persist
    }),
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
