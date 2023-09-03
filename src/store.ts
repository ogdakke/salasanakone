import passphraseFormReducer from "@/features/passphrase-form/passphrase-form.slice" // Make sure to provide the correct path
import { configureStore } from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
  type Storage,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

type PersistConifg = {
  key: string
  storage: Storage
}
const persistConfig: PersistConifg = {
  key: "root",
  storage,
}

const persistedReducer = persistReducer(persistConfig, passphraseFormReducer)

export const store = configureStore({
  reducer: {
    passphraseForm: persistedReducer,
    // You can add other reducers here when your application grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
