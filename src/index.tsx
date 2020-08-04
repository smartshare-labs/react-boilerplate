import React, { useEffect, useContext, useReducer, useState } from "react";
import { render } from "react-dom";
import { ThemeProvider } from "styled-components";
import { ToastProvider } from "react-toast-notifications";
import moment from "moment-timezone";
import { AppContext } from "./store/AppContext";
import { MainReducer } from "./store/Reducer";
import "smartshare-ui/dist/index.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect as RouterRedirect,
} from "react-router-dom";

// Analytics
import ReactGA from "react-ga";
import Intercom from "react-intercom";

// Screens
import LoadingScreen from "./screens/LoadingScreen";
import Create from "./screens/Create";
import NoMatch from "./screens/NoMatch";
import Dashboard from "./screens/Dashboard";
import Redirect from "./screens/Redirect";
import Detail from "./screens/Detail";
import Signup from "./screens/Signup";
import Settings from "./screens/Settings";

// Components
import PrivateRoute from "./screens/PrivateRoute";
import NavRoute from "./components/NavRoute";

import ApiService from "./services/api/base";

// Components
import "./main.css";
import GlobalTheme from "./globalTheme";

// Global Styles
import GlobalStyles from "./GlobalStyles";

// Services
import Logger, { LogLevel } from "./services/logger";
import ConfigGlobalLoader from "./services/config";

const AppRoot = () => {
  const configGlobal = ConfigGlobalLoader.config;
  Logger.CreateLogger({
    sumoURL: "", //configGlobal.sumoURL, # TODO: ship elsewhere
    toConsole: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
    level: LogLevel.Info,
    sendIntervalMs: 20000,
    bufferSize: 1000,
  });

  Logger.info("index.js", "App startup");

  // Initialize Google Analytics
  if (configGlobal.googleAnalyticsId) {
    ReactGA.initialize(configGlobal.googleAnalyticsId);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  const initialState = useContext(AppContext);
  const [state, dispatch] = useReducer(MainReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const value = { state, dispatch };

  const setUserLocale = async () => {
    const userTimeZone = moment.tz.guess();
    return moment.tz.setDefault(userTimeZone);
  };

  const checkAuth = async () => {
    const accessToken = localStorage.getItem("authToken");
    if (accessToken) {
      ApiService.setAuthToken(accessToken);
    }

    if (accessToken !== undefined) {
      dispatch({
        type: "USER_LOGGED_IN",
        payload: {
          accessToken: accessToken,
        },
      });
    }

    setIsLoading(false);
    return;
  };

  // Set callbacks for API service
  useEffect(() => {
    ApiService.setCallbacks({
      updateCallsLoading: (value: number) => {
        dispatch({
          type: "UPDATE_CALLS_LOADING",
          payload: {
            callsLoading: value,
          },
        });
      },
    });
  }, []);

  useEffect(() => {
    checkAuth();
    setUserLocale();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AppContext.Provider value={value}>
      {configGlobal.intercomId && <Intercom appID={configGlobal.intercomId} />}
      <Router>
        <App />
      </Router>
    </AppContext.Provider>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={GlobalTheme}>
      <ToastProvider>
        <LoadingScreen />
        {/* <Navbar currentUser={name} imageSource={imageSource} /> */}
        <Switch>
          {/* <PrivateRoute exact path="/create" component={Create} /> */}
          <NavRoute exact path="/" component={Dashboard} />
          <NavRoute exact path="/create" component={Create} />
          <NavRoute exact path="/detail" component={Detail} />
          <NavRoute exact path="/settings" component={Settings} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/twitter-redirect" component={Redirect} />
          <Route component={NoMatch} />
        </Switch>
        <GlobalStyles />
      </ToastProvider>
    </ThemeProvider>
  );
};

render(<AppRoot />, document.getElementById("root"));
