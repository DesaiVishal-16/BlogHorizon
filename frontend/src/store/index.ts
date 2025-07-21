import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist'
import postsReducer from './slices/postSlice';
import usersReducer from './slices/usersSlice';
import commentsReducer from './slices/commentsSlice'

const authPersistConfig = {
   key: 'auth',
   storage,
   blacklist: ['user','token','isAuthenticated'],
};

const rootReducer = combineReducers({
   auth: persistReducer(authPersistConfig,authReducer),
   posts: postsReducer,
   users: usersReducer,
   comments: commentsReducer,
})
const rootPersistConfig = {
   key: 'root',
   storage,
   blacklist: [],
}
const persistedReducer = persistReducer(rootPersistConfig,rootReducer);

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefulatMiddleware) => 
    getDefulatMiddleware({
      serializableCheck: false,
    }), 
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;