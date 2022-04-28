import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import '../../css/VideoPlayer.css';
import { Box, Container, Avatar } from '@mui/material';
import Comment from './Comment';
import axios from 'axios';
import CommentForm from './CommentForm';

function VideoPlay() {
    const { videoId } = useParams();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [videoInfo, setVideoInfo] = useState(undefined);
    const [videoComments, setComments] = useState([]);

    async function fetchData(videoId) {
        try {
            const result = await axios.get(`/videos/${videoId}`);
            const { data } = result;

            if (data === null) {
                setNotFound(true);
                return;
            }
            setVideoInfo(data);
            setLoading(true);
            setNotFound(false);
        } catch (e) {
            setNotFound(true);
            alert('Your path is error');
        } finally {
            setLoading(false);
        }
    }

    async function fetchComments(videoId) {
        try {
            const { data } = await axios.get(`/comments/video/${videoId}`);
            if (data === null) {
                setNotFound(true);
                return;
            }
            setComments(data);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(videoId);
        fetchComments(videoId);
    }, [videoId]);


    const addComment = (text)=>{
        console.log('add Comment' +text);
    }


    if (loading || notFound) {
        return (
            <div>
                <h2>{loading ? 'Loading....' : '404 - your page not found'}</h2>
            </div>
        );
    } else if(videoInfo) {
        return (
            <div className="App-body">
                <div width="100%">
                    <h1 style={{ color: 'red' }}>Video Name: {videoInfo.videoName}</h1>
                </div>
                <br></br>
                <div className="video-player" key={videoInfo.videoName}>
                    <ReactPlayer
                        id={videoInfo.videoName}
                        width="1024px"
                        height="480px"
                        controls
                        url={videoInfo.videoPath}
                    ></ReactPlayer>
                </div>
                <div width="100%">
                    <h2 style={{ color: 'green' }}>
                        Description: {videoInfo.description}
                    </h2>
                </div>
                {/* comments part */}
                <div className="comments">
                    <h3 className="comments-title" style={{ color: 'green' }}>
                        Comments
                    </h3>
                    <div className="comment-form-title">Write comment</div>
                    <CommentForm submitLable="Write" handleSubmit={addComment}>

                    </CommentForm>
                    <div className="comments-container">
                        {videoComments.map((comment) => (
                            <Comment key={comment.id} comment={comment}>
                                comment.content
                            </Comment>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoPlay;
