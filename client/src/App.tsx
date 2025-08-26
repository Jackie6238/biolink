import { Routes, Route } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import PublicPage from './components/PublicPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;