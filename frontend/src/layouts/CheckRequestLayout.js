import React, { PureComponent } from 'react'
import CheckRequest from '../components/CheckRequest'
import Navbar from './Navbar'
import axios from 'axios'

class CheckRequestLayout extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            requests: [],
            check: false
        }
    }

    componentDidMount(){
        this.getRequest();
    }

    checkRequest(request){
        return (
            <CheckRequest 
                reason={request.reason} 
                status={request.requestStatus}
                approval={request.requestApproval}
                notes={request.hash}
                province={request.province}
                district={request.district}
                landNumber={request.land}
            />
        )
    }

    async getRequest(){
        try{
            const response = await axios.post('http://localhost:4000/user/checkRequest');
            console.log(response);
            this.setState({
                requests: response.data.data,
                check: true
            })
        }
        catch(e){
            console.log(e);
        }
    }

    render() {
        return (
            <div className="wrapper">
                <Navbar/>
                    <div className="container-fluid">
                        { this.state.check === true&&
                            this.state.requests.map((request) => (                                           
                                this.checkRequest(request)
                            ))
                        }
                    </div>
            </div>
        )
    }

}

export default CheckRequestLayout