import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import OneVideo from './OneVideo';
import axios from 'axios';
import { Grid } from '@material-ui/core';

function AllVideo(props) {
    const { tag } = useParams();
    const [videolData, setVideolData] = useState(undefined);
    useEffect(() => {
        async function fetchData() {
            const data = await axios.get(`/videos/getAllVideosByTag/${tag}`);
            setVideolData(data);
        }
        fetchData();
    }, []);
    let card = null;
    if (videolData) {
        card =
            videolData.data &&
            videolData.data.map((video) => {
                return <OneVideo video={video} />;
            });
        return (
            <Grid container className="allvideo" spacing={2}>
                {card}
            </Grid>
        );
    }
}
export default AllVideo;
