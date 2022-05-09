import '../../App.css';
import { Link } from 'react-router-dom';

function VideoCard(props) {
    let video = props.video;

    if (video) {
        return (
            <div className="card col-md-3 videoCard">
                <img src={video.cover} className="card-img-top" alt={video.videoName} />
                <div className="card-body">
                    <h3 className="card-title">{video.videoName}</h3>
                    <p className="card-text">{video.description}</p>
                    <div className="row justify-content-between">
                        <a
                            href={`/videoPlay/${video._id}`}
                            className="btn btn-primary col-md-auto"
                        >
                            Play
                        </a>
                        <div className="col-md-auto">
                            <p>
                                <i class="bi bi-heart">
                                    &nbsp;
                                    {video.likeCount > 1000
                                        ? parseInt(video.likeCount / 1000) + 'k+'
                                        : video.likeCount}
                                </i>
                                &nbsp;&nbsp;
                                <i class="bi bi-eye">
                                    &nbsp;
                                    {video.viewCount > 1000
                                        ? parseInt(video.viewCount / 1000) + 'k+'
                                        : video.viewCount}
                                </i>
                            </p>
                        </div>
                    </div>
                </div>

                <br />
            </div>
        );
    }
}

export default VideoCard;
