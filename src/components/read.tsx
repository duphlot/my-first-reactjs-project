import React,{useState} from 'react'
import app from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { getDatabase, ref, set,get } from 'firebase/database';


function Read() {
    const navigate = useNavigate();
    interface Fruit {
        fruitName: string;
        fruitDefinition: string;
    }

    let [fruitArray, setFruitArray] = useState<Fruit[]>([]);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, 'nature/fruits');
        const snapshot = await get(dbRef)
        if(snapshot.exists()){
            setFruitArray(Object.values(snapshot.val()));
        } else{
            alert('No data available');
        }
    }
    return (
        <>
            <div>
                <h1>READ</h1>
                <button onClick={fetchData}> Display Data </button>
                <ul>
                    {fruitArray.map( (item, index) => (
                    <li key={index}> 
                        {item.fruitName}: {item.fruitDefinition}
                    </li>
                    ) )}
                </ul>
                <button className='button1' onClick={ () => navigate("/updateread")}>GO UPDATE READ</button> <br />
                <button className='button1' onClick={ () => navigate("/")}>GO HOMEPAGE</button>
            </div>
        </>
    )
}

export default Read