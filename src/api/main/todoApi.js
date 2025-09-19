import { firestore } from '../../firebse-config';
import moment from 'moment';
import store from '../../store';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  addDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import {
  setMyTodos,
  setDoneTodos,
  setCompleteAssigned,
  setAssignedToDos,
  setPrevTodo,
  setCollabCachedAdd,
  setTexts,
  setMyTodo,
  setTodoDeadLine,
  setTaskList,
} from './../../slices/todoSlice';
import { notifyCollab } from '../backendApi';

//Fetch Todo's//
export const fetchTodos = async (techId) => {
  try {
    const q = query(
      collection(firestore, 'todo'),
      where('createdBy.id', '==', techId),
      where('todoDone', '==', false),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);

    const todos = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setMyTodos(todos));
  } catch (error) {
    console.error(error.message);
  }
};

//fetch complete todos//
export const fetchCompleteTodos = async (techId) => {
  try {
    const q = query(
      collection(firestore, 'todo'),
      where('createdBy.id', '==', techId),
      where('todoDone', '==', true),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);

    const todos = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setDoneTodos(todos));
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch complete assigned todos//
export const fetchCompleteAssignedTodos = async (techId) => {
  const todoRef = collection(firestore, 'todo');
  try {
    const q = query(
      todoRef,
      where('todoDone', '==', true),
      orderBy('createdAt')
    );
    onSnapshot(q, (snapshot) => {
      let todos = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (
          data.assignedTo &&
          data.assignedTo.some((user) => user.credentials === techId)
        ) {
          if (data.todoDone === false) {
            todos.push({ ...data, id: doc.id });
          }
        }
      });
      store.dispatch(setCompleteAssigned(todos));
    });
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch assigned todos//
export const fetchAssignedTodos = async (techId) => {
  const todoRef = collection(firestore, 'todo');
  try {
    const q = query(
      todoRef,
      where('todoDone', '==', false),
      orderBy('createdAt')
    );
    onSnapshot(q, (snapshot) => {
      let todos = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (
          data.assignedTo &&
          data.assignedTo.some((user) => user.credentials === techId)
        ) {
          if (data.todoDone === false) {
            todos.push({ ...data, id: doc.id });
          }
        }
      });

      store.dispatch(setAssignedToDos(todos));
    });
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch previous todo//
export const fetchPrevTodo = async (todoId) => {
  const todoRef = doc(firestore, 'todo', todoId);
  try {
    const todoDoc = await getDoc(todoRef);
    const todo = todoDoc.data();
    store.dispatch(setPrevTodo(todo));
  } catch (error) {
    console.error(error.message);
  }
};

export const fetchTodo = async (todoId) => {
  //   dispatch({ type: CLEAR_TODOS });
  const todoRef = doc(firestore, 'todo', todoId);

  try {
    const todoDoc = await getDoc(todoRef);
    const todo = todoDoc.data();
    let arr = todo.assignedTo;
    const prevTodo = todo.prevTodo;
    if (prevTodo !== undefined) {
      await fetchPrevTodo(prevTodo);
    }
    await getTodoTexts(todoId);
    store.dispatch(setMyTodo(todo));
    updateCollab(arr);
  } catch (error) {
    console.error(error.message);
  }
};

export const getTodoTexts = async (todoId) => {
  const textsRef = collection(firestore, 'todoText');

  const q = query(
    textsRef,
    where('todoId', '==', todoId),
    orderBy('createdAt')
  );

  const unsub = onSnapshot(q, (snapshot) => {
    let texts = [];
    snapshot.docs.forEach((doc) => {
      texts.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setTexts(texts));
  });
  return unsub;
};

//update the task list//
export const theTaskList = async ({ myArr, todoId }) => {
  const todoRef = doc(firestore, 'todo', todoId);
  try {
    const newFields = { taskList: myArr };
    await updateDoc(todoRef, newFields);
    const todoDoc = await getDoc(todoRef);
    const todo = todoDoc.data();
    let assignedTo = todo.assignedTo;
    let createdBy = todo.createdBy;

    const title = 'Task list update!';
    const text = 'Your Todo has a task list update';
    const type = 'todo';
    const id = todoId;

    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await fetchTodo(todoId);
  } catch (error) {
    console.error(error.message);
  }
};

//Create a todo//
export const createTodo = async ({
  todoName,
  todoDescription,
  taskList,
  assignedTo,
  deadline,
  createdBy,
}) => {
  try {
    const todoRef = collection(firestore, 'todo');
    const createdAt = moment().format();
    const todoDone = false;
    try {
      const todo = await addDoc(todoRef, {
        todoName,
        todoDescription,
        taskList,
        assignedTo,
        deadline,
        createdBy,
        createdAt,
        todoDone,
      });
      const title = 'A new TODO created...';
      const text = `You have a new ToDo: ${todoName}`;
      await notifyCollab({ assignedTo, title, text, createdBy });
      return todo.id;
    } catch (error) {
      console.error(error.message);
    }
  } catch (error) {
    console.error(error.message);
  }
};

//Send Todo Text//
export const sendText = async ({
  authorId,
  authorName,
  createdAt,
  todoId,
  text,
}) => {
  const textRef = collection(firestore, 'todoText');
  const todoRef = doc(firestore, 'todo', todoId);

  try {
    const todoDoc = await getDoc(todoRef);
    const todo = todoDoc.data();
    let assignedTo = todo.assignedTo;
    let createdBy = todo.createdBy;
    await addDoc(textRef, { authorId, authorName, createdAt, text, todoId });

    const title = authorName;

    await notifyCollab({ assignedTo, title, text, createdBy });
  } catch (error) {
    console.error(error.message);
  }
};

//Set Task as complete//
export const setTaskAsComplete = async ({ todoId, task, finalTask }) => {
  const todoRef = doc(firestore, 'todo', todoId);
  try {
    const todoDoc = await getDoc(todoRef);
    const todo = todoDoc.data();
    const taskList = todo.taskList;
    const assignedTo = todo.assignedTo;
    const createdBy = todo.createdBy;

    const newTaskList = taskList.map((tsk) => {
      if (tsk.id === task.id) {
        return { ...tsk, done: true };
      }
      return tsk;
    });

    await updateDoc(todoRef, { taskList: newTaskList });

    if (finalTask) {
      let res = await setTodoAsComplete({ todo, todoId });
      return res;
    } else {
      await fetchTodo(todoId);
      const title = 'Todo Task update...';
      const text = todo.todoName;
      const type = 'todo';
      const id = todoId;
      await notifyCollab({ assignedTo, title, text, createdBy, type, id });
      return undefined;
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const setTaskAsInComplete = async ({ todoId, task, todoComplete }) => {
  const todoRef = doc(firestore, 'todo', todoId);
  try {
    const todoDoc = await getDoc(todoRef);
    const todo = todoDoc.data();
    const taskList = todo.taskList;
    const todoName = todo.todoName;
    const assignedTo = todo.assignedTo;
    const createdBy = todo.createdBy;

    const newTaskList = taskList.map((tsk) => {
      if (tsk.id === task.id) {
        return { ...tsk, done: false };
      }
      return tsk;
    });

    await updateDoc(todoRef, { taskList: newTaskList });
    if (todoComplete) {
      await setTodoAsInComplete(todoId);
    } else {
      await fetchTodo(todoId);
      const title = 'Todo updated...';
      const text = todoName;
      const type = 'todo';
      const id = todoId;
      await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    }
  } catch (error) {
    console.error(error.message);
  }
};

//Set todo as somplete//
export const setTodoAsComplete = async ({ todo, todoId }) => {
  const {
    todoName,
    todoDescription,
    taskList,
    assignedTo,
    deadline,
    createdBy,
  } = todo;
  const currentTodo = doc(firestore, 'todo', todoId);
  const todoRef = collection(firestore, 'todo');
  try {
    const todoDone = false;
    const createdAt = moment().format();
    const prevTodo = todoId;
    const newTaskList = taskList.map((tsk) => {
      return { ...tsk, done: false };
    });
    const completedAt = moment().format();
    const newFields = { todoDone: true, completedAt };

    if (deadline.type === 'Daily') {
      const newTodo = await addDoc(todoRef, {
        todoName,
        todoDescription,
        assignedTo,
        createdBy,
        deadline,
        prevTodo,
        todoDone,
        createdAt,
        taskList: newTaskList,
      });
      await updateDoc(currentTodo, newFields);
      const title = 'Todo Updated, your next todo has been scheduled...';
      const text = todoName;
      const type = 'todo';
      const id = todoId;
      await notifyCollab({ assignedTo, title, text, createdBy, type, id });

      return newTodo.id;
    } else if (deadline.type === 'Weekly') {
      const newTodo = await addDoc(todoRef, {
        todoName,
        todoDescription,
        assignedTo,
        createdBy,
        deadline,
        prevTodo,
        todoDone,
        createdAt,
        taskList: newTaskList,
      });
      await updateDoc(currentTodo, newFields);
      const title = 'Todo Updated, your next todo has been scheduled...';
      const text = todoName;
      const type = 'todo';
      const id = todoId;
      await notifyCollab({ assignedTo, title, text, createdBy, type, id });
      return newTodo.id;
    } else if (deadline.type === 'Monthly') {
      const newTodo = await addDoc(todoRef, {
        todoName,
        todoDescription,
        assignedTo,
        createdBy,
        prevTodo,
        deadline,
        todoDone,
        createdAt,
        taskList: newTaskList,
      });
      await updateDoc(currentTodo, newFields);
      const title = 'Todo Updated, your next todo has been scheduled...';
      const text = todoName;
      const type = 'todo';
      const id = todoId;
      await notifyCollab({ assignedTo, title, text, createdBy, type, id });
      return newTodo.id;
    }
    await updateDoc(currentTodo, newFields);
    await fetchTodo(todoId);
    const title = 'Todo Updated...';
    const text = todoName;
    const type = 'todo';
    const id = todoId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    return undefined;
  } catch (error) {
    console.error(error.message);
  }
};

//Todo not complete//
export const setTodoAsInComplete = async (todoId) => {
  const todoRef = doc(firestore, 'todo', todoId);
  const todoDoc = await getDoc(todoRef);
  const todo = todoDoc.data();
  const assignedTo = todo.assignedTo;
  const createdBy = todo.createdBy;
  const todoName = todo.todoName;

  try {
    let newFields = { todoDone: false };
    await updateDoc(todoRef, newFields);
    await fetchTodo(todoId);
    const title = 'Todo Updated to incomplete';
    const text = todoName;
    const type = 'todo';
    const id = todoId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
  } catch (error) {
    console.error(error.message);
  }
};

//Update Collaboration//
export const theCollab = async ({ myArr, todoId }) => {
  const todoRef = doc(firestore, 'todo', todoId);
  const todoDoc = await getDoc(todoRef);
  const todo = todoDoc.data();
  try {
    const newFields = { assignedTo: myArr };
    await updateDoc(todoRef, newFields);
    await fetchTodo(todoId);
    const assignedTo = todo.assignedTo;
    const createdBy = todo.createdBy;
    const title = 'Todo Collob update...';
    const text = todo.todoName;
    const type = 'todo';
    const id = todoId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
  } catch (error) {
    console.error(error.message);
  }
};

//Collab on todo//
export const updateCollab = (arr) => {
  try {
    store.dispatch(setCollabCachedAdd(arr));
  } catch (error) {
    console.error(error.message);
  }
};

//Remove from collab//
export const removeFromCollab = (arr) => {
  try {
    store.dispatch(removeFromCollab(arr));
  } catch (error) {
    console.error(error.message);
  }
};

//Set todo deadline//
export const setTodoDeadline = ({ todoDeadline }) => {
  try {
    store.dispatch(setTodoDeadLine(todoDeadline));
  } catch (error) {
    console.error(error.message);
  }
};

//Remove todo deadline//
export const removeTodoDeadline = () => {
  try {
    store.dispatch(setTodoDeadLine(null));
  } catch (error) {
    console.error(error.message);
  }
};

//Update TaskList//
export const updateTaskList = (taskList) => {
  try {
    store.dispatch(setTaskList(taskList));
  } catch (error) {
    console.error(error.message);
  }
};
