import React from 'react';
import '../../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ButtonGroup, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import OneVideo from './VideoCard';

function Classification(props) {
    let tag = props.tag;
    const [videoData, setVideoData] = useState(undefined);
    const [year, setYear] = useState(undefined);
    let videoCard = null;

    useEffect(() => {
        async function fetchData() {
            if (year) {
                const { data } = await axios.get(
                    `/videos/get4VideosByTagAndYear/${tag}/${year}`
                );
                if (data.length === 0) {
                    setVideoData(undefined);
                } else {
                    setVideoData(data);
                }
            } else {
                const { data } = await axios.get(`/videos/get4VideosByTag/${tag}`);
                if (data.length === 0) {
                    setVideoData(undefined);
                } else {
                    setVideoData(data);
                }
            }
        }
        fetchData();
    }, [tag, year]);

    if (videoData) {
        videoCard = videoData.map((video) => {
            return <OneVideo video={video} />;
        });
    } else {
        videoCard = (
            <div className="card col">
                <p className="card-title text-center">No Videos Found</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row">
                <h1 className="title col-md-auto cap-first-letter">{tag}</h1>
                <ButtonGroup
                    className="col-md-auto"
                    variant="text"
                    aria-label="text button group"
                >
                    <Button
                        onClick={() => {
                            setYear(2022);
                        }}
                    >
                        2022
                    </Button>
                    <Button
                        onClick={() => {
                            setYear(2021);
                        }}
                    >
                        2021
                    </Button>
                    <Button
                        onClick={() => {
                            setYear(2020);
                        }}
                    >
                        2020
                    </Button>
                    <Button
                        onClick={() => {
                            window.location.href = `/videos/getAllVideosByTag/${tag}/likeCount`;
                        }}
                    >
                        All
                    </Button>
                </ButtonGroup>
            </div>
            <br />
            {/* <Grid
                key="card"
                container
                className="allVideo"
                spacing={0}
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
            >
                {videoCard}
            </Grid> */}
            <div className="row">{videoCard}</div>
        </div>
    );
}

export default Classification;
