import axios, { Axios } from 'axios';
import React,{useEffect,useState} from 'react';
import '../App.css';

function SearchVideo(){
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);

    const handleChange = (e)=>{
        setSearchTerm(e.target.value);
    }

    const handleSubmit = async(e)=>{
        try {
            e.preventDefault();
            let {data} = await axios(
                {
                    method: 'POST',
                    url: '/videos/search',
                    data:{
                        searchTerm: searchTerm
                    }
                }
                

            );
            setResult(data);
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