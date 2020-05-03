import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Home from './pages/Home';
import { loadAppResources } from '../redux/actions/app';
import AuthCallback from './pages/AuthCallback';
import { AppDispatch } from '../shared/types';
import AppLoader from './organisms/AppLoader';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import theme from '../config/theme';
import store from '../redux';

import Admin from './layouts/Admin';


function App () {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dispatch: AppDispatch = store.dispatch;
    const load = async (): Promise<void> => await dispatch(loadAppResources());

    load()
      .then(() => setLoading(false))
      .catch(() => setError(true));
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppLoader loading={loading} error={error}>
          <Router>
            <Switch>
              <Route exact path="/oauth/callback" component={AuthCallback}/>
              <Route path="/admin" component={Admin} />
              <Route exact path="/" component={Home}/>
            </Switch>
          </Router>
        </AppLoader>
        <CssBaseline />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
