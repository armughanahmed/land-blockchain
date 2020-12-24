import axios from 'axios'
import React, { PureComponent } from 'react'
import './GetTokens.css'
import Navbar from './Navbar'

class GetTokens extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            address: '',
            privateKey: '',
            success: '',
            message: ''
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

    async getToken(event){
        event.preventDefault();
        try{
            const obj = {
                to: this.state.address,
                private_key: this.state.privateKey
            }
            const response = await axios.post('http://localhost:4000/user/getToken',obj)
            console.log(obj);
            console.log(response);
            if(response.data.success === 1){
                this.setState({
                    success: true,
                    message: response.data.data
                })
            }
        }
        catch(e){
            console.log(e);
        }
        
    }

    showSuccess(){
        return (
            <div id="success-message">
                <p>Transaction successful!</p>
                <p>Transaction Hash: <small>{this.state.message.transactionHash}</small></p>
            </div>
        )
    }

   

    render() {
        return (
            <div className="wrapper">
                <Navbar/>
                <div className="container-fluid" id="get-token">
                    <form className="form-group" action="#" onSubmit={(e) => this.getToken(e)}>
                        <div className="row">
                            <div className="col-lg-6 offset-lg-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <label htmlFor="address">Address:</label>
                                                <input className="form-control" type="text" value={this.state.address} onChange={(e) => this.updateAddress(e)} required/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <label htmlFor="private-key">Private key:</label>
                                                <input className="form-control" type="text" value={this.state.privateKey} onChange={(e) => this.updatePrivateKey(e)} required/>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col text-center">
                                                <button className="btn btn-custom" type="submit">Get</button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                            {
                                                this.state.success === true&&
                                                this.showSuccess()
                                            }
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

export default GetTokens