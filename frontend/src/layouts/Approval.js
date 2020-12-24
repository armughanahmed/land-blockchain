import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AcceptReject from '../components/AcceptReject'
import AdminNav from './AdminNav'
import axios from 'axios'
import './Approval.css'

class Approval extends PureComponent {
    static propTypes = {}

    constructor(props) {
        super(props)

        this.state = {
            requests: [],
            check: false
        }
    }

    showRequest(request)
    {
        return(
            <AcceptReject request={request}/>
        )
    }

    componentDidMount(){
        this.getRequest()
    }
    async getRequest(){
        try{
            const response = await axios.post('http://localhost:4000/admin/checkRequest');
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

    no(){
        return(
            <p id="no">No requests found</p>
        )
    }

    render() {
        return (
            <div className="wrapper">
                <AdminNav/>
                    <div className="container-fluid">
                        {
                            this.state.requests.length === 0 && 
                            this.no()    
                            
                        }
                        {   this.state.check === true&&
                            this.state.requests.map((request) => (                                           
                                this.showRequest(request)
                            ))
                        }
                    </div>
            </div>
        )
    }
}

export default Approval