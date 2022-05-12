import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Button,
    CardActions,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
const useStyles = makeStyles({
    card: {
        maxWidth: '300px',
        height: 'auto',
        marginLeft: '1%',
        marginRight: '0%',
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
        height: '225px',
        width: '300px',
    },
    button: {
        color: '#1e8678',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
function OneVideo(props) {
    const classes = useStyles();
    const videoCover = props.video.cover;
    const videoTitle = props.video.videoName;
    const videoDescription = props.video.description;
    const likeCount = props.video.likeCount;
    const viewCount = props.video.viewCount;
    const year = props.video.uploadDate.year;
    const month = props.video.uploadDate.month;
    const day = props.video.uploadDate.day;
    const videoId = props.video._id;
    const buildCard = () => {
        return (
            <Card
                className={classes.card}
                variant="outlined"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                }}
            >
                <CardMedia
                    className={classes.media}
                    component="img"
                    image={videoCover}
                    title={videoTitle}
                />
                <CardContent>
                    <Typography
                        className={classes.titleHead + ' text-truncate'}
                        gutterBottom
                        variant="h1"
                        title={`${videoTitle}`}
                        sx={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                        }}
                    >
                        {videoTitle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <FavoriteIcon fontSize="small" />
                        {likeCount}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        gutterBottom
                    >
                        <VisibilityIcon fontSize="small" />
                        {viewCount}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <DateRangeIcon fontSize="small" /> {month}/{day}/{year}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        href={`/videoPlay/${videoId}`}
                        variant="contained"
                    >
                        Play
                    </Button>
                </CardActions>
            </Card>
        );
    };
    return buildCard();
}
export default OneVideo;
