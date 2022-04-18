import React from 'react';
import '../../App.css';
import Carousel from './Carousel';
import Classification from './Classification';

function Home() {
    return (
        <div className="container">
            <div className="text-center">
                <Carousel />
            </div>
            <br />
            <br />
            <div>
                <Classification tag={'action'} />
            </div>
            <br />
            <div>
                <Classification tag={'love'} />
            </div>
            <br />
            <div>
                <Classification tag={'thriller'} />
            </div>
            <br />
            <div>
                <Classification tag={'comedy'} />
            </div>
            <br />
            <div>
                <Classification tag={'documentary'} />
            </div>
        </div>
    );
}

export default Home;
