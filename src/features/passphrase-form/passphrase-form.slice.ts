import { IndexableFormValues, InputValue } from "@/models"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// Assuming the defaultFormValues and defaultSliderValue are imported:
import { defaultFormValues, defaultSliderValue } from "@/../config" // Replace 'path_to_your_defaults_file' with the actual path

type State = {
  formValues: IndexableFormValues
  sliderValue: number
}

const initialState: State = {
  formValues: defaultFormValues,
  sliderValue: defaultSliderValue,
}

const passphraseFormSlice = createSlice({
  name: "passphraseForm",
  initialState,
  reducers: {
    // Update the entire form
    setFormValues: (state, action: PayloadAction<IndexableFormValues>) => {
      state.formValues = action.payload
    },
    // Update a specific form field
    setFormField: (
      state,
      action: PayloadAction<{ field: keyof IndexableFormValues; value: InputValue }>,
    ) => {
      const { field, value } = action.payload
      state.formValues[field] = value
    },
    // Update the slider value
    setSliderValue: (state, action: PayloadAction<number>) => {
      state.sliderValue = action.payload
    },
    // Toggle the selected field for any checkbox/radio
    toggleSelectedField: (state, action: PayloadAction<keyof IndexableFormValues>) => {
      const field = action.payload
      state.formValues[field].selected = !state.formValues[field].selected
    },
  },
})

export const {
  setFormValues,
  setFormField,
  setSliderValue,
  toggleSelectedField,
  // ... any other exported actions
} = passphraseFormSlice.actions

export default passphraseFormSlice.reducer
