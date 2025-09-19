import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  taskList: [],
  assignedToDos: null,
  todoDeadline: null,
  myTodos: null,
  prevTodo: null,
  assigned: null,
  completeAssigned: null,
  myTodo: null,
  doneTodos: null,
  texts: [],
  collabCacheAdd: [],
  collabCacheRemove: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTaskList: (state, action) => {
      state.taskList = action.payload;
    },
    setAssignedToDos: (state, action) => {
      state.assignedToDos = action.payload;
    },
    setTodoDeadLine: (state, action) => {
      state.todoDeadline = action.payload;
    },
    setMyTodos: (state, action) => {
      state.myTodos = action.payload;
    },
    setPrevTodo: (state, action) => {
      state.prevTodo = action.payload;
    },
    setAssigned: (state, action) => {
      state.assigned = action.payload;
    },
    setCompleteAssigned: (state, action) => {
      state.completeAssigned = action.payload;
    },
    setMyTodo: (state, action) => {
      state.myTodo = action.payload;
    },
    setDoneTodos: (state, action) => {
      state.doneTodos = action.payload;
    },
    setTexts: (state, action) => {
      state.texts = action.payload;
    },
    setCollabCachedAdd: (state, action) => {
      state.collabCacheAdd = action.payload;
    },
    setCollabCachedRemove: (state, action) => {
      state.collabCacheRemove = action.payload;
    },
    resetTodoSlice: () => initialState,
  },
});

export const {
  setTaskList,
  setAssignedToDos,
  setTodoDeadLine,
  setMyTodos,
  setPrevTodo,
  setAssigned,
  setCompleteAssigned,
  setMyTodo,
  setDoneTodos,
  setTexts,
  setCollabCachedAdd,
  setCollabCachedRemove,
  resetTodoSlice,
} = todoSlice.actions;

export default todoSlice.reducer;
