import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import '../../css/VideoPlayer.css';
import { Box, Container } from '@mui/material'
import axios from 'axios';

function VideoPlay() {

    const {videoId} = useParams();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);


    // async function fetchData(videoId) {
    //     try{
    //         const {data} = await get(`/videos/${videoId}`)
    //         if(data === null){
    //             setNotFound(true);
    //             return;
    //         }
    //     }
    // }



    return (
        <div className="App-body">
            <div width="100%" >
                <h2>Video Name:</h2>
            </div>
            <br></br>
            <div className="video-player ">
                <ReactPlayer width='1024px' height='480px' controls url="https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4">

                </ReactPlayer>
            </div>

        </div>
    );
}


export default VideoPlay;