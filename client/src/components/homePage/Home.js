import React from 'react';
import '../../App.css';
import Carousel from './Carousel';
import Classification from './Classification';

function Home() {
    return (
        <div className="container" key="home-container">
            <div className="text-center" key="carousel">
                <Carousel />
            </div>
            <br />
            <br />
            <div key="classification">
                {/* show title 'video classification' */}
                <div key="video-classification">
                    <h1 className="text-center border-bottom">Video classification</h1>
                </div>
                <br />
                <div key="action">
                    <Classification tag={'action'} />
                </div>
                <br />
                <br />
                <div key="love">
                    <Classification tag={'love'} />
                </div>
                <br />
                <br />
                <div key="thriller">
                    <Classification tag={'thriller'} />
                </div>
                <br />
                <br />
                <div key="comedy">
                    <Classification tag={'comedy'} />
                </div>
                <br />
                <br />
                <div key="documentary">
                    <Classification tag={'documentary'} />
                </div>
            </div>
        </div>
    );
}

export default Home;
