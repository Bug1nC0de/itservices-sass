import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './store.js';

import Home from './components/Home.jsx';
import Login from './components/auth/Login.jsx';
import SignUp from './components/auth/SignUp.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import DashBoard from './components/dashboard/Dashboard.jsx';
import Helpdesk from './components/helpdesk/Helpdesk.jsx';
import Ticket from './components/helpdesk/Ticket.jsx';
import CompletedTickets from './components/helpdesk/CompletedTickets.jsx';
import Clients from './components/clients/Clients.jsx';
import Client from './components/clients/Client.jsx';
import Management from './components/management/Management.jsx';
import Projects from './components/projects/Projects.jsx';
import Project from './components/projects/Project.jsx';
import Sales from './components/sales/Sales.jsx';
import LeadInfo from './components/sales/LeadInfo.jsx';
import Todos from './components/todos/Todos.jsx';
import Todo from './components/todos/Todo.jsx';
import CompleteTodos from './components/todos/CompleteTodos.jsx';
import Suppliers from './components/suppliers/Suppliers.jsx';
import CallITServices from './components/callitservices/CallITServices.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/helpdesk" element={<Helpdesk />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/closed-tickets" element={<CompletedTickets />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client/:clientId" element={<Client />} />
        <Route path="/management" element={<Management />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/lead-info/:leadId" element={<LeadInfo />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/complete-todos" element={<CompleteTodos />} />
        <Route path="/todo/:todoId" element={<Todo />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/callitservices" element={<CallITServices />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
