import React, { PureComponent } from 'react'
import Navbar from './Navbar'
import './Request.css'
import axios from 'axios'

class Request extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            reason: '',
            province: '',
            districts: [],
            selectedDistrict: '',
            landNumber: '',
            privateKey: '',
            lands: [],
            check: false,
            check1: false
        }
    }

    message(){
        return(
            <strong id="error">Please select the province</strong>
        )
    }

    message1(){
        return(
            <strong id="error">Please select the district</strong>
        )
    }

    view(district){
        return(
            <option value={district.district_id}>{district.name}</option>
        )
    }

    viewLand(land){
        return(
            <option value={land.land_id}>{land.land_no}</option>
        )
    }

    updateReason(event){
        this.setState({
            reason: event.target.value
        })
    }

   async updateProvince(event){
        await this.setState({
            province: event.target.value,
        })
        this.getDistrict();
    }

    updateSelectedDistrict(event){
        //console.log(event.target.value)
        this.setState({
                selectedDistrict: event.target.value,
                check1: true
            })
            this.getLand(event.target.value);
    }

    updateLandNumber(event){
        this.setState({
            landNumber: event.target.value
        })
    }

    updatePrivateKey(event){
        this.setState({
            privateKey: event.target.value
        })
    }

    async send(event){
        event.preventDefault();
        const address = localStorage.getItem('address');
        const privateKey = localStorage.getItem('privateKey');
        try{
            const obj = {
                reason: this.state.reason,
                province_id: this.state.province,
                district_id: this.state.selectedDistrict,
                land_id: this.state.landNumber,
                owner_key: this.state.privateKey,
                account: address,
                private_key: privateKey,
                ownership: privateKey,
            }
            const response = await axios.post('http://localhost:4000/user/request',obj);
            console.log(response);
            
        }
        catch(e){
            console.log(e);
        }
       
    }

    async getDistrict(){
        const obj = {
            province_id: this.state.province
        }
        console.log(obj);
        try{
            const response = await axios.post('http://localhost:4000/user/getDistrictById',obj)
            console.log(response);
            this.setState({
                districts: response.data.data,
                check: true
            })
            
        }
        catch(e){
            console.log(e);
        }
    }

    async getLand(id){
        const obj = {
            district_id : id
        }
        console.log(obj);
        try{
            const response = await axios.post('http://localhost:4000/user/getLandByDistrictId',obj)
            console.log(response);
            this.setState({
                lands: response.data.data
            })
        }
        catch(e){
            console.log(e)
        }
    }

    render() {
        return (
            <div className="wrapper">
                <Navbar/>
                <div className="container-fluid" id="request">
                    <form className="form-group" onSubmit={(e) => this.send(e)}>
                        <div className="row">
                            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <label htmlFor="reason">Reason(s)</label>
                                                <textarea className="form-control" rows="5" cols="35" value={this.state.reason} onChange={(e) => this.updateReason(e)} required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 offset-lg-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="province">Province:</label>
                                                        <select class="form-control" id="sel1" value={this.state.province} onChange={(e) => this.updateProvince(e)} required>
                                                            <option value="">Select province</option>
                                                            <option value="1">Sindh</option>
                                                            <option value="2">Punjab</option>
                                                            <option value="3">Balochistan</option>
                                                            <option value="4">Khyber pakhtunkhwa</option>
                                                        </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col">
                                            <label htmlFor="district">District:</label>
                                                        <select class="form-control" id="sel2" value={this.state.selectedDistrict} onChange={(e) => this.updateSelectedDistrict(e)} required>
                                                            <option value="">Select district</option>
                                                            {this.state.check === true&&
                                                                this.state.districts.map((district) => (
                                                                
                                                                    this.view(district)
                                                                ))
                                                            }
                                                            
                                                        </select>
                                                        {
                                                            this.state.check === false&&
                                                            this.message()
                                                        }
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="landNumber">Land number:</label>
                                                        <select class="form-control" id="sel1" value={this.state.landNumber} onChange={(e) => this.updateLandNumber(e)} required>
                                                            <option value="">Select land number</option>
                                                            {this.state.check1 === true&&
                                                                this.state.lands.map((land) => (
                                                                
                                                                    this.viewLand(land)
                                                                ))
                                                            }
                                                        </select>
                                                        {
                                                            this.state.check1 === false&&
                                                            this.message1()
                                                        }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col">
                                                <label htmlFor="private-key">Identity:</label>
                                                <input className="form-control" type="text" placeholder="Enter identity" value={this.state.privateKey} onChange={(e) => this.updatePrivateKey(e)} required/>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col text-center">
                                            <button className="btn btn-custom" type="submit">Send</button>
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

export default Request