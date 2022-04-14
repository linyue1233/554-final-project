import React from 'react';
import '../../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [carouselData, setCarouselData] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            const { data } = await axios.get('/videos/get3VideosSortByLikeCount');
            setCarouselData(data);
        }
        fetchData();
    }, []);

    return <div className="container-sm"></div>;
}

export default Home;
