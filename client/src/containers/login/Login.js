import React, { useState} from 'react'
import Header from '../../components/Header'
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import Swal from 'sweetalert2'
import ROUTES from '../../navigations/Routes';
//import { useAuth } from "../../components/AuthContext"

function Login() {
  const location = useLocation();
  const state = location.state;
  const [form,setForm] = useState({email:"",password:""});
  const [formError,setFormError] = useState({email:"",password:""});
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

  const loginUser = async () => {
    try { 
      const d = await axios.post("http://localhost:8081/login",form);  
     
      if(d.data.status == 'success'){
        if(d.data.active === true){
          const token = d.data.id; 
          const phone = "+91"+d.data.phone;
          await startVerification(phone);
          Swal.fire({
            title: "OTP sent to your phone",
            text: `Phone Number: ${phone}`,
            input: "text",
            inputLabel: "Enter the OTP",
            inputPlaceholder: "6-digit OTP",
            confirmButtonText: "Verify OTP",
            inputValidator: (value) => {
              if (!value) {
                return "Please enter the OTP!";
              }
            },
          }).then(async (result) => {
            if (result.isConfirmed) {
              const code = result.value;
              const verified = await checkVerification(phone, code);
              if (token && verified == true) {
                // Store token and navigate if verification successful
                localStorage.setItem("token", token);
                if(!state)
                  navigate(ROUTES.home.name);
                else
                  navigate(-1);
                Toast.fire({
                  icon: "success",
                  title: d.data.message,
                });
              }
            }
          });
        }else{
          Swal.fire({
            title: " Deactivated By ADMIN",
            text: "!! Your Account is Deactivated !!",
            icon: "error"
          });
        }
        
      }else{
        Toast.fire({
          icon: 'error',
          title: d.data.message,
        });
      }              
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
    }
  }

  const startVerification = async (phone) => {
    try {
      const response = await axios.post('http://localhost:8081/start-verification', {
        phone
      });
      if (response.data.status == 'success') {
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }else{
        Toast.fire({
          icon: "error",
          title: response.data.message,
        });
      }

    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || 'Error initiating verification.',
        icon: "error"
      });
    }
  };

  const checkVerification = async (phone,code) => {
    try {
      const response = await axios.post('http://localhost:8081/check-verification', {
        phone,
        code
      });
      if (response.data.status == 'approved') {
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
        return true;
      }else{
        Toast.fire({
          icon: "error",
          title: response.data.message,
        });
        return false;
      }
      
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || 'Error verifying code.',
        icon: "error"
      });
    }
  };

  function onUserSubmit(){
    let errors = false;
    let error = {
      email:"",password:""
    };

    if(form.email.trim().length == 0){
      errors = true;
      error = {...error,email:"E-mail Empty !!!"};
    }
    if(!(form.password.trim().length>=6 && form.password.trim().length<=12)){
      errors = true;
      error = {...error,password:"Password length bwt 6 to 12 chars long !!!"};
    }
    if(form.password.trim().length == 0){
      errors = true;
      error = {...error,password:"Password Empty !!!"};
    }

    if(errors)
    {
      setFormError(error);
    }else
    {
      setFormError(error);
      loginUser();
    }
  }

  return <div>
    <Header/>
    <div className='row p-2 m-2'>
      <div className='mx-auto  rounded border-dark' style={{width:"28%"}}>
        <div class="card ">
          <div class="card-header bg-dark text-white">
            <h5 >Log In</h5>
          </div>
          <div class="card-body mx-3">
            <div className='row '>
              <label className='col-4' for="email">Username</label>
              <div className='col-8'>
                <input className='form-control' name='email' type="text" id="email" placeholder='Enter e-mail' onChange={changeHandler} value={form.email}/>
                <p className='text-danger'>{formError.email}</p>
              </div>
            </div>
            <div className='row '>
              <label className='col-4' for="password">Password</label>
              <div className='col-8'>
                <input className='form-control' name='password' type="password" id="password" placeholder='Enter password' onChange={changeHandler} value={form.password}/>
                <p className='text-danger'>{formError.password}</p>
              </div>
            </div>
            <div >
              <button className='col-5 btn btn-outline-success' onClick={()=>{onUserSubmit();}}>Log In</button>
            </div>
          </div>
          <div className='card-footer bg-dark text-white'>
            <p>Don't have an account? <a href=""className='text-warning' onClick={()=>{
              navigate(ROUTES.register.name);
            }}>Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>;

}

export default Login