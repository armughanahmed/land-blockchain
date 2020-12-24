import './Navbar.css';
import React, { PureComponent } from 'react'

class Navbar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  render() {
    return (
      <nav className="navbar navbar-expand-xl py-md-2">
           
      <h2 className="py-md-2"><strong>Land Tracking</strong></h2>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
              <span className="navbar-toggler-icon"></span>
          </button>
      <div className="collapse navbar-collapse" id="collapsibleNavbar">
      <ul className="navbar-nav">
        <li className="nav-item py-md-2 px-3 ml-5">
          <a className="nav-link" href="/home" active>Home</a>
        </li>
        <li className="nav-item py-md-2 px-3 ml-2">
          <a className="nav-link" href="/getTokens">Get tokens</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={this.logout} ><button id="logout" className="btn">Logout</button></a>
        </li>
      </ul>
      </div>
    </nav>
    )
  }
}

export default Navbar