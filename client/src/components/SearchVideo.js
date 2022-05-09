import axios, { Axios } from 'axios';
import React,{useEffect,useState} from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import '../App.css';

function SearchVideo(){
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);
const navigate = useNavigate();
    const handleChange = (e)=>{
        setSearchTerm(e.target.value);
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        navigate(`/videos/getAllVideosBySearchName/search=${searchTerm}`);
    }


    return (
        <form id = 'search' onSubmit={handleSubmit}>
            <label style={{height:"34.4px"}}>
                Search &nbsp;
                <input  autoComplete='off' type='text' name='searchTerm' placeholder='Video name' onChange = {handleChange}/>
            </label> &nbsp;
            <button className='button' type='submit'>
                Confirm
            </button>
        </form>
    );
}

export default SearchVideo;