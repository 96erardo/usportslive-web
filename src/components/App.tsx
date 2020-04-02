import React from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../redux'
import Home from './pages/Home';

function App () {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
