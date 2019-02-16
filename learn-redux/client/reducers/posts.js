// a reducer takes in two things:
// 1. the action (info about what happened)
// 2. copy of current state

// use ES6 default parameter because first time this function runs, state won't be anything
function posts(state = [], action) {
  switch (action.type) {
    case 'INCREMENT_LIKES':
      console.log('Incrementing likes...');
      const i = action.index; // actionCreators specifies that increment action will have index data
      // return the updated state
      return [
        ...state.slice(0, i), // before the one we are updating
        { ...state[i], likes: state[i].likes + 1 }, // the post we are updating
        ...state.slice(i + 1), // after the one we are updating
      ];
    default:
      return state;
  }
}

export default posts;
