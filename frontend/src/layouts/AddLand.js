import React, { PureComponent } from 'react'
import './AddLand.css'
import AdminNav from './AdminNav'
import axios from 'axios'

class AddLand extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            districts: [],
            selectedDistrict: '',
            area: '',
            blockNumber: '',
            landNumber: '',
            ownerKey: '',
            check: false
        }
    }

    componentDidMount(){
        this.getDistrict();
    }

    updateOwnerKey(event){
        this.setState({
            ownerKey: event.target.value
        })
    }

    updateSelectedDistrict(event){
        this.setState({
            selectedDistrict: event.target.value
        })
    }

    updateArea(event){
        this.setState({
            area: event.target.value
        })
    }

    updateBlockNumber(event){
        this.setState({
            blockNumber: event.target.value
        })
    }

    updateLandNumber(event){
        this.setState({
            landNumber: event.target.value
        })
    }

    view(district){
        return (
            <option value={district.district_id}>{district.name}</option>
        )
    }

    async getDistrict(){
      try{ 
        const token = localStorage.getItem('adminToken');
        console.log(token);
      const response = await axios.post('http://localhost:4000/admin/getDistrict',{
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
       console.log(response.data.data);
       this.setState({
           districts: response.data.data
       })
     }
      catch(e){
       console.log(e);
      }  
     }

     async addLand(event){
        event.preventDefault()
        try{ 
            const token = localStorage.getItem('adminToken');
            const account = localStorage.getItem('address');
            const private_key = localStorage.getItem('privateKey');
            const obj = {
                district_id: this.state.selectedDistrict,
                land_no: this.state.landNumber,
                block: this.state.blockNumber,
                area: this.state.area,
                owner_key: this.state.ownerKey,
                account: account,
                private_key: private_key
            }
            console.log(obj);
            console.log(token);
            const response = await axios.post('http://localhost:4000/admin/addLand',obj)
            if (response.data.success === 1) {
                this.setState({
                    check: true
                })
            }
            
            console.log(response);
       }
        catch(e){
         console.log(e);
        }  
       }

       message(){
           return(
               <div id="me">
                   <p>Land added succussfully!</p>
               </div>
           )
       }




    render() {
        return (
            <div className="wrapper">
                <AdminNav/>
                <div className="container-fluid" id="add-land"> 
                    <form className="form-group" action="#" onSubmit={(e) => this.addLand(e)}>
                        <div className="row">
                            <div className="col-lg-6 offset-lg-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="district">District:</label>
                                                <select class="form-control" id="sel2" value={this.state.selectedDistrict} onChange={(e) => this.updateSelectedDistrict(e)} required>
                                                    <option value="">Select district</option>
                                                    {
                                                        this.state.districts.map((district) => (
                                                        this.view(district)
                                                    ))
                                                    }
                                                </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="area">Area: </label>
                                            <input className="form-control" placeholder="Enter area name" value={this.state.area} onChange={(e) => this.updateArea(e)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="block">Block number: </label>
                                            <input className="form-control" placeholder="Enter block number" value={this.state.blockNumber} onChange={(e) => this.updateBlockNumber(e)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="land">Land number: </label>
                                            <input className="form-control" placeholder="Enter land number" value={this.state.landNumber} onChange={(e) => this.updateLandNumber(e)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="owner-key">Owner key: </label>
                                            <input className="form-control" placeholder="Enter owner key" value={this.state.ownerKey} onChange={(e) => this.updateOwnerKey(e)} required/>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                {
                                                    this.state.check === true&&
                                                    this.message()
                                                }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col text-center">
                                                <button className="btn btn-custom" type="submit">Add land</button>
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

export default AddLand