import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import '../../css/VideoPlayer.css';
import { Box, Container, Avatar } from '@mui/material';
import Comment from './Comment';
import axios from 'axios';
import CommentForm from './CommentForm';
import AuthService from '../../service/auth_service';

function VideoPlay() {
    const { videoId } = useParams();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [videoInfo, setVideoInfo] = useState(undefined);
    const [videoComments, setComments] = useState([]);
    const [isLikeBtn, setIsLikeBtn] = useState(false);
    const [likeCount,setLikeCount] = useState(0);
    const currentUser = AuthService.getCurrentUser();

    async function fetchData(videoId) {
        try {
            const result = await axios.get(`/videos/${videoId}`);
            const { data } = result;

            if (data === null) {
                setNotFound(true);
                alert('Your path is error, we will return homPage');
                window.location.href = "http://localhost:4000/";
                return;
            }
            setVideoInfo(data);
            setLikeCount(data.likeCount);
            setLoading(true);
            setNotFound(false);
        } catch (e) {
            setNotFound(true);
            alert('Your path is error, we will return homPage');
            window.location.href = "http://localhost:4000/";
        } finally {
            setLoading(false);
        }
    }

    async function fetchComments(videoId) {
        try {
            const result = await axios.get(`/comments/video/${videoId}`);
            const { data, status } = result;
            if (status !== 200) {
                setNotFound(true);
                alert('There is some error, we will return homePage');
                window.location.href = "http://localhost:4000/";
                return;
            }
            setComments(data.data);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }

    async function addViewCount(videoId) {
        const params = { "videoId": videoId };
        axios.post(`/videos/addViewCount`, params).then(res => {
        }).catch(err => {
            alert("Some thing wrong, we will return homePage.")
            window.location.href = "http://localhost:4000/";
            return;
        })
    }

    async function likeBtnStatus() {
        let userId = currentUser._id;
        try {
            const result = await axios.get(`/users/${userId}`);
            const { data } = result;
            let userLiked = data.likeId;
            setIsLikeBtn(userLiked.includes(videoId));
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchData(videoId);
        fetchComments(videoId);
        addViewCount(videoId);
        likeBtnStatus();
    }, [videoId]);

    const addComment = (text) => {
        if (!currentUser) {
            alert("You need to login.")
            AuthService.logout();
            window.location.href = `http://localhost:4000/videoPlay/${videoId}`;
        }
        const params = { 'content': text, "videoId": videoId };
        axios.post(`/comments`, params).then(res => {
            setComments([...videoComments, res.data.data]);
        }).catch(err => {
            alert("You are expoired, login again plz.");
            AuthService.logout();
            window.location.href = `http://localhost:4000/videoPlay/${videoId}`;
        })
    }

    const addLike = ()=>{
        const params = { "videoId": videoId };
        axios.post(`/videos/addLikeForVideo`, params).then(res => {
            setLikeCount(likeCount+1);
            setIsLikeBtn(!isLikeBtn);
        }).catch(err => { 
            alert("You are expoired, login again plz.");
            AuthService.logout();
            window.location.href = `http://localhost:4000/videoPlay/${videoId}`;
        })
    }

    const removeLike = ()=>{
        const params = { "videoId": videoId };
        axios.post(`/videos/removeLikeForVideo`, params).then(res => {
            setLikeCount(likeCount-1);
            setIsLikeBtn(!isLikeBtn);
        }).catch(err => { 
            // AuthService.logout();
            alert("You are expoired, login again plz.");
            window.location.href = `http://localhost:4000/videoPlay/${videoId}`;
        })
    }

    if (loading || notFound) {
        return (
            <div>
                <h2>{loading ? 'Loading....' : '404 - your page not found'}</h2>
            </div>
        );
    } else if (videoInfo) {
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
                <Box mt={2} sx={{ textAlign: 'center' }}>
                    <div className="comments-title" style={{ color: 'green', display: 'inline-block' }}>
                        ViewCount:{videoInfo.viewCount}
                    </div>
                    <div className="comments-title" style={{ color: 'green', display: 'inline-block' }}>
                        LikeCount:{likeCount}
                    </div>
                    {currentUser && Boolean(isLikeBtn) ?
                        (<button className="comment-form-button" onClick={removeLike}>
                            unLike
                        </button>) :
                        (<button className="comment-form-button" onClick={addLike}>
                            Like
                        </button>)
                    }
                </Box>
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
                        {videoComments && videoComments.map((comment) => (
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
