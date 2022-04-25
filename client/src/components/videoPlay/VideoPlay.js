import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import '../../css/VideoPlayer.css';
import { Box, Container,Avatar } from '@mui/material'
import axios from 'axios';

function VideoPlay() {

    const { videoId } = useParams();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [videoInfo, setVideoInfo] = useState(null);
    const [videoComments,setComments] = useState(null);
    async function fetchData(videoId) {
        try {
            const { data } = await axios.get(`/videos/${videoId}`)
            if (data === null) {
                setNotFound(true);
                return;
            }
            setVideoInfo(data);
            setLoading(true);
            setNotFound(false);
        } catch (e) {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    }

    async function fetchComments(videoId) {
        try {
            const { data } = await axios.get(`/comments/video/${videoId}`)
            if (data === null) {
                setNotFound(true);
                return;
            }
            videoComments(data);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchData(videoId);
        fetchComments(videoId);
    }, [videoId])



    if (loading || notFound) {
        return (
            <div>
                <h2>{loading ? 'Loading....' : '404 - your page not found'}</h2>
            </div>
        );
    } else {
        return (
            <div className="App-body">
                <div width="100%" >
                    <h1 style={{color:"red"}}>Video Name: {videoInfo.videoName}</h1>
                </div>
                <br></br>
                <div className="video-player" key ={videoInfo.videoName}>
                    <ReactPlayer id ={videoInfo.videoName} width='1024px' height='480px' controls url={videoInfo.videoPath}>
                    </ReactPlayer>
                </div>
                <div width="100%" >
                    <h2 style={{color:"green"}}>Description: {videoInfo.description}</h2>
                </div>
                {/* comments part */}
                <Container maxWidth="sm">
                    <h2 style={{color:"green"}}>Comments:</h2>

                </Container>
            </div>
        )
    }
}


export default VideoPlay;