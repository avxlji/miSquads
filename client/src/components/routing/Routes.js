import React from "react";
import { Route, Switch } from "react-router-dom";

//Component imports
import Schedule from "../Schedule/Schedule";
import Landing from "../layout/Landing";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import { NotFound } from "../layout/NotFound";
import Alert from "../layout/Alert";

const Routes = () => {
  return (
    <>
      <Alert />
      <Switch>
        <Route exact path="/" component={Landing} />
        {/* <Route exact path="/schedule" component={Schedule} /> */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/schedule/:id" component={Schedule} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

export default Routes;
