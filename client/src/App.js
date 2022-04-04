import logo from './logo.svg';
import './App.css';
import {useState} from 'react';


async function postAvatar({image, description}){
  const formData = new FormData();
  formData.append("image",image);
  formData.append("description",description);

  const result = await axios.post('/users/avatarImage',formData);
  return result.data;
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
