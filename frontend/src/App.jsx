import './App.css';
import Login from './pages/Login/Login'
import {Routes , Route,Navigate} from 'react-router-dom'
import Administrador from './pages/Administrador/Administrador'
import Consulta from './pages/Consulta/Consulta';
import Representante from './pages/Representante/Representante';
import Papelera from './pages/Papelera/Papelera';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/Consulta" element={<Consulta/>}></Route>
      <Route path="/Representante" element={<Representante/>}></Route>
      <Route path="/Administrador" element={<Administrador/>}></Route>
      <Route path="/Papelera" element={<Papelera/>}></Route>
      <Route path="*" element={<Navigate to="/" replace/>}></Route>
    </Routes>
  );
}

export default App;