import React, { PureComponent } from 'react'
import axios from 'axios'

class Register extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            pass: '',
            country: '',
            city: '',
            email: ''
        }
    }
    updateName(event){
        this.setState({
            name: event.target.value
        })
    }

    updatePass(event){
        this.setState({
            pass: event.target.value
        })
    }

    updateEmail(event){
        this.setState({
            email: event.target.value
        })
    }

    updateCountry(event){
        this.setState({
            country: event.target.value
        })
    }

    updateCity(event){
        this.setState({
            city: event.target.value
        })
    }

    componentDidMount(){
        document.getElementById('tab-2').click()
    }

    async signup(event){
        event.preventDefault();
      try{ 
       //console.log('armu' +obj1);
      const obj ={
          name: this.state.name,
          email: this.state.email,
          country: this.state.country,
          city: this.state.city,
          password: this.state.pass
      }
      console.log(obj)
      const response = await axios.post('http://localhost:4000/user',{...obj})
       console.log(response);
       if (response.data.success === 1) {
         // alert('helloo');
        this.props.history.push('/login');
         }
     }
      catch(e){
       console.log(e);
      }  
     }

    render() {
        return (
            <div className="container-fluid">
            <div className="row" id="log1">
                 <div className="col-lg-6 offset-lg-3">
                     <div className="card" >
                         <div className="login-box">
                             <div className="login-snip"> <input id="tab-2" type="radio" name="tab" className="sign-up"/><label for="tab-2" className="tab">Sign Up</label>
                                 <div className="login-space">
                                     <form className="form-group" onSubmit={(e) => this.signup(e)} action="#">  
                                     <div className="sign-up-form">
                                         <div className="group"> <label for="user" className="label">Username</label> <input id="user" type="text" className="input" value={this.state.name} onChange={(e) => this.updateName(e)} placeholder="Create your Username"/> </div>
                                         <div className="group"> <label for="pass" className="label">Password</label> <input id="pass" type="password" className="input" data-type="password" value={this.state.pass} onChange={(e) => this.updatePass(e)} placeholder="Create your password"/> </div>
                                         <div className="group"> <label for="country" className="label">Country</label> <input id="country" type="text" className="input" value={this.state.country} onChange={(e) => this.updateCountry(e)} placeholder="Enter country name"/> </div>
                                         <div className="group"> <label for="pass" className="label">City</label> <input id="city" type="text" className="input" value={this.state.city} onChange={(e) => this.updateCity(e)} placeholder="Enter city name"/> </div>
                                         <div className="group"> <label for="email" className="label">Email Address</label> <input id="pass" type="text" className="input" value={this.state.email} onChange={(e) => this.updateEmail(e)} placeholder="Enter your email address"/> </div>
                                         <div className="group"> <button type="submit" className="button">Sign Up</button> </div>
                                         <div className="hr"></div>
                                         <div className="foot"> <label for="tab-1">Already Member?</label> </div>
                                     </div>
                                     </form> 
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

export default Register