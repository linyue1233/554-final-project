import axios, { Axios } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../App.css';

function SearchVideo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async (e) => {
        // e.preventDefault();
        navigate(`/videos/getAllVideosBySearchName/search=${searchTerm}`);
        // documesnt.getElementById('search').value = '';
    };

    return (
        <div className="align-center">
            <form id="search" onSubmit={handleSubmit}>
                <div className="input-group mb-4" style={{ height: '34.4px' }}>
                    <input
                        id="search"
                        className="form-control"
                        autoComplete="off"
                        type="text"
                        name="searchTerm"
                        placeholder="Video name"
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                        onChange={handleChange}
                    />
                    <button
                        className="btn btn-secondary"
                        type="submit"
                        id="button-addon2"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SearchVideo;
