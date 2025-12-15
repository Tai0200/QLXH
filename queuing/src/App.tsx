import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './components/loginpage/LoginPage';
import MenuBar from './components/menubar/MenuBar';
function App() {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const receiveValue = (index: number) => {
    setActiveIndex(index);
  }
  console.log("App re - rendered!!!");
  return (
    <div>
    {localStorage.getItem('isLogined')!='true'?activeIndex==1?
    <LoginPage handleLogin={receiveValue} />:<MenuBar />:<MenuBar />}
    </div>
  );
}
export default App;
