// a reducer takes in two things:
// 1. the action (info about what happened)
// 2. copy of current state
// use ES6 default parameter because first time this function runs, state won't be anything

// Handle updating comments for an individual post
// `state` is array of comments
function postComments(state = [], action) {
  switch (action.type) {
    case 'ADD_COMMENT':
      // return the new state with the new coment
      return [
        ...state,
        {
          user: action.author,
          text: action.comment,
        },
      ];
    case 'REMOVE_COMMENT':
      return [
        // from the start to the one we want to delete
        ...state.slice(0, action.i),
        // after the deleted on, to the end
        ...state.slice(action.i + 1),
      ];
    default:
      return state;
  }
}

// This handles all of `comments` state
function comments(state = [], action) {
  if (typeof action.postId !== 'undefined') {
    return {
      // take the current state
      ...state,
      // overwrite this post with a new one, use square brackets because key to object is dynamic
      // pass piece of "sub-state" to postComments -> reducer composition
      [action.postId]: postComments(state[action.postId], action),
    };
  }
  return state;
}

export default comments;
