import React, { PureComponent } from 'react'
import './AcceptReject.css'
import axios from 'axios'

class AcceptReject extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            request: '',
            accept: false,
            reject:false
        }
    }

    componentDidMount(){
        this.setState({
            request: this.props.request
        })
    }

     async accept(){
        const obj ={
                Rid: this.state.request.requestId,
                land_id: this.state.request.landId,
                hash: this.state.request.newHash
        }
        console.log(obj);
        try{
            const response = await axios.post('http://localhost:4000/admin/acceptRequest',obj)
            console.log(response);
            this.setState({
                accept: true
            })
            setTimeout(function(){
                window.location.reload();}, 5000);
        }
        catch(e){
            console.log(e);
        }
    }

    async reject(){
        const obj ={
                Rid: this.state.request.requestId,
        }
        console.log(obj);
        try{
            const response = await axios.post('http://localhost:4000/admin/rejectRequest',obj)
            console.log(response);
            this.setState({
                reject: true
            })
            setTimeout(function(){
                    window.location.reload();}, 5000);
        }
        catch(e){
            console.log(e);
        }
    }

    success(){
        return(
            <p id="success">Accepted sucecssfully!</p>
        )
    }

    danger(){
        return(
            <p id="danger">Rejected!</p>
        )
    }

    render() {
        return (
            <div className="row" id="accept-reject">
                <div className="col-lg-6 offset-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6">
                                    <p><strong>Request id: </strong>{this.props.request.requestId}</p>
                                    <p><strong>Reason: </strong>{this.props.request.reason}</p>
                                    <p><strong>Province: </strong>{this.props.request.province}</p>
                                </div>
                                <div className="col-lg-6">
                                    <p><strong>District: </strong>{this.props.request.district}</p>
                                    <p><strong>Land: </strong>{this.props.request.land}</p>
                                    <p><strong>Hash: </strong>{this.props.request.hash}</p>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-lg-3 offset-lg-3">
                                    <button className="btn btn-custom" onClick={(e) => this.accept(e)}>Accept</button>
                                </div>
                                <div className="col-lg-3">
                                    <button className="btn btn-danger" onClick={(e) => this.reject(e)}>Reject</button>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    {
                                        this.state.accept === true&&
                                        this.success()
                                    }
                                    {
                                        this.state.reject === true&&
                                        this.danger()
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default AcceptReject