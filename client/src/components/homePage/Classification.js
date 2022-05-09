import React from 'react';
import '../../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
        <div className="container border-bottom">
            <div className="row">
                <h3 className="title col-md-auto cap-first-letter">{tag}</h3>
                <div
                    class="btn-group col-md-auto"
                    role="group"
                    aria-label="Basic outlined example"
                >
                    <button
                        id={`${tag}-2022`}
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {
                            setYear(2022);
                            document.getElementById(`${tag}-2022`).className =
                                'btn btn-primary';
                            document.getElementById(`${tag}-2021`).className =
                                'btn btn-outline-primary';
                            document.getElementById(`${tag}-2020`).className =
                                'btn btn-outline-primary';
                        }}
                    >
                        2022
                    </button>
                    <button
                        id={`${tag}-2021`}
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {
                            setYear(2021);
                            document.getElementById(`${tag}-2021`).className =
                                'btn btn-primary';
                            document.getElementById(`${tag}-2022`).className =
                                'btn btn-outline-primary';
                            document.getElementById(`${tag}-2020`).className =
                                'btn btn-outline-primary';
                        }}
                    >
                        2021
                    </button>
                    <button
                        id={`${tag}-2020`}
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {
                            setYear(2020);
                            document.getElementById(`${tag}-2020`).className =
                                'btn btn-primary';
                            document.getElementById(`${tag}-2021`).className =
                                'btn btn-outline-primary';
                            document.getElementById(`${tag}-2022`).className =
                                'btn btn-outline-primary';
                        }}
                    >
                        2020
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {
                            window.location.href = `/videos/getAllVideosByTag/${tag}/likeCount`;
                        }}
                    >
                        All
                    </button>
                </div>
            </div>
            <br />
            <div className="row">{videoCard}</div>
            <br />
        </div>
    );
}

export default Classification;
