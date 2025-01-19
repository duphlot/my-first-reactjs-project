import Navbar from "./components/Navbar";
import MainBar from './components/mainBar';

function App(){
  const marqueeText = "      Welcome to the toupi.bnb! ˚✧‧₊ Follow us on Instagram @toupi.bnb for the latest product updates and exclusive news! ˚⟡౨ৎ          ";
  
  return(
    <>
      <Navbar text ={marqueeText} />
      <MainBar />
    </>
  );
}

export default App;