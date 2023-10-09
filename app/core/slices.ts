import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IPayload {
    name: string;
    id: string;
}

const UserSlice = createSlice({
    name: 'user',
    initialState: {name: '', id: ''},
    reducers: {
        setUser(state, action: PayloadAction<IPayload>) {
            state = action.payload;
            return state;
        }
    }
})

export const { setUser } = UserSlice.actions;
export default UserSlice.reducer;