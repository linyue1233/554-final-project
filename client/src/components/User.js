import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
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
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import AuthService from '../service/auth_service';
import Divider from '@mui/material/Divider';

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
        >
            {value === index && <div>{children}</div>}
        </div>
    );
}

function User() {

    const [userData, setUserData] = useState(null);
    const [likedVideos, setLikedVideos] = useState([]);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [loadingContent, setLoadingContent] = useState(false);
    const { id } = useParams();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [likedVideosCount, setLikedVideosCount] = useState(1);
    const [likedVideosPage, setLikedVideosPage] = useState(1);
    const [searchVideo, setSearchVideo] = useState('');
    const [videoSearchResult, setVideoSearchResult] = useState([]);
    const [searchedVideosPage, setSarchedVideosPage] = useState(1);
    const [searchedVideosPageCount, setSearchedVideosPageCount] = useState(1);
    const [videoSearched, setVideoSearched] = useState(false);
    const [searchComment, setSearchComment] = useState('');
    const [commentSearchResult, setCommentSearchResult] = useState([]);
    const [commentSearched, setCommentSearched] = useState(false);
    const [commentsPage, setCommentsPage] = useState(1);
    const [commentsPageCount, setCommentsPageCount] = useState(1);
    const [searchedCommentsPage, setSearchedCommentsPage] = useState(1);
    const [searchedCommentsPageCount, setSearchedCommentsPageCount] = useState(1);
    const [searchCommentError, setSearchCommentError] = useState(false);
    const [searchCommentHelper, setSearchCommentHelper] = useState(null);
    const [searchVideoError, setSearchVideoError] = useState(false);
    const [searchVideoHelper, setSearchVideoHelper] = useState(null);

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

    const handleLikedVideosPageChange = (event, value) => {
        event.preventDefault();
        setLikedVideosPage(value);
    }

    const handleSubmitSearchlikedVideos = (event) => {

        event.preventDefault();

        if (searchVideoError) {
            alert(searchVideoHelper);
        } else {
            setLoadingContent(true);
            let result = [];
            for (let video of likedVideos) {
                if (video.videoName.indexOf(searchVideo) !== -1) {
                    result.push(video);
                }
            }
            setVideoSearchResult(result);
            if (result.length !== 0) setSearchedVideosPageCount((result.length % 5 === 0) ? result.length / 5 : parseInt(result.length / 5) + 1);
            setVideoSearched(true);
            setLoadingContent(false);
        }
    }

    const handleSearchedVideosPageChange = (event, value) => {
        event.preventDefault();
        setSarchedVideosPage(value);
    }

    const handleSubmitSearchComment = (event) => {
        event.preventDefault();
        if (searchCommentError) {
            alert(searchCommentHelper);
        } else {
            setLoadingContent(true);
            let result = [];
            for (let comment of comments) {
                if (comment.content.indexOf(searchComment) !== -1) {
                    result.push(comment);
                }
            }
            setCommentSearchResult(result);
            if (result.length !== 0) setSearchedCommentsPageCount((result.length % 5 === 0) ? result.length / 5 : parseInt(result.length / 5) + 1)
            setCommentSearched(true);
            setLoadingContent(false);
        }
    }

    const handleCommentsPageChange = (event, value) => {
        event.preventDefault();
        setCommentsPage(value);
    }

    const handleSearchedCommentsPageChange = (event, value) => {
        event.preventDefault();
        setSearchedCommentsPage(value);
    }

    const handleBacktoAllComments = (event) => {
        setCommentSearched(false);
        setSearchComment('');
    }

    const handleBacktoAllVideos = (event) => {
        setVideoSearched(false);
        setSearchVideo('');
    }

    const handleDeleteComment = async () => {

        try {
            setLoadingDelete(true);
            let DeleteResult = await axios.delete(`/comments/${commentToDelete._id}`);

            if (DeleteResult.data === 'successfully delete this comment') {
                let index = comments.findIndex((x) => x._id === commentToDelete._id);
                comments.splice(index, 1);
                setLoadingDelete(false);
                alert('Succesfully Deleted');
                handleCloseDeleteDialog();
            }
        } catch (e) {
            setLoadingDelete(false);
            if (e.response.status === 403 || e.response.status === 401) {
                alert('Session Expired');
                AuthService.logout();
                window.location.href = '/login';
            } else {
                alert('Server Error');
            }

            handleCloseDeleteDialog();
        }

    }

    const handleSearchVideoChange = (e) => {
        e.preventDefault();
        setSearchVideo(e.target.value);

        if (searchVideo && !searchVideo.trim()) {
            setSearchVideoError(true);
            setSearchVideoHelper('Video Name cannot be only empty spaces');
        } else {
            setSearchVideoError(false);
            setSearchVideoHelper(null);
        }
    }

    const handleSearchCommentChange = (e) => {
        e.preventDefault();
        setSearchComment(e.target.value);

        if (searchComment && !searchComment.trim()) {
            setSearchCommentError(true);
            setSearchCommentHelper('Comment cannot be only empty spaces');
        } else {
            setSearchCommentError(false);
            setSearchCommentHelper(null);
        }
    }

    useEffect(() => {

        async function checkState() {
            let authStatus = await AuthService.checkAuth();
            if (!authStatus) {
                alert('Not logged in');
                window.location.href = '/login';
            } else {
                setChecking(false);
            }
        }

        checkState();
        async function fetchData() {
            try {
                setLoading(true);
                const { data } = await axios.get(`/users/${id}`);
                setUserData(data);
                setLoading(false);
            } catch (e) {
                setError(JSON.stringify(e.response.data));
                setLoading(false);
            }
        }

        fetchData();

    }, [id]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        async function getLikedVideosandComments() {
            try {
                setLoadingContent(true);
                const { data: likes } = await axios.get(`/users/AllLikedVideos/${id}`);
                setLikedVideos(likes);
                if (likes.length !== 0) setLikedVideosCount((likes.length % 5 === 0) ? likes.length / 5 : parseInt(likes.length / 5) + 1);

                const { data: comment } = await axios.get(`/comments/user/${id}`);
                if (comment !== "don't have any comments") {
                    setComments(comment);
                    setCommentsPageCount((comment.length % 5 === 0) ? comment.length / 5 : parseInt(comment.length / 5) + 1)
                }


                setLoadingContent(false);
            } catch (e) {
                setError(e);
                setLoadingContent(false);
            }
        }

        if (userData) {
            getLikedVideosandComments();
        }

    }, [userData]);// eslint-disable-line react-hooks/exhaustive-deps

    if (!checking && error) {
        return <div>{error}</div>
    } else if (!checking && userData) {
        return (
            <div className='user-content'>
                <div className='user'>
                    <h1 className='user-header'>User Profile</h1>
                    <div className='user-avatar'>
                        <Avatar sx={{ width: 48, height: 48 }} alt={userData.username} src={userData.avatar} />
                    </div>
                    <div className='user-info'>
                        {userData.username}
                        <br />
                        <EmailIcon fontSize='12px' sx={{ marginRight: 0.5 }} />
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
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item>
                                    <form onSubmit={handleSubmitSearchlikedVideos}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <Typography variant="body1" sx={{ display: "flex", mr: 2, mb: 0.4 }}>
                                                Search:
                                            </Typography>
                                            <TextField required error={searchVideoError} helperText={searchVideoHelper} id="input-with-sx" value={searchVideo} label="Video Name" variant="standard" onChange={handleSearchVideoChange} />
                                            <Button sx={{ marginTop: 1.2, marginLeft: 1 }} variant="contained" type="submit">Submit</Button>
                                        </Box>
                                    </form>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {!videoSearched && (loadingContent ? Array.from(new Array(5))
                                    : (likedVideos.length < 5 ? likedVideos : likedVideos.slice((likedVideosPage - 1) * 5, likedVideosPage * 5))).map((video, index) => (
                                        <Grid item key={index}>
                                            <Box key={index} sx={{ width: 240, marginRight: 2.5, my: 5, marginLeft: 2.5 }}>
                                                {video ? (
                                                    <Link to={`/videoPlay/${video._id}`}>
                                                        <img
                                                            style={{ width: 240, height: 180 }}
                                                            alt={video.videoName}
                                                            src={video.cover} /></Link>
                                                ) : (
                                                    <Skeleton variant="rectangular" width={240} height={180} />
                                                )}
                                                {video ? (
                                                    <Box sx={{ pr: 2 }}>
                                                        <Link className='video-link' title={video.videoName} to={`/videoPlay/${video._id}`}>{video.videoName.length > 15 ? `${video.videoName.slice(0, 15)}...`: video.videoName}</Link>
                                                        <Typography display="block" variant="caption" color="text.secondary">
                                                            {video.description.length > 30 ? `${video.description.slice(0, 30)} ....` : video.description}
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
                                        </Grid>
                                    ))}
                                {!videoSearched && !loadingContent && likedVideos.length === 0 && <p className='no-result'>No Likes, go to add some</p>}
                            </Grid>
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {videoSearched && (loadingContent ? Array.from(new Array(5))
                                    : (videoSearchResult.length < 5 ? videoSearchResult : videoSearchResult.slice((searchedVideosPage - 1) * 5, searchedVideosPage * 5))).map((video, index) => (
                                        <Grid item key={index}>
                                            <Box key={index} sx={{ width: 240, marginRight: 2.5, my: 5, marginLeft: 2.5 }}>
                                                {video ? (
                                                    <Link to={`/videoPlay/${video._id}`}>
                                                        <img
                                                            style={{ width: 240, height: 180 }}
                                                            alt={video.videoName}
                                                            src={video.cover} /></Link>
                                                ) : (
                                                    <Skeleton variant="rectangular" width={240} height={180} />
                                                )}
                                                {video ? (
                                                    <Box sx={{ pr: 2 }}>
                                                        <Link className='video-link' title={video.videoName} to={`/videoPlay/${video._id}`}>{video.videoName.length > 15 ? `${video.videoName.slice(0, 15)}...`: video.videoName}</Link>
                                                        <Typography display="block" variant="caption" color="text.secondary">
                                                            {video.description.length > 30 ? `${video.description.slice(0, 30)} ....` : video.description}
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
                                        </Grid>
                                    ))}
                                {videoSearched && !loadingContent && videoSearchResult.length === 0 && <p className='no-result'>No Videos Found</p>}
                            </Grid>
                            {videoSearched &&
                                <div className='backButton'><Button variant="text" onClick={handleBacktoAllVideos}>Back to All Videos</Button>
                                </div>
                            }
                            {!videoSearched &&
                                <div className='pagination'>
                                    <Pagination className='pagination' count={likedVideosCount} page={likedVideosPage} showFirstButton showLastButton onChange={handleLikedVideosPageChange} />
                                </div>}
                            {videoSearched &&
                                <div className='pagination'>
                                    <Pagination className='pagination' count={searchedVideosPageCount} page={searchedVideosPage} showFirstButton showLastButton onChange={handleSearchedVideosPageChange} />
                                </div>}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item>
                                    <form onSubmit={handleSubmitSearchComment}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <Typography variant="body1" sx={{ display: "flex", mr: 2, mb: 0.4 }}>
                                                Search:
                                            </Typography>
                                            <TextField required id="input-with-sx" error={searchCommentError} helperText={searchCommentHelper} value={searchComment} label="Comment" variant="standard" onChange={handleSearchCommentChange} />
                                            <Button sx={{ marginTop: 1.2, marginLeft: 1 }} variant="contained" type="submit">Submit</Button>
                                        </Box>
                                    </form>
                                </Grid>
                                <Grid item>
                                    {loadingContent && <Box sx={{ display: 'flex' }}>
                                        <CircularProgress sx={{ m: 2 }} />
                                    </Box>}
                                </Grid>
                            </Grid>

                            <List dense={false}>
                                {!commentSearched && !loadingContent && (comments.length !== 0 ? (comments.length < 5 ? comments : comments.slice((commentsPage - 1) * 5, commentsPage * 5)).map((comment) => {
                                    return (
                                        <><ListItem key={comment._id}
                                            secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(comment)}>
                                                <DeleteIcon />
                                            </IconButton>}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <CommentIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={comment.content}
                                                secondary={<React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {comment.videoId.videoName}
                                                    </Typography>
                                                    {` — ${comment.date ? `${comment.date.year}/${comment.date.month}/${comment.date.day}` : null}`}
                                                </React.Fragment>} />
                                        </ListItem><Divider variant="inset" component="li" /></>);
                                }) : <p className='no-result'>No Comments Now</p>)}
                                {(commentSearched && !loadingContent) && (commentSearchResult.length !== 0 ? (commentSearchResult.length < 5 ? commentSearchResult : commentSearchResult.slice((searchedCommentsPage - 1) * 5, searchedCommentsPage * 5)).map((comment) => {
                                    return (
                                        <><ListItem alignItems="flex-start" key={comment._id}
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
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {comment.videoId.videoName}
                                                        </Typography>
                                                        {` — ${comment.date ? `${comment.date.year}/${comment.date.month}/${comment.date.day}` : null}`}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem><Divider variant="inset" component="li" /></>
                                    );
                                }) : <p className='no-result'>No Comments Found</p>)}
                            </List>
                            {commentSearched &&
                                <div className='backButton'><Button variant="text" onClick={handleBacktoAllComments}>Back to All Comments</Button>
                                </div>
                            }
                            {!commentSearched &&
                                <div className='pagination'>
                                    <Pagination className='pagination' count={commentsPageCount} page={commentsPage} showFirstButton showLastButton onChange={handleCommentsPageChange} />
                                </div>}
                            {commentSearched &&
                                <div className='pagination'>
                                    <Pagination className='pagination' count={searchedCommentsPageCount} page={searchedCommentsPage} showFirstButton showLastButton onChange={handleSearchedCommentsPageChange} />
                                </div>}
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
                </div>
            </div>);
    } else if (loading) {
        return <div><CircularProgress sx={{ m: 2 }} /></div>
    }

}

export default User;