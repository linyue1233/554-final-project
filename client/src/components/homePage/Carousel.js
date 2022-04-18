import React from 'react';
import '../../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Carousel() {
    const [carouselData, setCarouselData] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            const { data } = await axios.get('/videos/get3VideosSortByLikeCount');
            console.log(data);
            setCarouselData(data);
        }
        fetchData();
    }, []);

    if (carouselData) {
        return (
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="0"
                        className="active"
                        aria-current="true"
                        aria-label="Slide 1"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="1"
                        aria-label="Slide 2"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="2"
                        aria-label="Slide 3"
                    ></button>
                </div>
                <div className="carousel-inner">
                    {carouselData.map((video, index) => {
                        return (
                            <div className={index === 0 ? ' carousel-item active' : ' carousel-item'}>
                                <img
                                    src={video.cover}
                                    alt={video.videoName}
                                    type="button"
                                    onClick={() => {
                                        window.location.href = `/video/${video._id}`;
                                    }}
                                />
                                <div className="carousel-caption d-none d-md-block">
                                    <h1>{video.videoName}</h1>
                                    <p>{video.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        );
    }
}

export default Carousel;
