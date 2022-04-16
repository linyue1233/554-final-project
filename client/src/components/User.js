import React, {useEffect, useState} from 'react';
import '../App.css';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import { Avatar } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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
    const { id } = useParams();

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        async function fetchData() {
            try{
                const {data} = await axios.get(`http://localhost:4000/users/${id}`);
                console.log(data);
                setUserData(data);
            }catch(e) {
                setError(e);
            }
        }

        async function getLikedVideos() {
            let likeId = userData.likeId;
            if(likeId.length !== 0){
                let likedVideoList = [];
                for (let id of likeId) {
                    const {data} = await axios.get(`http://localhost:4000/videos/${id}`);
                    likedVideoList.push(data);
                }
                setLikedVideos(likedVideoList);
            }
        }

        async function getComments() {
            let comments = userData.commentId;
            if(comments.length !== 0){
                let commentList = [];
                for (let id of comments) {
                    const {data} = await axios.get(`http://localhost:4000/comments/${id}`);
                    commentList.push(data);
                }
                setComments(commentList);
            }
        }

        fetchData();
        getLikedVideos();
        getComments();
    }, [id]);// eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return <div>{error}</div>
    } else if (userData) {
        return( 
        <div>
            <Avatar alt={userData.name} src={userData.avatar} />
            <p>{userData.name}</p>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleChange}>
                        <Tab label="My Likes" />
                        <Tab label="My Comments" />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    {likedVideos && likedVideos.map((video) => {
                        return <p>{video.videoName}</p>
                    })}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {comments.map((comment) => {
                        return <p>{comment.content}</p>
                    })}
                </TabPanel>
            </Box>
        </div>);
    }
    
}

export default User;