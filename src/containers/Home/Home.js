import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Login from '../../views/Login/';
import Register from '../../views/Register/';
import ConfirmRegistration from '../../views/Register/ConfirmRegistration.js';
import ResetPassword from '../../views/ResetPassword/ResetPassword'
import ConfirmReset from '../../views/ResetPassword/ConfirmReset'
import HomeHeader from '../../components/Header/Home/Header'

const mapStateToProps = state => ({
  appName: state.appName
});

class Home extends React.Component {
  render() {
    return (
      <div className="app">
        <HomeHeader/>
        <div data-reactroot className="app-body pub flex-row align-items-center">
            <Switch>
              <Route path='/private' exact component={Login} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/confirmregistration" component={ConfirmRegistration} />
              <Route path="/requestreset" component={ResetPassword} />
              <Route path="/resetpwd" component={ConfirmReset} />
            </Switch>
        </div>
      </div>
      );
  }
}

export default connect(mapStateToProps, () => ({}))(Home);
