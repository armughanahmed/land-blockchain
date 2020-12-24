
import './App.css';
import { createBrowserHistory } from "history";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from './layouts/Login';
import Home from './layouts/Home';
import Request from './layouts/Request';
import Web3 from 'web3';

import React, { PureComponent } from 'react'
import GetTokens from './layouts/GetTokens';
import CheckRequestLayout from './layouts/CheckRequestLayout';
import Register from './layouts/Register';
import UndergroundLogin from './layouts/UndergroundLogin';
import Approval from './layouts/Approval';
import AddLand from './layouts/AddLand';
import RequestToken from './layouts/RequestToken';

class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      
    }
  }
  

  render() {
    const checkSignIn = () =>{
      const isAuthenticated = localStorage.getItem('token');
      if (isAuthenticated === null || isAuthenticated === undefined) {
          return false;
      }
      else{
        return true;
      }
    }

    const adminCheckSignIn = () =>{
      const isAdminAuthenticated = localStorage.getItem('adminToken');
      if (isAdminAuthenticated === null || isAdminAuthenticated === undefined) {
          return false;
      }
      else{
        return true;
      }
    }
    
    const PrivateRoute = ({ component: Component, ...rest }) => (
    
      <Route {...rest} render={(props) => (
        checkSignIn() ?
          <Component {...props} />
          : <Redirect to='/login' />
      )} />
    )

    const AdminRoute = ({ component: Component, ...rest }) => (
    
      <Route {...rest} render={(props) => (
        adminCheckSignIn() ?
          <Component {...props} />
          : <Redirect to='/underground' />
      )} />
    )
    
    const hist = createBrowserHistory();
    return (
        <div className="page-container">
          <div className="container-wrap">
              <Router history={hist}>
                <Switch>
                  <Route path="/login" component={Login}/>
                  <Route path="/underground" component={UndergroundLogin}/>
                  <AdminRoute path="/land" component={Approval}/>
                  <AdminRoute path="/addLand" component={AddLand}/>
                  <Route path="/register" component={Register}/>
                  <PrivateRoute path="/home" component={Home}/>
                  <PrivateRoute path="/requestToken" component={RequestToken}/>
                  <PrivateRoute path="/request" component={Request}/>
                  <PrivateRoute path="/getTokens" component={GetTokens}/>
                  <PrivateRoute path="/checkRequest" component={CheckRequestLayout}/>
                </Switch>
              </Router>
          </div>
        </div>
   
    );
  }
}

export default App