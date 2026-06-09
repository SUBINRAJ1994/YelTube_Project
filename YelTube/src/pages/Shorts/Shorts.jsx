import "./Shorts.css";
import { useState } from "react";
import shortsData from "../../data/shortsData";

import {
	FaThumbsUp,
	FaThumbsDown,
	FaComment,
	FaTrash,
	FaClock
} from "react-icons/fa";

const Shorts = () => {

	// INITIAL STATE
	const [shortsState, setShortsState] = useState(()=>{
		const saved=localStorage.getItem("shortsData");
		return saved ? JSON.parse(saved) : shortsData.map((video)=>({
			...video,
			likes: video.like || 0,
			dislikes: 0,
			liked: false,
			disliked: false,
			commentList: [],
			showComments: false,
			commentInput: ""
		}));
	});


	const handleLike = (id) => {

		setShortsState((prev) =>
			prev.map((short) => {

				if (short.id !== id) return short;

				let updatedShort;

				if (!short.liked) {

					updatedShort = {
						...short,
						likes: short.likes + 1,

						dislikes: short.disliked
							? short.dislikes - 1
							: short.dislikes,

						liked: true,
						disliked: false
					};

					// SAVE TO LOCAL STORAGE
					let likedVideos =
						JSON.parse(localStorage.getItem("likedVideos")) || [];

					const alreadyLiked = likedVideos.find(
						(item) => item.id === short.id
					);

					if (!alreadyLiked) {

						likedVideos.unshift(updatedShort);

						localStorage.setItem(
							"likedVideos",
							JSON.stringify(likedVideos)
						);
					}
				}

				// UNLIKE
				else {

					updatedShort = {
						...short,
						likes: short.likes - 1,
						liked: false
					};

					let likedVideos =
						JSON.parse(localStorage.getItem("likedVideos")) || [];

					likedVideos = likedVideos.filter(
						(item) => item.id !== short.id
					);

					localStorage.setItem(
						"likedVideos",
						JSON.stringify(likedVideos)
					);
				}

				return updatedShort;

			})
		);
	};

	// =========================
	// DISLIKE
	// =========================
	const handleDislike = (id) => {

		setShortsState((prev) =>
			prev.map((short) => {

				if (short.id !== id) return short;

				// DISLIKE
				if (!short.disliked) {

					let updatedShort = {
						...short,

						dislikes: short.dislikes + 1,

						likes: short.liked
							? short.likes - 1
							: short.likes,

						liked: false,
						disliked: true
					};

					// REMOVE FROM LIKED STORAGE
					let likedVideos =
						JSON.parse(localStorage.getItem("likedVideos")) || [];

					likedVideos = likedVideos.filter(
						(item) => item.id !== short.id
					);

					localStorage.setItem(
						"likedVideos",
						JSON.stringify(likedVideos)
					);

					return updatedShort;
				}

				// REMOVE DISLIKE
				else {

					return {
						...short,
						dislikes: short.dislikes - 1,
						disliked: false
					};
				}
			})
		);
	};
	const handleWatchLater = (short) => {

  let watchLater =
    JSON.parse(
      localStorage.getItem("watchLater")
    ) || [];

  const alreadyExists =
    watchLater.some(
      item => item.id === short.id
    );

  if (alreadyExists) {
    alert("Already added");
    return;
  }

  watchLater.unshift(short);

  localStorage.setItem(
    "watchLater",
    JSON.stringify(watchLater)
  );

  alert("Added to Watch Later");
};

	// =========================
	// SHOW COMMENTS
	// =========================
	const toggleComments = (id) => {

		setShortsState((prev) =>
			prev.map((short) =>

				short.id === id
					? {
						...short,
						showComments: !short.showComments
					}
					: short
			)
		);
	};

	// =========================
	// COMMENT INPUT
	// =========================
	const handleCommentChange = (id, value) => {

		setShortsState((prev) =>
			prev.map((short) =>

				short.id === id
					? {
						...short,
						commentInput: value
					}
					: short
			)
		);
	};

	// =========================
	// ADD COMMENT
	// =========================
	const addComment = (id) => {

		setShortsState((prev) =>
			prev.map((short) => {

				if (short.id !== id) return short;

				// EMPTY COMMENT BLOCK
				if (!short.commentInput.trim()) return short;

				return {
					...short,

					commentsList: [
						...short.commentsList,

						{
							id: Date.now(),
							user: "You",
							text: short.commentInput,
							likes: 0,
							dislikes: 0,
							liked: false,
							disliked: false
						}
					],

					commentInput: ""
				};
			})
		);
	};

	// =========================
	// DELETE COMMENT
	// =========================
	const deleteComment = (shortId, commentId) => {

		setShortsState((prev) =>
			prev.map((short) =>

				short.id === shortId
					? {
						...short,

						commentsList: short.commentsList.filter(
							(comment) => comment.id !== commentId
						)
					}
					: short
			)
		);
	};

	// =========================
	// LIKE COMMENT
	// =========================
	const likeComment = (shortId, commentId) => {

		setShortsState((prev) =>
			prev.map((short) => {

				if (short.id !== shortId) return short;

				return {
					...short,

					commentsList: short.commentsList.map((comment) => {

						if (comment.id !== commentId) return comment;

						if (!comment.liked) {

							return {
								...comment,
								likes: comment.likes + 1,
								dislikes: comment.disliked ? comment.dislikes - 1 : comment.dislikes,
								liked: true,
								disliked: false
							};

						} else {

							return {
								...comment,
								likes: comment.likes - 1,
								liked: false
							};
						}
					})
				};
			})
		);
	};

	// =========================
	// DISLIKE COMMENT
	// =========================
	const dislikeComment = (shortId, commentId) => {

		setShortsState((prev) =>
			prev.map((short) => {

				if (short.id !== shortId) return short;

				return {
					...short,

					commentsList: short.commentsList.map((comment) => {

						if (comment.id !== commentId) return comment;

						if (!comment.disliked) {

							return {
								...comment,
								dislikes: comment.dislikes + 1,
								likes: comment.liked ? comment.likes - 1 : comment.likes,
								disliked: true,
								liked: false
							};

						} else {

							return {
								...comment,
								dislikes: comment.dislikes - 1,
								disliked: false
							};
						}
					})
				};
			})
		);
	};

	// =========================
	// UI
	// =========================
	return (

		<div className="shorts-page">

			{shortsState.map((short) => (

				<div className="short-card" key={short.id}>

					<div className="short-video-container">

						{/* VIDEO */}
						<video
							src={short.video}
							className="short-video"
							autoPlay
							muted
							loop
							controls
						/>

						{/* ACTION BUTTONS */}
						<div className="short-actions">

							{/* LIKE */}
							<div className="action-btn-group">

								<button
									className={`action-btn ${short.liked ? "active" : ""}`}

									onClick={() => handleLike(short.id)}
								>
									<FaThumbsUp />
								</button>

								<p className="counter">
									{short.likes}
								</p>

							</div>

							{/* DISLIKE */}
							<div className="action-btn-group">

								<button
									className={`action-btn ${short.disliked ? "active" : ""}`}

									onClick={() => handleDislike(short.id)}
								>
									<FaThumbsDown />
								</button>

								<p className="counter">
									{short.dislikes}
								</p>

							</div>

							{/* COMMENT */}
							<div className="action-btn-group">

								<button
									className={`action-btn ${short.showComments ? "active" : ""}`}

									onClick={() => toggleComments(short.id)}
								>
									<FaComment />
								</button>

								<p className="counter">
									{short.commentsList.length}
								</p>

							</div>
							{/* WATCH LATER */}
							<div className="action-btn-group">
								<button
									className="action-btn"
									onClick={() => handleWatchLater(short)}	
								>
									<FaClock />
								</button>
							</div>

						</div>
					</div>

					{/* INFO */}
					<div className="short-info">

						<h3>{short.title}</h3>

					</div>

					{/* COMMENTS */}
					{short.showComments && (

						<div className="comments-section">

							{/* INPUT */}
							<div className="comment-input-box">

								<input
									type="text"

									placeholder="Add comment..."

									value={short.commentInput}

									onChange={(e) =>
										handleCommentChange(
											short.id,
											e.target.value
										)
									}

									onKeyDown={(e) => {

										if (e.key === "Enter") {

											addComment(short.id);
										}
									}}
								/>

								<button
									onClick={() => addComment(short.id)}
								>
									Post
								</button>

							</div>

							{/* COMMENTS LIST */}
							<div className="comments-list">

								{short.commentsList.length === 0 ? (

									<p className="no-comments">
										No comments yet
									</p>

								) : (

									short.commentsList.map((comment) => (

										<div
											key={comment.id}
											className="comment-item"
										>

											<div className="comment-content">

												<strong>
													{comment.user}
												</strong>

												<p>
													{comment.text}
												</p>

											</div>

											<div className="comment-actions">

												<button
													className={`comment-action-btn ${comment.liked ? "active" : ""}`}

													onClick={() => likeComment(short.id, comment.id)}
													title="Like comment"
												>
													<FaThumbsUp /> {comment.likes}
												</button>

												<button
													className={`comment-action-btn ${comment.disliked ? "active" : ""}`}

													onClick={() => dislikeComment(short.id, comment.id)}
													title="Dislike comment"
												>
													<FaThumbsDown /> {comment.dislikes}
												</button>

												<button
													className="delete-comment-btn"

													onClick={() =>
														deleteComment(
															short.id,
															comment.id
														)
													}
													title="Delete comment"
												>
													<FaTrash />
												</button>

											</div>

										</div>
									))
								)}

							</div>

						</div>
					)}

				</div>
			))}
		</div>
	);
};

export default Shorts;