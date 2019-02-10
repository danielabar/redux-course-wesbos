// increment like: index is index into posts array to indicate which post is being liked
// in a real app this would be post id, and reducer would be responsible for finding it in database
export function increment(index) {
  return {
    type: 'INCREMENT_LIKES',
    index,
  };
}

// add comment
export function addComment(postId, author, comment) {
  return {
    type: 'ADD_COMMENT',
    postId,
    author,
    comment,
  };
}
// remove comment: i is index into comment array of posts
export function removeComment(postId, i) {
  return {
    type: 'RENOVE_COMMENT',
    i,
    postId,
  };
}
