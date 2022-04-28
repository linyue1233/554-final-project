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
        // try {
        //     e.preventDefault();
        //     let {data} = await axios(
        //         {
        //             method: 'POST',
        //             url: '/videos/search',
        //             data:{
        //                 searchTerm: searchTerm
        //             }
        //         }
        //     );
        //    setResult(data);
        // } catch (e) {
        //     console.log(e);
        // }
        e.preventDefault();
        console.log("asdasdad");
         navigate(`/videos/getAllVideosBySearchName/${searchTerm}`);
        // <Link to={`/videos/getAllVideosBySearchName/${searchTerm}`}/> 
    }


    return (
        <form id = 'search' onSubmit={handleSubmit}>
            <label>
                Search
                <input autoComplete='off' type='text' name='searchTerm' onChange = {handleChange}/>
            </label>
            <button className='button' type='submit'>
                Confirm
            </button>
        </form>
    );
}

export default SearchVideo;