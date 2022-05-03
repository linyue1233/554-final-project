import React, { useEffect, useState, useMemo } from 'react';

const CommentForm = ({ handleSubmit, submitLable }) => {
    const [content, setContent] = useState("");
    const isContentAvailable = content.length === 0;
    const onSubmit = event => {
        event.preventDefault();
        handleSubmit(content);
        setContent("");
    };


    return (
        <form onSubmit={onSubmit}>
            <label for="myComment">
            </label>
            <textarea id ="myComment" className="comment-form-textarea" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            <br></br>
            <button className="comment-form-button">{submitLable}</button>
        </form>
    )
}

export default CommentForm;