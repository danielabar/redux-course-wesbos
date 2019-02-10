// Import react
import React from 'react';
import { render } from 'react-dom';

// Import css
import css from './styles/style.styl';

// Import components
import Main from './components/Main';
import PhotoGrid from './components/PhotoGrid';
import Single from './components/Single';

// Import react router deps
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
// Binding that allows us to use redux with react
import { Provider } from 'react-redux';
// Store: import default store and history named export
import store, { history } from './store';

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

render(router, document.getElementById('root'));
