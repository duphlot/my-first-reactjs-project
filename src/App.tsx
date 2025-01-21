import Navbar from "./components/Navbar";
import MainBar from './components/mainBar';
import Admin from './components/Admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App(){
  const marqueeText = "      Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ          ";
  return(
    <>
      <Router>
        <Routes>
        <Route path="/*" element={
          <>
            <Navbar text={marqueeText} />
            <MainBar />
          </>
        } />
        <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;