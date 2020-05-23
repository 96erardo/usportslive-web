import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoggerProvider from './shared/components/globals/LoggerProvider';
import * as SnackbarIcons from './shared/components/globals/snackbar-icons';
import { loadAppResources } from './shared/config/redux/actions/app';
import AuthCallback from './modules/auth/components/AuthCallback';
import { AppDispatch } from './shared/types';
import AppLoader from './shared/components/globals/AppLoader';
import { ThemeProvider } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import { SnackbarProvider } from 'notistack';
import Dialog from './shared/components/globals/Dialog';
import { CssBaseline } from '@material-ui/core';
import theme from './shared/config/theme';
import store from './shared/config/redux';

import ProtectedRoute from './shared/components/utilities/ProtectedRoute';
// import VisitorsRoute from './atoms/VisitorsRoute';
import Admin from './shared/components/layouts/Admin';
import Home from './modules/app/components/Home';

const { 
  REACT_APP_LOG_LEVEL: level
} = process.env;

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
        <SnackbarProvider 
          maxSnack={4}
          iconVariant={SnackbarIcons}
        >
          <LoggerProvider level={level}>
            <AppLoader loading={loading} error={error}>
              <Router>
                <Switch>
                  <Route exact path="/oauth/callback" component={AuthCallback}/>
                  <ProtectedRoute perform="admin-page" path="/admin" component={Admin} />
                  <Route exact path="/" component={Home}/>
                </Switch>
              </Router>
            </AppLoader>
          </LoggerProvider>
          <CssBaseline />
          <Dialog />
          <ToastContainer
            autoClose={15000}
            position="bottom-left"
          />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
