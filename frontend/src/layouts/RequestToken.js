import React, { PureComponent } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import './RequestToken.css'

class RequestToken extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            address: '',
            privateKey: ''
        }
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

    async requestToken(event){
        event.preventDefault();
        try{ 
        const obj = {
            to: this.state.address,
            private_key: this.state.privateKey
        }
        const response = await axios.post('http://localhost:4000/admin/addLand',obj)
        console.log(obj);
        console.log(response);
        }
        catch(e){
            console.log(e);
           }  
    }

    render() {
        return (
            <div className="wrapper">
                <Navbar/>
                <div className="container-fluid" id="request-token">
                    <form className="form-group" action="#" onSubmit={(e) => this.requestToken(e)}>
                        <div className="row">
                            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-xs-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="address">Address: </label>
                                            <input className="form-control" placeholder="Enter account address" value={this.state.address} onChange={(e) => this.updateAddress(e)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="private-key">Private key: </label>
                                            <input className="form-control" placeholder="Enter private key" value={this.state.privateKey} onChange={(e) => this.updatePrivateKey(e)} required/>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col text-center">
                                                <button className="btn btn-custom" type="submit">Request token</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>            
        )
    }
}

export default RequestToken