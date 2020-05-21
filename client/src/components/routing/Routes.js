import React from "react";
import { Route, Switch } from "react-router-dom";

//Component imports
import Schedule from "../Schedule/Schedule";
import Landing from "../layout/Landing";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";

const Routes = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Landing} />
        {/* <Route exact path="/schedule" component={Schedule} /> */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/schedule/:id" component={Schedule} />
      </Switch>
    </>
  );
};

export default Routes;
