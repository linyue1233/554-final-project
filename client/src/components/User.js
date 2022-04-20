import React, {useEffect, useState} from 'react';
import '../App.css';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import { Avatar } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

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
    const [likedVideos, setLikedVideos] = useState([]);
    const [comments, setComments] = useState(null);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
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
                setLoadingContent(true);
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
                setLoadingContent(false);
            }catch (e){
                setError(e);
                setLoadingContent(false);
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
        <div className='user-content'>
            <Avatar alt={userData.username} src={userData.avatar} /> {userData.username}
            <br/>
            <EmailIcon /> {userData.email}
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleChange}>
                        <Tab label="My Likes" />
                        <Tab label="My Comments" />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                <Grid container wrap="nowrap">
                    {(loadingContent ? Array.from(new Array(5))  
                    : likedVideos).map((video, index) => (
                    <Box key={index} sx={{ width: 210, marginRight: 5.5, my: 5 }}>
                        {video ? (
                        <Link to={`/video/${video._id}`}>
                        <img
                        style={{ width: 210, height: 118 }}
                        alt={video.videoName}
                        src={video.cover}/></Link>
                        ) : (
                        <Skeleton variant="rectangular" width={210} height={118} />
                        )}
                        {video ? (
                        <Box sx={{ pr: 2 }}>
                            <Typography gutterBottom variant="body2">
                                <Link className='likedVideoLink' to={`/video/${video._id}`}>{video.videoName}</Link>
                            </Typography>
                        <Typography display="block" variant="caption" color="text.secondary">
                            {video.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {`${video.viewCount} views • ${video.uploadDate.year}/${video.uploadDate.month}/${video.uploadDate.day}`}
                        </Typography>
                        </Box>
                        ) : (
                        <Box sx={{ pt: 0.5 }}>
                            <Skeleton />
                            <Skeleton width="60%" />
                        </Box>
                        )}
                        </Box>
                    ))}
                    {!loadingContent && likedVideos.length === 0 && <div>No Likes, go to add some</div>}
                    {likedVideos.length > 5 && <Link>view all</Link>}
                </Grid>
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