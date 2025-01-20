import React, {useState} from 'react'
import app from '../firebaseConfig'
import { getDatabase, ref, set ,push} from "firebase/database";

function Write() {
    console.log("Write component rendering");
    let [inputValue1, setInputValue1] = useState('');
    let [inputValue2, setInputValue2] = useState('');
    
    const saveData = async () => {
        const db = getDatabase(app);
        const newDoc = push(ref(db, 'nature/fruits'));
        set(newDoc, {
            fruitName: inputValue1,
            fruitDefinition: inputValue2
        }).then(() => {
            alert('Data saved successfully');
        }).catch((error) => {
            alert('Failed to save data');
        })
    }

    return (
        <>
            <h1>Write Data cc c c</h1>
            <div>
                <input type="text" value={inputValue1}
                onChange={(e) => setInputValue1(e.target.value)}/>
                
                <input type="text" value={inputValue2}
                onChange={(e) => setInputValue2(e.target.value)}/>

                <button onClick={saveData}>SAVE DATA</button>
            </div>
        </>
    )
}

export default Write