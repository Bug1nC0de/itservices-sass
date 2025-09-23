import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../firebse-config';
import moment from 'moment';
import { sendCollabNotification } from './client-notifications';
import store from '../../store';
import {
  setMyTodos,
  setDoneTodos,
  setCompleteAssigned,
  setAssigned,
  setMyTodo,
  setPrevTodo,
  setTexts,
  setTaskList,
  setCollabCachedAdd,
  setAssignedToDos,
  setCollabCachedRemove,
  setTodoDeadLine,
} from '../../slices/todoSlice';

//Fetch Client Todos//
export const fetchMyTodos = async (id) => {
  //   dispatch({ type: CLEAR_TODOS });
  try {
    const q = query(
      collection(firestore, 'client_todo'),
      where('createdBy.id', '==', id),
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

//Fetch Complete Todos//
export const getCompletedTodos = async (id) => {
  try {
    const q = query(
      collection(firestore, 'client_todo'),
      where('createdBy.id', '==', id),
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

//Fetch complete assigned todo's//
export const getCompleteAssignedTodos = async (id) => {
  const todoRef = collection(firestore, 'client_todo');
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
          data.assignedTo.some((user) => user.credentials === id)
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

//Fetch Assigned Todos//
export const getAssignedTodos = async (id) => {
  const todoRef = collection(firestore, 'client_todo');
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
          data.assignedTo.some((user) => user.credentials === id)
        ) {
          if (data.todoDone === false) {
            todos.push({ ...data, id: doc.id });
          }
        }
      });
      store.dispatch(setAssigned(todos));
    });
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch Todo//
export const getMyTodo = async (todoId) => {
  //   dispatch({ type: CLEAR_TODOS });
  const todoRef = doc(firestore, 'todo', todoId);

  try {
    const todoDoc = await getDoc(todoRef);
    const todo = todoDoc.data();
    let arr = todo.assignedTo;
    const prevTodo = todo.prevTodo;
    if (prevTodo !== undefined) {
      await previousTodo(prevTodo);
    }

    await fetchTodoTexts(todoId);
    updateCollab(arr);
    store.dispatch(setMyTodo(todo));
  } catch (error) {
    console.error(error.message);
  }
};

//Get Previous TODO//
export const previousTodo = async (todoId) => {
  const todoRef = doc(firestore, 'client_todo', todoId);
  try {
    const todoDoc = await getDoc(todoRef);
    const todo = todoDoc.data();
    store.dispatch(setPrevTodo(todo));
  } catch (error) {
    console.error(error.message);
  }
};

//Update Todo Colloboration//
export const updateTodoCollab = async ({ myArr, todoId }) => {
  const todoRef = doc(firestore, 'client_todo', todoId);
  const todoDoc = await getDoc(todoRef);
  const todo = todoDoc.data();
  try {
    const newFields = { assignedTo: myArr };
    await updateDoc(todoRef, newFields);
    await getMyTodo(todoId);
    const assignedTo = todo.assignedTo;
    const createdBy = todo.createdBy;
    const title = 'Todo Collob update...';
    const text = todo.todoName;
    const type = 'todo';
    const id = todoId;
    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });
  } catch (error) {
    console.error(error.message);
  }
};

//Get todo Texts//
export const fetchTodoTexts = async (todoId) => {
  const textsRef = collection(firestore, 'client_todo_text');

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

//Update todo tasklist//
export const updateTaskList = async ({ myArr, todoId }) => {
  const todoRef = doc(firestore, 'client_todo', todoId);
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

    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });
    await getMyTodo(todoId);
  } catch (error) {
    console.error(error.message);
  }
};

//Set a task as complete//
export const taskIsComplete = async ({ todoId, task, finalTask }) => {
  const todoRef = doc(firestore, 'client_todo', todoId);
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
      let res = await todoIsComplete({ todo, todoId });
      return res;
    } else {
      await getMyTodo(todoId);
      const title = 'Todo Task update...';
      const text = todo.todoName;
      const type = 'todo';
      const id = todoId;
      await sendCollabNotification({
        assignedTo,
        title,
        text,
        createdBy,
        type,
        id,
      });
      return undefined;
    }
  } catch (error) {
    console.error(error.message);
  }
};

//Set task as incomplete//
export const taskNotComplete = async ({ todoId, task, todoComplete }) => {
  const todoRef = doc(firestore, 'client_todo', todoId);
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
      await todoIsNotComplete(todoId);
    } else {
      await getMyTodo(todoId);
      const title = 'Todo updated...';
      const text = todoName;
      const type = 'todo';
      const id = todoId;
      await sendCollabNotification({
        assignedTo,
        title,
        text,
        createdBy,
        type,
        id,
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};

//Mark a todo as complete//
export const todoIsComplete = async ({ todo, todoId }) => {
  const {
    todoName,
    todoDescription,
    taskList,
    assignedTo,
    deadline,
    createdBy,
  } = todo;
  const currentTodo = doc(firestore, 'client_todo', todoId);
  const todoRef = collection(firestore, 'client_todo');
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
      await sendCollabNotification({
        assignedTo,
        title,
        text,
        createdBy,
        type,
        id,
      });

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
      await sendCollabNotification({
        assignedTo,
        title,
        text,
        createdBy,
        type,
        id,
      });
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
      await sendCollabNotification({
        assignedTo,
        title,
        text,
        createdBy,
        type,
        id,
      });
      return newTodo.id;
    }
    await updateDoc(currentTodo, newFields);
    await getMyTodo(todoId);
    const title = 'Todo Updated...';
    const text = todoName;
    const type = 'todo';
    const id = todoId;
    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });
    return undefined;
  } catch (error) {
    console.error(error.message);
  }
};

//Todo is not complete//
export const todoIsNotComplete = async (todoId) => {
  const todoRef = doc(firestore, 'client_todo', todoId);
  const todoDoc = await getDoc(todoRef);
  const todo = todoDoc.data();
  const assignedTo = todo.assignedTo;
  const createdBy = todo.createdBy;
  const todoName = todo.todoName;

  try {
    let newFields = { todoDone: false };
    await updateDoc(todoRef, newFields);
    await getMyTodo(todoId);
    const title = 'Todo Updated to incomplete';
    const text = todoName;
    const type = 'todo';
    const id = todoId;
    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });
  } catch (error) {
    console.error(error.message);
  }
};

//////////////////
//Todo Creation///
//////////////////

//Update TaskList//
export const updateTodoTaskList = (taskList) => {
  try {
    store.dispatch(setTaskList(taskList));
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

//Confirm collab//
export const confirmCollab = (user) => {
  try {
    store.dispatch(setAssignedToDos(user));
  } catch (error) {
    console.error(error.message);
  }
};

//Remove from collab//
export const removeFromCollab = (arr) => {
  try {
    store.dispatch(setCollabCachedRemove(arr));
  } catch (error) {
    console.error(error.message);
  }
};

//Set todo deadline//
export const setMyTodoDeadline = ({ todoDeadline }) => {
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
