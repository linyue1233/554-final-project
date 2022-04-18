import React, {useEffect, useState} from 'react';
import '../App.css';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import { Avatar } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';

function TabPanel(props) {
    const { children, value, index } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && <div>{children}</div>}
      </div>
    );
  }

function User () {

    const [userData, setUserData] = useState(null);
    const [likedVideos, setLikedVideos] = useState(null);
    const [comments, setComments] = useState(null);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        async function fetchData() {
            try{
                setLoading(true);
                const {data} = await axios.get(`/users/${id}`);
                console.log(data);
                setUserData(data);
                setLoading(false);
            }catch(e) {
                setError(e);
                setLoading(false);
            }
        }

        fetchData();
        
    }, [id]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        
        async function getLikedVideosandComments() {
            try{
                setLoading(true);
                let likeId = userData.likeId;
                if(likeId.length !== 0){
                    let likedVideoList = [];
                    for (let id of likeId) {
                        const {data} = await axios.get(`/videos/${id}`);
                        likedVideoList.push(data);
                    }
                    setLikedVideos(likedVideoList);
                }

                let comments = userData.commentId;
                if(comments.length !== 0){
                    let commentList = [];
                    for (let id of comments) {
                        const {data} = await axios.get(`/comments/${id}`);
                        commentList.push(data);
                    }
                    setComments(commentList);
                }
                setLoading(false);
            }catch (e){
                setError(e);
                setLoading(false);
            }
            
        }


        if(userData){
            getLikedVideosandComments();
        }

    }, [userData]);// eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return <div>{error}</div>
    } else if (userData) {
        return( 
        <div>
            <Avatar alt={userData.username} src={userData.avatar} />
            <p>{userData.username}</p>
            <br/>
            <EmailIcon />
            <p>{userData.email}</p>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleChange}>
                        <Tab label="My Likes" />
                        <Tab label="My Comments" />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    {likedVideos ? likedVideos.map((video) => {
                        return <p>{video.videoName}</p>
                    }) : <p>No Likes Now</p>}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {comments ? comments.map((comment) => {
                        return <p>{comment.content}</p>
                    }): <p>No Comments Now</p>}
                </TabPanel>
            </Box>
        </div>);
    }else if(loading){
        return <p>loading</p>
    }
    
}

export default User;