import './App.css';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './context/userContext';
import AppRouter from './AppRouter';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserProvider>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <AppRouter />
    </UserProvider>
  );
}

export default App;
