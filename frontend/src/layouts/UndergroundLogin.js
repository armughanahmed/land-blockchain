
import React, { PureComponent } from 'react'
import axios from 'axios';
import './UndergroundLogin.css';

class UndergroundLogin extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            userName: '',
            password: '',
            loggedIn: false,
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
        const response = await axios.post('http://localhost:4000/admin',{...obj});
        console.log(response);
        const { token } = response.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('privateKey', this.state.privateKey);
        localStorage.setItem('address', this.state.address);
        if (response.data.token !== undefined) {
          this.props.history.push('/land');
          this.setState({
            loggedIn: true
          })
        }
       
        //this.props.token(response.data.token);
      }


      
   
    render() {
        return (
            <div className="container-fluid" id="admin-log">
               <div className="row" >
                    <div className="col-lg-6 offset-lg-3">
                        <div className="card">
                            <h3>Admin login</h3>
                            <form className="form-group" onSubmit={(e) => this.login(e)} action="#">
                                <div className="login">
                                    <div className="form-group"> <label for="user" className="label">Email</label> <input id="user" type="email" className="form-control" value={this.state.userName} onChange={(e) => this.updateUserName(e)} placeholder="Enter your email"/> </div>
                                    <div className="form-group"> <label for="pass" className="label">Password</label> <input id="pass" type="password" className="form-control" data-type="password" value={this.state.password} onChange={(e) => this.updatePassword(e)} placeholder="Enter your password"/> </div>
                                    <div className="form-group"> <label for="private-key" className="label">Private key</label> <input id="private-key" type="text" className="form-control" data-type="password" value={this.state.privateKey} onChange={(e) => this.updatePrivateKey(e)} placeholder="Enter your private key"/> </div>
                                    <div className="form-group"> <label for="pass" className="label">Address</label> <input id="pass" type="text" className="form-control" data-type="password" value={this.state.address} onChange={(e) => this.updateAddress(e)} placeholder="Enter your address"/> </div>
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

export default UndergroundLogin