import React, { useState } from 'react';
import '../App.css';

function SearchVideo() {
    const [searchTerm, setSearchTerm] = useState('');
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleSubmit = async (e) => {
        if(searchTerm===''){
            window.location.href= '/';
            setSearchTerm('');
            return;
        }else{
            window.location.href= `/videos/getAllVideosBySearchName/${searchTerm}`;
            setSearchTerm('');
            return;
        }
    };

    return (
        <div className="align-center">
                <div className="input-group mb-4" style={{ height: '34.4px' }}>
                    <input
                        id="searchVideo"
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
                        onClick={handleSubmit}
                    >
                        Search
                    </button>
                </div>
        </div>
    );
}

export default SearchVideo;
