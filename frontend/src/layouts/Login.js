
import './Login.css';
import React, { PureComponent } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router-dom'

class Login extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            userName: '',
            password: '',
            loggedIn: '',
            address: '',
            privateKey: ''
        }
    }

    updateUserName(event){
        this.setState({
            userName: event.target.value
        })
    }

    updatePassword(event){
        this.setState(
            {
                password: event.target.value
            }
        )
    }

    updateAddress(event){
        this.setState({
            address: event.target.value
        })
    }

    updatePrivateKey(event){
        this.setState({
            privateKey: event.target.value
        })
    }
    

 

    login = async (event) =>{
        event.preventDefault();
        //console.log(obj1);
        const obj = {
            email: this.state.userName,
            password: this.state.password
        }
        const response = await axios.post('http://localhost:4000/user/login',{...obj});
        console.log(response);
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('address', this.state.address);
        localStorage.setItem('privateKey', this.state.privateKey);
        if (response.data.token !== undefined) {
          this.props.history.push('/home');
          this.setState({
            loggedIn: true
          })
        }
       
        //this.props.token(response.data.token);
      }


      
   
    render() {
        if (this.state.loggedIn === true) {
            return(<Redirect to={{ pathname: '/home' }}/>)
        }
        return (
            <div className="container-fluid">
               <div className="row" id="log">
                    <div className="col-lg-6 offset-lg-3">
                        <div className="card">
                            
                                        <form className="form-group" onSubmit={(e) => this.login(e)} action="#">
                                            <div className="login">
                                                <div className="form-group"> <label for="user" className="label">Email</label> <input id="user" type="email" className="form-control" value={this.state.userName} onChange={(e) => this.updateUserName(e)} placeholder="Enter your email"/> </div>
                                                <div className="form-group"> <label for="pass" className="label">Password</label> <input id="pass" type="password" className="form-control" data-type="password" value={this.state.password} onChange={(e) => this.updatePassword(e)} placeholder="Enter your password"/> </div>
                                                <div className="form-group"> <label for="pass" className="label">Address</label> <input id="address" type="text" className="form-control" data-type="text" value={this.state.address} onChange={(e) => this.updateAddress(e)} placeholder="Enter your address"/> </div>
                                                <div className="form-group"> <label for="private-key" className="label">Private key</label> <input id="privateKey" type="text" className="form-control" data-type="text" value={this.state.privateKey} onChange={(e) => this.updatePrivateKey(e)} placeholder="Enter your private key"/> </div>
                                                <div className="form-group"> <input id="check" type="checkbox" className="check" checked /> <label for="check"><span className="icon"></span> Keep me Signed in</label> </div>
                                                <div className="row">
                                                    <div className="col text-center">
                                                        <div className="form-group"> <button type="submit" className="btn btn-custom" >Sign In</button> </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form> 
                                    </div>
                                </div>
                            </div>
                        </div>
            
        )
    }
}

export default Login