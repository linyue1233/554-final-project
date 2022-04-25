import axios, { Axios } from 'axios';
import React,{useEffect,useState} from 'react';
import '../App.css';

function SearchVideo(){
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);

    const handleChange = (e)=>{
        console.log(3);
        setSearchTerm(e.target.value);
        console.log(4);
    }

    const handleSubmit = async(e)=>{
        try {
            e.preventDefault();
            console.log(1);
            let {data} = await axios(
                {
                    method: 'POST',
                    url: '/videos/search',
                    data:{
                        searchTerm: searchTerm
                    }
                }
                

            );
            console.log(2);
            setResult(data);
            console.log("data");
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <form id = 'search' onSubmit={handleSubmit}>
            <label>
                Search
                <input autoComplete='off' type='text' name='searchTerm' onChange = {handleChange}/>
            </label>
            <button className='button' type='submit'>
                Comfirm
            </button>
        </form>
    );
}

export default SearchVideo;