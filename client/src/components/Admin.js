import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { Avatar } from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import DescriptionIcon from '@mui/icons-material/Description';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import auth_service from '../service/auth_service';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import UpdateIcon from '@mui/icons-material/Update';

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



function Admin() {

    const [videoData, setVideoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [searchVideo, setSearchVideo] = useState('');
    const [searched, setSearched] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(null);
    const [tags, setTags] = React.useState({
        action: true,
        comedy: false,
        thriller: false,
        love: false,
        documentary: false
    });
    const { action, comedy, thriller, love, documentary } = tags;
    const tagError = [action, comedy, thriller, love, documentary].filter((v) => v).length < 1;
    const [videoName, setVideoName] = useState(null);
    const [videoDescription, setVideoDescription] = useState(null);
    const [uploadVideo, setUploadVideo] = useState(null);
    const [uploadCover, setUploadCover] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [videoNameError, setVideoNameError] = useState(false);
    const [videoNameHelper, setVideoNameHelper] = useState(null);
    const [descriptionError, setDescriptionError] = useState(false);
    const [descriptionHelper, setDescriptionHelper] = useState(null);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [openDeleteVideoDialog, setOpenDeleteVideoDialog] = useState(false);

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

    const handleSearchChange = (event) => {
        setSearchVideo(event.target.value);
    };

    const handleSubmitSearch = async (event) => {
        event.preventDefault();

        try {
            setLoadingSearch(true);
            const { data } = await axios.get(`/comments/video/${searchVideo}`);
            console.log(data.data);
            setComments(data.data);
            setLoadingSearch(false);
        } catch (e) {
            setComments([]);
            if (e.response.status === 401 || e.response.status === 403) {
                auth_service.logout();
                alert('Session Expired');
                window.location.href = '/login';
            }
            setError(e);
            setLoadingSearch(false);
        }

        setSearched(true);
    }

    const handleDeleteComment = async () => {
        console.log(commentToDelete);

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
        } catch (error) {
            setLoadingDelete(false);
            console.log(error.response);
            if (error.response.status === 401 || error.response.status === 403) {
                auth_service.logout();
                alert('Session Expired');
                window.location.href = '/login';
            }
            setError(JSON.stringify(error.response.data));
            handleCloseDeleteDialog();
        }

    }

    const handleUploadVideo = async (event) => {
        event.preventDefault();

        try {

            if (videoNameError) throw videoNameHelper;
            else if (descriptionError) throw descriptionHelper;

            setLoadingUpload(true);

            const videoFormData = new FormData();

            videoFormData.append("video", uploadVideo);

            let newVideoInfo = await axios.post('/videos/uploadVideo', videoFormData);

            let newVideoPath = newVideoInfo.data.videoPath;

            console.log(newVideoPath);

            const coverFormData = new FormData();

            coverFormData.append("cover", uploadCover);

            let newCoverInfo = await axios.post('/videos/videoCover', coverFormData);

            let newCoverPath = newCoverInfo.data.imagePath;

            let checkedTags = [];

            if (tags.action) {
                checkedTags.push('action');
            }
            if (tags.comedy) {
                checkedTags.push('comedy');
            }
            if (tags.thriller) {
                checkedTags.push('thriller');
            }
            if (tags.love) {
                checkedTags.push('love');
            }
            if (tags.documentary) {
                checkedTags.push('documentary');
            }

            let newVideo = {
                name: videoName,
                description: videoDescription,
                tags: checkedTags,
                cover: newCoverPath,
                path: newVideoPath
            }

            console.log(newVideo);

            const { data } = await axios.post('/videos/create', newVideo);

            console.log(data);

            setLoadingUpload(false);

            alert('Successfully uploaded');

            window.location.reload();

        } catch (e) {
            setLoadingUpload(false);
            if (e.response) {
                if (e.response.status === 401 || e.response.status === 403) {
                    auth_service.logout();
                    alert('Session Expired');
                    window.location.href = '/login';
                } else {
                    alert(e.response.data.message);
                    window.location.reload();
                }
            } else {
                alert(e);
            }
        }

    }

    const handleChangeTags = (event) => {
        setTags({
            ...tags,
            [event.target.name]: event.target.checked,
        });
    };

    const handleVideo = (e) => {
        e.preventDefault();
        console.log(e.target.files[0]);
        setUploadVideo(e.target.files[0]);
    }

    const handleCover = (e) => {
        e.preventDefault();
        console.log(e.target.files[0]);
        setUploadCover(e.target.files[0]);
    }

    const handleVideoNameChange = (e) => {
        e.preventDefault();
        setVideoName(e.target.value);

        if (videoName && !videoName.trim()) {
            setVideoNameError(true);
            setVideoNameHelper('Video Name cannot be only empty spaces');
        } else {
            setVideoNameError(false);
            setVideoNameHelper(null);
        }
    }

    const handleDescriptionChange = (e) => {
        e.preventDefault();
        setVideoDescription(e.target.value);

        if (videoDescription && !videoDescription.trim()) {
            setDescriptionError(true);
            setDescriptionHelper('Decription cannot be only empty spaces');
        } else {
            setDescriptionError(false);
            setDescriptionHelper(null);
        }
    }

    const handleOpenDeleteVideoDialog = (video) => {
        setVideoToDelete(video);
        setOpenDeleteVideoDialog(true);
    }

    const handleCloseDeleteVideoDialog = () => {
        setVideoToDelete(null);
        setOpenDeleteVideoDialog(false);
    }

    const handleDeleteVideo = async () => {
        console.log(videoToDelete);

        try {
            setLoadingDelete(true);
            let DeleteResult = await axios.delete(`/videos/delete/${videoToDelete._id}`);

            if (DeleteResult.data === 'video has been successfully deleted') {
                let index = videoData.findIndex((x) => x._id === videoToDelete._id);
                videoData.splice(index, 1);
                setLoadingDelete(false);
                alert('Succesfully Deleted');
                handleCloseDeleteVideoDialog();
            }
        } catch (error) {
            setLoadingDelete(false);
            console.log(error.response);
            if (error.response.status === 401 || error.response.status === 403) {
                auth_service.logout();
                alert('Session Expired');
                window.location.href = '/login';
            }
            alert(JSON.stringify(error.response.data));
            handleCloseDeleteVideoDialog();
        }
    }

    useEffect(() => {

        async function checkAdmin() {
            if (await auth_service.checkAuth()) {
                let currentUser = auth_service.getCurrentUser();
                if (!currentUser.isAdmin) {
                    window.location.href = '/';
                    alert('Not Authorized');
                } else {
                    setChecking(false);
                }
            } else {
                window.location.href = '/login';
                alert('Not Logged in');
            }

            return true;
        }

        async function fetchData() {
            try {
                setLoading(true);
                const { data } = await axios.get('/videos');
                console.log(data);
                setVideoData(data);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        }

        if (checkAdmin()) fetchData();

    }, []);

    if (loading) {
        return <div><CircularProgress sx={{ m: 2 }} /></div>
    }
    else if (!loading && !checking) {
        return (
            <div className='admin-tab'>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleChange}>
                            <Tab label="Upload Videos" />
                            <Tab label="Delete Comments" />
                            <Tab label="All Videos" />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>
                        <div className='upload-form'>
                            <Paper
                                sx={{
                                    p: 2,
                                    margin: 'auto',
                                    maxWidth: 500,
                                    flexGrow: 1,
                                    backgroundColor: '#fff',
                                }}>
                                <Grid container sx={{ m: 1 }}>
                                    <form onSubmit={handleUploadVideo}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                                            <VideoLabelIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                            <TextField required error={videoNameError} id="name-input-with-sx" label="Video Name" variant="standard" helperText={videoNameHelper} onChange={handleVideoNameChange} />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                                            <DescriptionIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                            <TextField required error={descriptionError} id="description-input-with-sx" label="Description" variant="standard" helperText={descriptionHelper} onChange={handleDescriptionChange} />
                                        </Box>
                                        <Box sx={{ display: 'flex' }}>
                                            <TagIcon sx={{ color: 'action.active', mr: 1, my: 0.5, mt: 1.9 }} />
                                            <FormControl
                                                required
                                                error={tagError}
                                                component="fieldset"
                                                sx={{ ml: 0.8, mr: 2, mt: 2, mb: 1 }}
                                                variant="standard"
                                            >
                                                <FormLabel component="legend">Tags</FormLabel>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox checked={action} onChange={handleChangeTags} name="action" />
                                                        }
                                                        label="action"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox checked={comedy} onChange={handleChangeTags} name="comedy" />
                                                        }
                                                        label="comedy"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox checked={thriller} onChange={handleChangeTags} name="thriller" />
                                                        }
                                                        label="thriller"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox checked={love} onChange={handleChangeTags} name="love" />
                                                        }
                                                        label="love"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox checked={documentary} onChange={handleChangeTags} name="documentary" />
                                                        }
                                                        label="documentary"
                                                    />
                                                </FormGroup>
                                                <FormHelperText>Must pick at least one tag</FormHelperText>
                                            </FormControl>
                                        </Box>
                                        <Box sx={{ display: 'flex', mt: 1 }}>
                                            <label htmlFor="upload-video">
                                                <input
                                                    required
                                                    style={{ display: 'none' }}
                                                    onChange={handleVideo}
                                                    id="upload-video"
                                                    name="upload-video"
                                                    type="file"
                                                    accept="video/*"
                                                />
                                                <Fab
                                                    color="primary"
                                                    size="small"
                                                    component="span"
                                                    aria-label="add"
                                                    variant="extended"
                                                >
                                                    <AddIcon sx={{ mr: 0.5 }} /> Upload Video
                                                </Fab>
                                                <Typography variant="body2" sx={{ marginLeft: 1, display: "inline" }}>
                                                    {uploadVideo && uploadVideo.name}
                                                </Typography>
                                            </label>
                                        </Box>
                                        <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
                                            <label htmlFor="upload-cover">
                                                <input
                                                    required
                                                    style={{ display: 'none' }}
                                                    onChange={handleCover}
                                                    id="upload-cover"
                                                    name="upload-cover"
                                                    type="file"
                                                    accept="image/*"
                                                />
                                                <Fab
                                                    color="primary"
                                                    size="small"
                                                    component="span"
                                                    aria-label="add"
                                                    variant="extended"
                                                >
                                                    <AddIcon sx={{ mr: 0.5 }} /> Upload Cover
                                                </Fab>
                                                <Typography variant="body2" sx={{ marginLeft: 1, display: "inline" }}>
                                                    {uploadCover && uploadCover.name}
                                                </Typography>
                                            </label>
                                        </Box>
                                        <LoadingButton sx={{ marginTop: 1, marginLeft: 1, marginBottom: 1 }} variant="contained" type="submit" loading={loadingUpload}>Submit</LoadingButton>
                                    </form>
                                </Grid>
                            </Paper>
                        </div>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ minWidth: 120, marginLeft: 1.5, marginTop: 1.5 }}>
                            <Typography variant="body1" sx={{ marginTop: 1.2, marginLeft: 1, marginBottom: 1 }}>
                                Search Comments By Video:
                            </Typography>
                            <form onSubmit={handleSubmitSearch}>
                                <FormControl sx={{ width: 200 }}>
                                    <InputLabel id="video-select-label">Video</InputLabel>
                                    <Select
                                        required
                                        labelId="video-select-label"
                                        id="video-select"
                                        value={searchVideo}
                                        label="Video"
                                        onChange={handleSearchChange}
                                    >
                                        {videoData ? videoData.map((video) => {
                                            return (<MenuItem key={video._id} value={video._id}>{video.videoName}</MenuItem>);
                                        }) : <MenuItem value=''>
                                            <em>None</em>
                                        </MenuItem>}
                                    </Select>
                                </FormControl>
                                <Button sx={{ marginTop: 1.2, marginLeft: 1 }} variant="contained" type="submit">Submit</Button>
                            </form>
                        </Box>
                        {loadingSearch && <Box sx={{ display: 'flex' }}>
                            <CircularProgress sx={{ m: 2 }} />
                        </Box>}
                        {searched &&
                            <List dense={false}>
                                {comments.length !== 0 ? comments.map((comment) => {
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
                                                secondary={<React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {comment.userName}
                                                    </Typography>
                                                    {` — ${comment.date ? `${comment.date.year}/${comment.date.month}/${comment.date.day}` : null}`}
                                                </React.Fragment>}
                                            />
                                        </ListItem>
                                    );
                                }) : <div className='no-comment'>No comments Under this Video</div>}
                            </List>
                        }
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <List dense={false}>
                            {videoData.length !== 0 ? videoData.map((video) => {
                                return (
                                    <ListItem key={video._id}
                                        secondaryAction={
                                            <><IconButton sx={{ mr: 1 }} edge="end" aria-label="delete" onClick={() => handleOpenDeleteVideoDialog(video)}>
                                                <UpdateIcon />
                                            </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteVideoDialog(video)}>
                                                    <DeleteIcon />
                                                </IconButton></>
                                        }>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <OndemandVideoIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={video.videoName}
                                        />
                                    </ListItem>
                                );
                            }) : <div className='no-comment'>No Videos Now</div>}
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

                <Dialog
                    open={openDeleteVideoDialog}
                    onClose={handleCloseDeleteVideoDialog}
                    aria-labelledby="alert-delete-video-dialog-label"
                    aria-describedby="alert-delete-video-dialog-description"
                >
                    <DialogTitle id="alert-delete-video-dialog-title">
                        {"Are you Sure to Delete this video?"}
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-delete-video-dialog-description">
                            This Video will be permanently deleted.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={handleCloseDeleteVideoDialog}>Close</Button>
                        <LoadingButton loading={loadingDelete} onClick={handleDeleteVideo} autoFocus>
                            Confirm
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
    else if (!checking && error) {
        return <p>{error.message}</p>
    }

}

export default Admin;