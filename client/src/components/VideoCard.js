import React from 'react';
import '../App.css';
import { Box, Card, CardActions, CardContent, Button, Typography } from '@mui/material';

function VideoCard(props) {
    return (
        <div className="card col">
            <img
                src={props.video.cover}
                className="card-img-top"
                alt="{props.video.name}"
            />
            <div className="card-body">
                <p className="card-text">
                    <h5 className="card-title">{props.video.videoName}</h5>
                    <p className="card-text">{props.video.description}</p>
                </p>
            </div>
        </div>
    );
}

export default VideoCard;
