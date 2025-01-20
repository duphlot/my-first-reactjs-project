import Navbar from "./components/Navbar";
import MainBar from './components/mainBar';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';


function App(){
  const marqueeText = "      Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ          ";
  return(
    <>
    
      {
      /* <h1>test</h1>
      <Router>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/write" element={<Write />} />
          <Route path="/read" element={<Read />} />
        </Routes>
      </Router> */}
      <Navbar text ={marqueeText} />
      <MainBar />
    </>
  );
}

export default App;