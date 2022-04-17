import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    card: {
        maxWidth: 250,
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #1e8678',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
    },
    titleHead: {
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold',
    },
    grid: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    media: {
        height: '100%',
        width: '100%',
    },
    button: {
        color: '#1e8678',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
function OneVideo(props) {
    const classes = useStyles();
    const [videoCover, setVideoCover] = useState(props.video.cover);
    const [videoTitle, setVideoTitle] = useState(props.video.videoName);
    const [videoDescription, setVideoDescription] = useState(props.video.description);
    const [videoId, setVideoId] = useState(props.video._id);
    const buildCard = () => {
        return (
            <Card className={classes.card} variant="outlined">
                <CardActionArea>
                    <Link to={`/video/${videoId}`}>
                        <CardMedia
                            className={classes.media}
                            component="img"
                            image={videoCover}
                            title={videoTitle}
                        />
                        <CardContent>
                            <Typography
                                className={classes.titleHead}
                                gutterBottom
                                variant="h6"
                                component="h3"
                            >
                                {videoTitle}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                            >
                                {videoDescription}
                            </Typography>
                        </CardContent>
                    </Link>
                </CardActionArea>
            </Card>
        );
    };
    return buildCard();
}
export default OneVideo;
