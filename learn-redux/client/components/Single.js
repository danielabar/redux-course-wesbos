import React from 'react';
import Photo from './Photo';
import Comments from './Comments';

const Single = React.createClass({
  render() {
    // destructure postId from Router/url because it's referenced several times
    // this.props.params.postId` is the post id from the url: <Route path="/view/:postId" component={Single} />
    const { postId } = this.props.params;
    // index of the post
    const i = this.props.posts.findIndex(post => post.code === postId);
    // get us the post
    const post = this.props.posts[i];
    // get the comments associated with this post, but not every post has comments
    const postComments = this.props.comments[postId] || [];
    return (
      <div className="single-photo">
        <Photo i={i} post={post} {...this.props} />
        <Comments postComments={postComments} {...this.props} />
      </div>
    );
  },
});

export default Single;
