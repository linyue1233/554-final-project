import '../../App.css';
import { Link } from 'react-router-dom';

function VideoCard(props) {
    let video = props.video;

    if (video) {
        return (
            <div className="card col-md-3">
                <img src={video.cover} className="card-img-top" alt={video.videoName} />
                <div className="card-body">
                    <h5 className="card-title">{video.videoName}</h5>
                    <p className="card-text">{video.description}</p>
                    <div className="row">
                        <a
                            href={`/videoPlay/${video._id}`}
                            className="btn btn-primary col-md-4"
                        >
                            Play
                        </a>
                        <div className="offset-md-4 col-md-4">
                            <p>
                                <i class="bi bi-heart">&nbsp;{video.likeCount}</i>
                                &nbsp;&nbsp;
                                <i class="bi bi-eye">&nbsp;{video.viewCount}</i>
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
