import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import OneVideo from './OneVideo';
import axios from 'axios';
import { Grid } from '@mui/material';

function AllVideo(props) {
    const { tag } = useParams();
    const [videoData, setVideoData] = useState(undefined);
    useEffect(() => {
        async function fetchData() {
            const data = await axios.get(`/videos/getAllVideosByTag/${tag}`);
            setVideoData(data);
        }
        fetchData();
    }, []);
    let card = null;
    if (videoData) {
        card =
            videoData.data &&
            videoData.data.map((video) => {
                return <OneVideo video={video} />;
            });
        return (
            <Grid container className="allVideo" spacing={2}>
                {card}
            </Grid>
        );
    }
}
export default AllVideo;