import React from 'react';

const Comments = React.createClass({
  renderComment(comment, i) {
    return (
      <div className="comment" key={i}>
        <p>
          <strong>{comment.user}</strong>
          {comment.text}
          <button
            className="remove-comment"
            onClick={this.props.removeComment.bind(
              null,
              this.props.params.postId,
              i
            )}
          >
            &times;
          </button>
        </p>
      </div>
    );
  },

  handleSubmit(evt) {
    // stop page from refreshing when form is submitted
    evt.preventDefault();
    // get postId from router/url
    const { postId } = this.props.params;
    // get form data from refs
    const author = this.refs.author.value;
    const comment = this.refs.comment.value;
    // dispatch action
    this.props.addComment(postId, author, comment);
    // clear out form after submission
    this.refs.commentForm.reset();
  },

  render() {
    return (
      <div className="comments">
        {this.props.postComments.map(this.renderComment)}
        <form
          ref="commentForm"
          className="comment-form"
          onSubmit={this.handleSubmit}
        >
          <input type="text" ref="author" placeholder="author" />
          <input type="text" ref="comment" placeholder="comment" />
          {/* Need submit button for enter key to submit form but don't want to see it */}
          <input type="submit" hidden />
        </form>
      </div>
    );
  },
});

export default Comments;
