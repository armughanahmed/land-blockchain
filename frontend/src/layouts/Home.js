import React, { PureComponent } from 'react'
import Navbar from './Navbar'
import './Home.css'
import axios from 'axios'

class Home extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            balance: ''
        }
    }

    componentDidMount(){
        this.getTokenCount()
    }

    async getTokenCount(){
        const address = localStorage.getItem('address');
        const obj = {
            address: address
        }
        try{
            const response = await axios.post('http://localhost:4000/user/viewBalance',obj)
            console.log(response);
            this.setState({
                balance: response.data.data
            })
        }
        catch(e){
            console.log(e)
        }
    }

    render() {
        return (
            <div className="wrapper" id="home">
                  <Navbar/>
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-2 col-md-12 col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <h3>Block chain land</h3>
                                    <h5>Tokens left: {this.state.balance}</h5>
                                        <div className="row">
                                            <div className="col text-center">
                                               <a href="/request"><button className="btn btn-primary btn-sm">Request</button></a> 
                                            </div> 
                                        </div>
                                        <div className="row">
                                            <div className="col text-center">
                                                <a href="/checkRequest"><button className="btn btn-custom btn-sm mt-2">Check request</button></a> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Home