import React, { useState} from 'react'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import Swal from 'sweetalert2'
import ROUTES from '../../navigations/Routes';

function Register() {
  const [form,setForm] = useState({firstname:"", lastname:"",email:"",phone:"",password:"",confirmPassword:""});
  const [formError,setFormError] = useState({
  firstName: "", lastName:"",email:"",phone:"",password:"",confirmPassword:""});
  const navigate = useNavigate();
  const Swal = require('sweetalert2');

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const changeHandler = (e)=>{
    setForm({...form,[e.target.name]: e.target.value});
  };

  function saveUser(){
    try {
      axios.post("http://localhost:8081/register",form).then((d)=>{
        Toast.fire({
          icon: "success",
          title: d.data.message,
        });
        navigate(ROUTES.login.name); 
      }).catch((d) => {
        Toast.fire({
          icon: "error",
          title: d.response.data.message,
        });
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
    }
  }

  function onUserSubmit(){
    let errors = false;
    let error = {
      firstName: "", lastName:"",email:"",phone:"",password:"",confirmPassword:"",
    };

    if(form.firstname.trim().length == 0){
      errors = true;
      error = {...error,firstName:"First Name Empty !!!"};
    }
    if(form.lastname.trim().length == 0){
      errors = true;
      error = {...error,lastName:"Last Name Empty !!!"};
    }
    if(form.email.trim().length == 0){
      errors = true;
      error = {...error,email:"E-mail Empty !!!"};
    }
    if(form.phone.trim().length == 0){
      errors = true;
      error = {...error,phone:"Phone No. Empty !!!"};
    }else if(form.phone.trim().length > 0 && form.phone.trim().length != 10) {
      errors = true;
      error = {...error,phone:"Phone No. must have 10-digit number. !!!"};
    }
    if(!(form.password.trim().length>=6 && form.password.trim().length<=12)){
      errors = true;
      error = {...error,password:"Password length bwt 6 to 12 chars long !!!"};
    }
    if(form.password.trim().length == 0){
      errors = true;
      error = {...error,password:"Password Empty !!!"};
    } 
    if(form.password != form.confirmPassword){
      errors = true;
      error = {...error,confirmPassword:"Password and Confirm Password not same !!!"};
    }
    if(form.confirmPassword.trim().length == 0){
      errors = true;
      error = {...error,confirmPassword:"Confirm Password Empty !!!"};
    } 

    if(errors)
    {
      setFormError(error);
    }else
    {
      setFormError(error);
      saveUser();
    }
  }
  return <div>
    <Header/>
    <div className='row p-2 m-2'>
      <div className='mx-auto border rounded border-dark' style={{width:"28%"}}>
        <div class="card ">
          <div class="card-header bg-dark text-white">
            <h5 >Sign Up</h5>
          </div>
          <div class="card-body mx-3">
            <div className='row '>
              <label className='col-4' for="first">First Name</label>
              <div className='col-8'>
                <input className='form-control' name='firstname' type="text" id="first" placeholder='Enter first name' onChange={changeHandler} value={form.firstname}/>
                <p className='text-danger'>{formError.firstName}</p>
              </div>
            </div>
            <div className='row '>
              <label className='col-4' for="last">Last Name</label>
              <div className='col-8'>
                <input className='form-control' name='lastname' type="text" id="last" placeholder='Enter last name' onChange={changeHandler} value={form.lastname}/>
                <p className='text-danger'>{formError.lastName}</p>
              </div>
            </div>
            <div className='row '>
              <label className='col-4' for="email">E-mail</label>
              <div className='col-8'>
                <input className='form-control' name='email' type="text" id="email" placeholder='Enter e-mail' onChange={changeHandler} value={form.email}/>
                <p className='text-danger'>{formError.email}</p>
              </div>
            </div>
            <div className='row '>
              <label className='col-4' for="email">Phone Number</label>
              <div className='col-8'>
                <input className='form-control' name='phone' type="text" id="phone" placeholder='Enter 10-digit Number' onChange={changeHandler} value={form.phone}/>
                <p className='text-danger'>{formError.phone}</p>
              </div>
            </div>
            <div className='row '>
              <label className='col-4' for="password">Password</label>
              <div className='col-8'>
                <input className='form-control' name='password' type="password" id="password" placeholder='Enter password' onChange={changeHandler} value={form.password}/>
                <p className='text-danger'>{formError.password}</p>
              </div>
            </div>
            <div className='row '>
              <label className='col-4' for="cpassword">Confirm Password</label>
              <div className='col-8'>
                <input className='form-control' name='confirmPassword' type="password" id="cpassword" placeholder='Re-enter your password' onChange={changeHandler} value={form.confirmPassword}/>
                <p className='text-danger'>{formError.confirmPassword}</p>
              </div>
            </div>
            <div >
              <button className='col-5 btn btn-outline-success' onClick={()=>{onUserSubmit();}}>Sign Up</button>
            </div>
          </div>
          <div className='card-footer bg-dark text-white'>
            <p>Already have an account? <a href=""className='text-warning' onClick={()=>{
              navigate(ROUTES.login.name);
            }}>Log in</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default Register