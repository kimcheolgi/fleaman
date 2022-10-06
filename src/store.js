import { configureStore, createSlice } from "@reduxjs/toolkit";

let initState = createSlice({
  name: 'init',
  initialState: ['hello world']
})

export default configureStore({
  reducer: {
    init: initState.reducer
  }
})