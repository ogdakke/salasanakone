import passphraseFormReducer from "@/features/passphrase-form/passphrase-form.slice" // Make sure to provide the correct path
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
  reducer: {
    passphraseForm: passphraseFormReducer,
    // You can add other reducers here when your application grows
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store
