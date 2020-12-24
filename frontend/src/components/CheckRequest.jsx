import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './CheckRequest.css'

class CheckRequest extends PureComponent {
    static propTypes = {}

    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    message(){
        return (
            <p>Incorrect</p>
        )
    }

    render() {
        return (
            <form className="form-group">
                <div className="row" id="check-request">
                    <div className="col-lg-6 offset-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <p>Reason: {this.props.reason}</p>
                                <p>Status: {this.props.status.toString()}</p>
                                <p>Hash: {this.props.notes}</p>
                                <p>Approval: {this.props.approval.toString()}</p>
                                <p>Lands:</p>
                                <ul>
                                    <li>Province: {this.props.province}</li>
                                    <li>District: {this.props.district}</li>
                                    <li>Land number: {this.props.landNumber}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

export default CheckRequest