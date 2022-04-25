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
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';

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
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [showComments, setShowComments] = useState(5);
    const [loading, setLoading] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
    const { id } = useParams();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    
    const handleOpenDeleteDialog = (comment) => {
        setOpenDeleteDialog(true);
        setCommentToDelete(comment);
    };
    
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setCommentToDelete(null);
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDeleteComment = async () => {
        console.log(commentToDelete);

        try{
            setLoadingDelete(true);
            let DeleteResult = await axios.delete(`/comments/${commentToDelete._id}`);
            
            if (DeleteResult.data === 'successfully delete this comment') {
                let index = comments.findIndex((x) => x.id === commentToDelete.userId);
                comments.splice(index, 1);
                setLoadingDelete(false);
                alert('Succesfully Deleted');
                handleCloseDeleteDialog();
            }
        } catch (e) {
            setLoadingDelete(false);
            alert(e.message);
            handleCloseDeleteDialog();
        }  

    }

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
                const {data: likes} = await axios.get(`/users/AllLikedVideos/${id}`);
                setLikedVideos(likes);

                const {data: comment} = await axios.get(`/comments/user/${id}`);
                setComments(comment);

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
            <div className='user-avatar'>
                <Avatar sx={{ width: 48, height: 48 }} alt={userData.username} src={userData.avatar} /> 
            </div>
            <div className='user-info'>
                {userData.username}
                <br />
                <EmailIcon fontSize='12px' sx={{marginRight: 0.5}}/> 
                {userData.email}
            </div>
            <br />
            <br />
            <br />
            <div className='user-tab'>
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
                            : (likedVideos.length < 5 ? likedVideos : likedVideos.slice( 0, 5 ))).map((video, index) => (
                            <Box key={index} sx={{ width: 210, marginRight: 2.5, my: 5, marginLeft: 2.5 }}>
                                {video ? (
                                <Link to={`/video/${video._id}`}>
                                <img
                                style={{ width: 210, height: 145 }}
                                alt={video.videoName}
                                src={video.cover}/></Link>
                                ) : (
                                <Skeleton variant="rectangular" width={210} height={145} />
                                )}
                                {video ? (
                                <Box sx={{ pr: 2 }}>
                                    <Link className='video-link' to={`/video/${video._id}`}>{video.videoName}</Link>
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
                            {likedVideos.length > 5 && <Link className="view-all-likes-link" to={`/likedVideos/${id}`}>view all</Link>}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                    <List dense={false}>
                        {comments.length !== 0 ? (comments.length < 5 ? comments : comments.slice( 0, showComments )).map((comment) => {
                        return (
                            <ListItem key={comment._id}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(comment)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                            <ListItemAvatar>
                                <Avatar>
                                    <CommentIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={comment.content}
                                secondary={comment.date ? `${comment.date.year}/${comment.date.month}/${comment.date.day}` : null}
                            />
                            </ListItem>);
                        }): <div>No Comments Now</div>}
                        {comments.length > 5 && <Button variant="text" onClick={(e) => {e.preventDefault();
                            setShowComments(showComments + 5);
                            }}>view more</Button>}
                    </List>
                    </TabPanel>
                </Box>

                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    aria-labelledby="alert-delete-dialog-label"
                    aria-describedby="alert-delete-dialog-description"
                    >
                        <DialogTitle id="alert-delete-dialog-title">
                            {"Are you Sure to Delete this comment?"}
                        </DialogTitle>
                        
                        <DialogContent>
                            <DialogContentText id="alert-delete-dialog-description">
                                This Comment will be permanently deleted.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            
                        <Button onClick={handleCloseDeleteDialog}>Close</Button>
                        <LoadingButton loading={loadingDelete} onClick={handleDeleteComment} autoFocus>
                            Confirm
                        </LoadingButton>
                        </DialogActions>
                    </Dialog>
            </div>
        </div>);
    }else if(loading){
        return <p>loading</p>
    }
    
}

export default User;