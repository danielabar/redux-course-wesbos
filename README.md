<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Redux Course with Wes Bos](#redux-course-with-wes-bos)
  - [Setup](#setup)
  - [App Layout + Component Setup](#app-layout--component-setup)
  - [Creating our Single and PhotoGrid components](#creating-our-single-and-photogrid-components)
  - [Setting up React Router](#setting-up-react-router)
  - [Creating our Redux Store](#creating-our-redux-store)
  - [All About Redux Actions](#all-about-redux-actions)
    - [Action Creators](#action-creators)
  - [All About Redux Reducers](#all-about-redux-reducers)
  - [Integrating our Store with React Router](#integrating-our-store-with-react-router)
  - [Understanding the Reducer's Job and Dispatching Actions](#understanding-the-reducers-job-and-dispatching-actions)
  - [Accessing Dispatch and State with Redux](#accessing-dispatch-and-state-with-redux)
  - [Displaying Redux State inside our Components](#displaying-redux-state-inside-our-components)
  - [Updating State with Reducers](#updating-state-with-reducers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Redux Course with Wes Bos

NOTE: Course using older 15.x version of react, `const Whatever = React.createClass({...})` instead of newer 16.x `class Whatever extends React.Component {...}`

Also using older `react-router` instead of `react-router-dom`

## Setup

- Install React dev tools and Redux dev tools for Chrome.
- `$r` in devtools console is shortcut for whatever component is selected in React devtools tab
- eg: if redux `Provider` component is selected, can do `$r.store.getState()`
- Start with `learn-redux` directory, then `npm install`.
- Using Webpack to bundle ES6 modules.
- `npm start` runs `node devserver.js`
- `devserver.js` runs an express server on `localhost:7770`, supports hot reloading and live reloading
- For production, the `build` task makes a static file that can be uploaded to a web server

To run server: `npm start`, then browse to [http://localhost:7770/](http://localhost:7770/)

## App Layout + Component Setup

All code will be in `learn-redux/client`

Styles for app have already been provided in `styles` folder, written in Stylus.

Start by adding code to [learn-redux/client/reduxstagram.js](learn-redux/client/reduxstagram.js).

- Import react and react-dom.
- Use Webpack to import css into bundle, therefore no need to write any style tag in index.html:.

```javascript
import React from "react";
import { render } from "react-dom";
import css from "./styles/styles.styl";
```

Look at finished app to identify components:

![app components](doc-images/app-components.png "app components")

- main: choose whether to display photo grid or single
- single: composed of photo, comments

Each component will have its own js file, all component js files will be in `client/components` dir.

- `Main.js` will display header.
- Clicking on header should route to home.
- Only need `Link` from `react-router`.

## Creating our Single and PhotoGrid components

- PhotoGrid component will show all photos.
- Clicking on any one of them will show Single component to display just the selected photo.
- Main is parent component of all, will always be seeing that, but child that it displays will either be Single or PhotoGrid
- Switching out which child is being viewed is handled by react router.
- From Main, pass all props down to children:

```javascript
import React from "react";
import { Link } from "react-router";

// This is the parent view
const Main = React.createClass({
  render() {
    return (
      <div>
        <h1>
          <Link to="/">Reduxstagram</Link>
        </h1>
        {/* Child view goes here */}
        {React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
});

export default Main;
```

For above code to work, need to add react router to entrypoint `client/reduxstagram.js`.

## Setting up React Router

- Render react router to page and it will determine which components should or should not be rendered.
- Add react router and all components as dependencies of `reduxstagram.js`
- Use browserHistory for push state
- Nest Route elements for parent-child relationship in router
- Parent route with `path="/"` will match all urls starting with forward slash
- If the url is only forward slash, then nested child `IndexRoute` will be used, for this app, that's `PhotoGrid` component to be loaded as a child of Main.
- If the url is `/view/:postId`, then load `Single` component as child of Main
- To use the router, pass the router component to `render` function instead of Main component

```javascript
// Import react
import React from "react";
import { render } from "react-dom";

// Import css
import css from "./styles/style.styl";

// Import components
import Main from "./components/Main";
import PhotoGrid from "./components/PhotoGrid";
import Single from "./components/Single";

// Import react router deps
import { Router, Route, IndexRoute, browserHistory } from "react-router";

// Build router component
const router = (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={PhotoGrid} />
      <Route path="/view/:postId" component={Single} />
    </Route>
  </Router>
);

render(router, document.getElementById("root"));
```

## Creating our Redux Store

- Keep all data related to application in a _store_
- i.e. do not maintain application level data in component state
- start with `client/store.js`
- will be using `syncHistoryWithStore` to sync up store with router
- store needs root reducer, reducers will be discussed later
- initialize store with some default data, for this course, will not be using an API for simplicity
- see `client/data` dir for sample data

```javascript
import { createStore, compose } from "redux";
import { syncHistoryWithStore } from "react-router-redux";
import { browserHistory } from "react-router";

// import the root reducer
import rootReducer from "./reducers/index";

// default data
import comments from "./data/comments";
import posts from "./data/posts";

// create an object for the default data
const defaultState = {
  posts,
  comments
};

const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
```

## All About Redux Actions

Think of store as empty database or object where all data used by app will live.

Action: Something that happens in application. Examples:

- click on a photo
- load a photo
- like a photo
- delete a comment
- add a new comment

Whenever any of the above events occur -> dispatch an action.

Dispatched action is an object having two items:

1. Type of action that happened, eg: INCREMENT_LIKE, ADD_COMMENT, DELETE_COMMENT etc.
2. Payload of information needed for that action, eg: which comment was deleted, which photo should be added, who was the author etc.

### Action Creators

See `client/actions/actionCreators.js`

- For this course, all actions will be in the same file but could be split up, one per file.
- LOCATION_CHANGE also counts as an action but that's managed by `react-router-redux` which will store the location change action and all associated data in the store.

```javascript
// increment like: index is index into posts array to indicate which post is being liked
// in a real app this would be post id, and reducer would be responsible for finding it in database
export function increment(index) {
  return {
    type: "INCREMENT_LIKES",
    index
  };
}

// add comment
export function addComment(postId, author, comment) {
  return {
    type: "ADD_COMMENT",
    postId,
    author,
    comment
  };
}
// remove comment: i is index into comment array of posts
export function removeComment(postId, i) {
  return {
    type: "RENOVE_COMMENT",
    i,
    postId
  };
}
```

When action is dispatched, how does it actually update store data (aka state)? That's the job of reducers.

## All About Redux Reducers

- Think of redux action like a regular javascript event that gets fired.
- In browser, events like click, hover, scroll etc get fired, but if there is no registered event listener, then nothing will happen.
- Similarly when action is dispatched, need a reducer to handle it, otherwise, nothing happens.
- Reducers will live in `reducers` folder.
- Need a reducer for each piece of state.
- `store.js` defaultState indicates we have posts and comments in state.

A reducer is a function that takes in:

1. The action (info about what happened)
2. Copy of current state (store)

- Reducer returns a brand new copy of store, reflecting that action has been handled.
- With Redux, can only have one reducer, so multiple reducer functions such as `reducers/comments.js` and `reducers/posts.js` need to be combined into the single root reducer: `reducers/index.js`
- This root reducer is used by the store, see `store.js`.

Example reducer:

```javascript
// a reducer takes in two things:
// 1. the action (info about what happened)
// 2. copy of current state

// use ES6 default parameter because first time this function runs, state won't be anything
function posts(state = [], action) {
  console.log(state, action);
  return state;
}

export default posts;
```

Root reducer:

```javascript
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import posts from "./posts";
import comments from "./comments";

const rootReducer = combineReducers({ posts, comments, router: routerReducer });

export default rootReducer;
```

## Integrating our Store with React Router

- Need to modify `reduxstagram.js` Router component to make it aware of the store.
- Use `react-redux` which binds redux to react.
- Redux can be used with other frameworks besides react.
- Also need to import store
- Wrap Router in Provider to expose store to application.
- Provider has `store` and `history` props which are set to `store` and `history` imported from `store.js`

```javascript
// Binding that allows us to use redux with react
import { Provider } from "react-redux";
// Store: import default store and history named export
import store, { history } from "./store";

// Build router component
const router = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Main}>
        <IndexRoute component={PhotoGrid} />
        <Route path="/view/:postId" component={Single} />
      </Route>
    </Router>
  </Provider>
);
```

To verify it worked, click on Provider tag from React devtools in Chrome, will see `store` prop.
Also switch to console tab, then `$r.store.getState()` -> should see all posts and comments from state.

## Understanding the Reducer's Job and Dispatching Actions

Reducer does the actual job of editing state. How to hook up action being dispatched and reducer modifying state?

When action is dispatched, corresponding reducer is listening for it and will handle it.

First for exercise, will do manually via React devtools.

Notice top level `<Provider>` component has `store` object with `dispatch` method. Click on Provider element, then switch to console tab and manually dispatch the `INCREMENT_LIKES` action:

```javascript
$r.store.dispatch({ type: "INCREMENT_LIKES", index: 0 });
```

This invokes `posts` reducer from [posts.js](learn-redux/client/reducers/posts.js) BUT ALSO the `comments` reducer from [comments.js](learn-redux/client/reducers/comments.js).

**FOUNDATIONAL REDUX CONCEPT**

- Every time an action is dispatched, every single reducer will run.
- Reducer can choose whether to run or not based on the given action.
- Need to write logic in reducer to detect if this is an action(s) that this reducer is interested in.
- If yes, "do something", otherwise, return `state` as-is.

## Accessing Dispatch and State with Redux

How to access state (eg: all data about posts and comments) into Main or any other component?

Also, how to expose the action creator functions to buttons?

In regular React (no Redux), state would live at top level, eg App, and it gets passed down via props to every lower level component that needs it.

Redux has _connect_ - to inject needed state data at whichever level its needed.

Start at [Main Component](learn-redux/client/components/Main.js) - presentational component, just markup. Will be adding action creators and state data here.

Create new [App Component](learn-redux/client/components/App.js). But rather than createClass, will use `connect` function to build this component.

`connect` takes two functions as arguments:

1. `mapStateToProps` - expose state data via props in component.
2. `mapDispatchToProps` - expose action creators via props in component.

`connect` gets invoked with `Main` component.

```javascript
// App.js
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actionCreators from "../actions/actionCreators";
import Main from "./Main";

function mapStateToProps(state) {
  return {
    posts: state.posts,
    comments: state.comments
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
const App = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default App;
```

Edit [reduxstagram component](learn-redux/client/reduxstagram.js) to render `App` instead of `Main`.

Now in React dev tools, notice child of RouterContext is `Connect(Main)`

Clicking on `Main` component, now has Props for posts and comments, and all the action creator functions.

## Displaying Redux State inside our Components

Notice in dev tools that also `PhotoGrid` component has access to all posts and comments from state, and all actions. This is because `Main` component has:

```javascript
{
  React.cloneElement(this.props.children, this.props);
}
```

This passes props from Main down to first child.

To dump raw posts content into `PhotoGrid` component:

```javascript
// learn-redux/client/components/PhotoGrid.js
const PhotoGrid = React.createClass({
  render() {
    return (
      <div className="photo-grid">
        <h1>PhotoGrid Component TODO</h1>
        <pre>{JSON.stringify(this.props.posts, null, " ")}</pre>
      </div>
    );
  }
});
```

But rather than looping and displaying in PhotoGrid, create a new `Photo` component to dipslay just one photo. To pass all props from parent `PhotoGrid` component to child `Photo` component, use object spread operator. Also must provide a `key` property to uniquely identify each Photo. Also need to pass along index because `key` is used by React and not available as regular prop for component. Finally pass in the specific post:

```javascript
// learn-redux/client/components/PhotoGrid.js
const PhotoGrid = React.createClass({
  render() {
    return (
      <div className="photo-grid">
        {this.props.posts.map((post, i) => (
          <Photo {...this.props} key={i} i={i} post={post} />
        ))}
      </div>
    );
  }
});
```

Now in `Photo` component, display `post` details, using `Link` element from react router to make clickable link to the detail view defined in `reduxstagram.js`:

```javascript
<Route path="/view/:postId" component={Single} />
```

## Updating State with Reducers
