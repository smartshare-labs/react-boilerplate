import React, { useState, useEffect } from "react";
import { Route, Redirect as RouterRedirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const [auth, setAuth]: any = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token !== null || undefined) {
        return setAuth(true);
      }
    } catch {
      // Do nothing
    }

    return setAuth(false);
  };

  useEffect(() => {
    checkAuth();
  }, [auth]);

  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? (
          <Component {...props} />
        ) : (
          <RouterRedirect
            to={{
              pathname: "/signup",
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
