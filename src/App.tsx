// import Navbar from "./components/Navbar";
// import MainBar from './components/mainBar';
// import Admin from './components/Admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy } from "react";
const Login = lazy(() => import("./components/testLogin"));
const Navbar = lazy(() => import("./components/Navbar"));
const MainBar = lazy(() => import("./components/mainBar"));
const Admin = lazy(() => import("./components/Admin"));


function App(){
  const marqueeText = "      Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ          ";
  return(
    <>
      <Router>
        <Routes>
        <Route path="/my-first-reactjs-project/*" element={
          <>
            <Navbar text={marqueeText} />
            <MainBar />
          </>
        } />
        <Route path="/my-first-reactjs-project/admin/*" element={<Admin />} />
        <Route path="/my-first-reactjs-project/login/*" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;