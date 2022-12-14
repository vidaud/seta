import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/home/home';
import About from './pages/about/about';
import Contact from './pages/contact/contact';
import Search from './pages/search/search';
import Profile from './pages/profile/profile';
import Login from './pages/login/login';
import NotFoundPage from './pages/not-found/not-found';
import { PrivateRoute } from "./auth/private-route";
import {isLoggedIn} from './auth/auth';

// const HomeC = ()=> <h3>Logged in as {localStorage.getItem("username")}</h3>

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://unpkg.com/primeicons/primeicons.css" />
      <link rel="stylesheet" href="https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css" />
      <link rel="stylesheet" href="https://unpkg.com/primereact/resources/primereact.min.css" />
      <link rel="stylesheet" href="https://unpkg.com/primeflex@3.2.1/primeflex.min.css" />
      <BrowserRouter>
        {/* <PrivateRoute exact isloggedin={isLoggedIn()} path="/seta-ui/search" component={Search} /> */}
        <Routes>
          <Route path="/seta-ui" element={<Home />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/seta-ui/search" element={<Search />} />
          <Route path="/seta-ui/profile" element={<Profile />} />
          <Route path="/seta-ui/about" element={<About />} />
          <Route path="/seta-ui/contact" element={<Contact />} />
          <Route path="/seta-ui/login-options" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
