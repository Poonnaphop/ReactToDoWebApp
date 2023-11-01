import logo from './logo.svg';
import './App.css';
import Login from './Login.js';
import Credit from './Credit';
import Main from './Main';
import { Route,Routes } from 'react-router-dom';

function App() {

  return (
  <Routes>
    <Route path='/' element={<Login/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/main' element={<Main/>} />
    <Route path='/credit' element={<Credit/>} />
  </Routes>
  )
}

export default App;
