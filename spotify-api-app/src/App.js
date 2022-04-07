
import './App.css';
import Logger from './containers/logger/logger'
import Dashboard from './containers/dashboard/dashboard'
const code =new URLSearchParams(window.location.search).get('code')
function App() {
  let r = (Math.random() + 1).toString(36).substring(7);
  console.log('apliakcaj start',r)
  return (
    <div className="App">
      {!code ? <Logger/>: <Dashboard code={code}/>}

    </div>
  );
}

export default App;
