import { configureStore, createSlice } from "@reduxjs/toolkit";

let bg = createSlice({
  name: 'bg',
  initialState: localStorage.getItem('mode') != undefined ? localStorage.getItem('mode') : 'dark',
  reducers : {
    changeBg(state, a){
      console.log(state, a)
      return a.payload
    }
  }
})
export let { changeBg } = bg.actions 
export default configureStore({
  reducer: {
    bg: bg.reducer
  }
})