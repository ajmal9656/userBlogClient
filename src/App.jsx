
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import UserRoutes from './routes/UserRoutes';
import { Toaster } from 'sonner';

function App() {
 

  return (
    <>
      <Router>
        
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          
        </Routes>
      </Router>
      <Toaster position="top-center" expand={false} richColors />
      
    </>
  )
}

export default App
