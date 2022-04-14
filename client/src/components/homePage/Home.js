import React from 'react';
import '../../App.css';

function Home() {
    return (
        <div className="container-sm">
            <div
                id="carouselExampleCaptions"
                class="carousel slide"
                data-bs-ride="carousel"
            >
                <div class="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="0"
                        class="active"
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
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img
                            src="https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY5NDF8MXwxfGFsbHwxMXx8fHx8fDJ8fDE2NDk3NDQ4NDA&ixlib=rb-1.2.1&q=80&w=400"
                            class=""
                            alt="..."
                        />
                        <div class="carousel-caption d-none d-md-block">
                            <h5>First slide label</h5>
                            <p>
                                Some representative
                                placeholder content for the
                                first slide.
                            </p>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img
                            src="https://images.unsplash.com/photo-1586184059891-09ad2a30f3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY5NDF8MHwxfGFsbHwxMnx8fHx8fDJ8fDE2NDk3NDQ4NDA&ixlib=rb-1.2.1&q=80&w=400"
                            class=""
                            alt="..."
                        />
                        <div class="carousel-caption d-none d-md-block">
                            <h5>Second slide label</h5>
                            <p>
                                Some representative
                                placeholder content for the
                                second slide.
                            </p>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img
                            src="https://images.unsplash.com/photo-1649519604453-19afddd84635?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY5NDF8MHwxfGFsbHwxM3x8fHx8fDJ8fDE2NDk3NDQ4NDA&ixlib=rb-1.2.1&q=80&w=400"
                            class=""
                            alt="..."
                        />
                        <div class="carousel-caption d-none d-md-block">
                            <h5>Third slide label</h5>
                            <p>
                                Some representative
                                placeholder content for the
                                third slide.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="prev"
                >
                    <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">
                        Previous
                    </span>
                </button>
                <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="next"
                >
                    <span
                        class="carousel-control-next-icon"
                        aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">
                        Next
                    </span>
                </button>
            </div>
        </div>
    );
}

export default Home;
