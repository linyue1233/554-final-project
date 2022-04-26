import React from 'react';
import '../../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ButtonGroup, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import OneVideo from '../OneVideo';

function Classification(props) {
    let tag = props.tag;
    const [videoData, setVideoData] = useState(undefined);
    const [year, setYear] = useState(undefined);
    let videoCard = null;

    useEffect(() => {
        async function fetchData() {
            if (year) {
                const { data } = await axios.get(
                    `/videos/get5VideosByTagAndYear/${tag}/${year}`
                );
                if (data.length === 0) {
                    setVideoData(undefined);
                } else {
                    setVideoData(data);
                }
            } else {
                const { data } = await axios.get(`/videos/get5VideosByTag/${tag}`);
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
                <p className="card-text">
                    <h5 className="card-title">No Videos Found</h5>
                </p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="title text-white">
                {tag}
                <small>
                    <ButtonGroup variant="text" aria-label="text button group">
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
                        <Button>
                            <Link to={`/videos/getAllVideosByTag/${tag}/likeCount`}>All</Link>
                        </Button>
                    </ButtonGroup>
                </small>
            </h1>
            <div className="container">
                <div className="row">{videoCard}</div>
            </div>
        </div>
    );
}

export default Classification;
