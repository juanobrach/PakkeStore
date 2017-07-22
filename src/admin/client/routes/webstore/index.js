import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import * as auth from 'lib/webstoreAuth'
import NotFound from 'routes/notFound'
import WebStoreLogin from 'routes/webstore/login'
import WebStoreAccount from 'routes/webstore/account'

const WebStoreHome = () => {
  return (
    <div>
      Apps
    </div>
  )
}

export default class WebStoreApp extends React.Component {
  componentWillMount() {
    auth.validateCurrentToken();
  }

  render() {
    return(
      <Switch>
        <Route path="/admin/webstore" exact component={WebStoreHome}/>
        <Route path="/admin/webstore/login" exact component={WebStoreLogin}/>
        <Route path="/admin/webstore/account" component={WebStoreAccount}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}