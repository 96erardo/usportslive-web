import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Logger from 'js-logger';
import { BoostProvider } from '@8base/boost';
import { useAppStore } from './modules/app/app-store';
import AuthCallback from './modules/auth/components/AuthCallback';
import AppLoader from './shared/components/globals/AppLoader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './shared/assets/css/toastify-override.css';

// Pages
import ProtectedRoute from './shared/components/utilities/ProtectedRoute';
// // import VisitorsRoute from './atoms/VisitorsRoute';
import Admin from './shared/components/layouts/Admin';
import Social from './shared/components/layouts/Social';

// Icons
import { ReactComponent as WhiteSoccer } from './shared/assets/images/white-soccer.svg';
import { ReactComponent as WhiteTrophy } from './shared/assets/images/white-trophy.svg';
import { ReactComponent as WhiteProfile } from './shared/assets/images/white-profile.svg';
import { ReactComponent as BlackFilter } from './shared/assets/images/black-filter.svg';
import { ReactComponent as BlueFilter } from './shared/assets/images/blue-filter.svg';

const icons = {
  WhiteSoccer,
  WhiteTrophy,
  WhiteProfile,
  BlackFilter,
  BlueFilter
};

Logger.useDefaults({ defaultLevel: Logger[process.env.REACT_APP_LOG_LEVEL] });

function App () {
  const fetchAppResources = useAppStore(state => state.fetchAppResources);

  useEffect(() => {
    fetchAppResources();
  }, [fetchAppResources]);

  return (
    <BoostProvider icons={icons}>
      <AppLoader>
        <Router>
          <Switch>
            <Route exact path="/oauth/callback" component={AuthCallback}/>
            <ProtectedRoute perform="admin-page" path="/admin" component={Admin} />
            <Route path="/" component={Social}/>
          </Switch>
        </Router>
      </AppLoader>
      <ToastContainer 
        autoClose={8000}
        position="bottom-left"
        limit={5}
      />
    </BoostProvider>
  );
}

export default App;
