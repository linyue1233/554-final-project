import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import OneVideo from './OneVideo';
import axios from 'axios';
import { Grid,Box,Button,ButtonGroup } from '@mui/material';

function AllVideo() {
    const { tag } = useParams();
    const [videoData, setVideoData] = useState(undefined);
    const [type,setType] = useState('likeCount');
    useEffect(() => {
        async function fetchData() {
            const data = await axios.get(`/videos/getAllVideosByTag/${tag}/${type}`);
            setVideoData(data);
            // console.log(data);
        }
        fetchData();
    }, [tag,type]);
    const setTypeHandler = (type) => {
        setType(type);
    }

    return videoData ? (
        <Box> 
            <ButtonGroup variant="text" aria-label="text button group">
                <Button
                    onClick={() => {
                        setTypeHandler('likeCount');
                    }}
                >
                    likeCount
                </Button>
                <Button
                    onClick={() => {
                        setTypeHandler('viewCount');
                    }}
                >
                    viewCount
                </Button>
                <Button
                    onClick={() => {
                        setTypeHandler('uploadDate');
                    }}
                >
                    uploadDate
                </Button>
            </ButtonGroup>
            <Grid container className="allVideo" spacing={2}>
                {videoData.data &&
        videoData.data.map((video) => {
            return <OneVideo video={video} />})}
            </Grid>
        </Box>  
    ):(
        <div className="card col">
            <p className="card-text">
                loading...
            </p>
        </div>
    );
}
export default AllVideo;
