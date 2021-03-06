import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, withRouter } from "react-router-dom";

// Passed in from parent component or from mapStateToProps
const Auth = ({ component: Component, path, loggedIn, exact }) => (
  <Route
    path={path}
    exact={exact}
    render={props =>
      !loggedIn ? (
        <Component {...props} />
      ) : (

        <Redirect to="/" />
      )
    }
  />
);

const Protected = ({ component: Component, loggedIn, ...rest }) =>{
  return (
  <Route
    {...rest}
    render={props =>
      {
        return (loggedIn ? (
        <Component {...props}  />
      ) : (

        <Redirect to="/" />)
      )}
    }
  />
);
}


// Use the isAuthenitcated slice of state to determine whether a user is logged in

const mapStateToProps = (state, ownProps) => {
  return({
     loggedIn: state.session.isAuthenticated,
    });
}

export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));

export const ProtectedRoute = withRouter(connect(mapStateToProps)(Protected));
