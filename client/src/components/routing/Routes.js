//general imports
import React from 'react';
import { Route, Switch } from 'react-router-dom';

//Component imports
import Schedule from '../Schedule/Schedule';
import Landing from '../layout/Landing';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';
import { NotFound } from '../layout/NotFound';
import DynamicAlert from '../layout/Alert';
import Navbar from '../layout/Navbar';
import About from '../about/About';
import UpcomingFeatures from '../about/UpcomingFeatures';
const Routes = () => {
  return (
    <>
      <Navbar></Navbar>
      <DynamicAlert />
      <Switch>
        <Route exact path="/" component={Landing} />
        {/* <Route exact path="/schedule" component={Schedule} /> */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/about" component={About} />
        <Route exact path="/upcoming-features" component={UpcomingFeatures} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/squad/:id" component={Schedule} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

export default Routes;
