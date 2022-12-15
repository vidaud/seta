import React, { useEffect, useState } from 'react';
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
import storageService from './services/storage.service';
import { environment } from './environments/environment';
import axios from 'axios';

//const AUTH_API = environment.baseUrl + environment.baseApplicationContext + 'v2/';

function App() {
  const [authenticated, setauthenticated] = useState<boolean | null>(null);
  // const handleClick = (e) => {
  //   e.preventDefault();
  //   axios.get(`${AUTH_API}/auth/google`, {
  //     headers: {
  //       "Access-Control-Allow-Origin": "* ",
  //       "Access-Control-Allow-Headers": "Content-Type",
  //     },
  //   })
  //     .then((res) => {
  //       window.location.assign(res.data.auth_url);
  //     })
  //     .catch((err) => console.log(err));
  //   console.log(AUTH_API);
  // };
  useEffect(() => {
    if(storageService.isLoggedIn()){
        setauthenticated(true);
        console.log(storageService.getUser());
    }
    else {
        setauthenticated(false);
    }
}, []);
  return (
    <div className="App">
      <link rel="stylesheet" href="https://unpkg.com/primeicons/primeicons.css" />
      <link rel="stylesheet" href="https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css" />
      <link rel="stylesheet" href="https://unpkg.com/primereact/resources/primereact.min.css" />
      <link rel="stylesheet" href="https://unpkg.com/primeflex@3.2.1/primeflex.min.css" />
      <BrowserRouter>
        <Routes>
          <Route path="/seta-ui" element={<Home />} />
          <Route path="/seta-ui/home" element={<Home />} />
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
