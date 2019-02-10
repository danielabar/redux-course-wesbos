// a reducer takes in two things:
// 1. the action (info about what happened)
// 2. copy of current state

// use ES6 default parameter because first time this function runs, state won't be anything
function posts(state = [], action) {
  console.log('The post will change');
  console.log(state, action);
  return state;
}

export default posts;
