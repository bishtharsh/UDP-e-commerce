import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ROUTES from '../../../navigations/Routes';
import 'font-awesome/css/font-awesome.min.css';
import Swal from 'sweetalert2'
// dataTable
  import $ from "jquery";
  import "datatables.net-dt/css/dataTables.dataTables.min.css";
  import "datatables.net";


function University() {
  const Swal = require('sweetalert2');
  const [universityId,setUniversityId] = useState(null);
  const [universities,setUniversities] = useState([]);
  const [form,setForm] =useState({name:"",image:null});
  const [formError,setFormError] =useState({name:"",image:""});
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('token'));
  const [profile, setProfile] = useState([]);
  
  useEffect(() => {
      Profile();
      getAllUniversities();
  }, []);

  useEffect(()=>{
    if (universities.length > 0) {
      const table = $("#myTable").DataTable({
        pageLength: 4, // Default number of rows per page
        lengthMenu: [2, 4, 10, 20, 40], // Options for rows per page
      });
      return () => {
        table.destroy(); // Cleanup on unmount or re-render
      };
    }
  }, [universities]);

  const changeHandler = (e) => {
    setForm({...form,[e.target.name]: e.target.value });
  };
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
  
  function Profile() {
    axios.get("http://localhost:8081/profile?id="+token).then((d) => {
      setProfile(d.data.userData);
    });
  }

  function saveUniversity()
  {
    try{
      let formData = new FormData();
      formData.append("name",form.name);
      formData.append("image",form.image, form.image.name);
      axios.post("http://localhost:8081/university",formData,{
        "content-type":"multipart/form-data",
      }).then((d)=>{
        Toast.fire({
          icon: "success",
          title: d.data.message,
        });
        getAllUniversities();
        window.location.reload();
        resetForm();
      });
    }catch(error){
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
     
    }
  }

  function updateUniversity()
  { 
    try{
      let formData = new FormData();
      formData.append("id", universityId);
      formData.append("name",form.name);
      formData.append("image",form.image);
      axios.put("http://localhost:8081/university",formData,{
        "content-type":"multipart/form-data",
      }).then((d)=>{
        Toast.fire({
          icon: "success",
          title: d.data.message,
        });
        //alert(d.data.message);
        resetForm();
        window.location.reload();
      });
    }catch(error){
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
      //alert('Fail to submit data !!!');
    }
  }

  function getAllUniversities()
  {
    try {
      axios.get("http://localhost:8081/university").then((d)=>{
        setUniversities(d.data.univData);
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
      //alert('Fail to submit data !!!');
    }
  }

  function deleteUniversity(id)
  {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }else{
        try {
          axios.delete("http://localhost:8081/university",{data:{id:id}}).then((d)=>{
            Toast.fire({
              icon: "success",
              title: d.data.message,
            });
            //alert(d.data.message);
            getAllUniversities();
          })
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Fail to submit data !!!",
            icon: "error"
          });
          //alert('Fail to submit data !!!');
        }
      }
    });
    
  }

  function resetForm()
  {
    setForm({name:"",image:null});
  }

  function onUniversitySubmit(){
    let errors = false;
    let error = {name:"", image:""};
    if(form.name.trim().length == 0)
    {
      errors = true;
      error = {...error,name:"University Name Empty !!!"};
    }
    if(form.image == null)
    {
      errors = true;
      error = {...error,image:"Please select Image !!!"};
    }
    if(errors)
      setFormError(error);
    else
      setFormError(error);
      universityId? updateUniversity() : saveUniversity();
  }

  function renderUniversities()
  {
    if (universities === 0 && profile.role !== "admin") {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            No universities available
          </td>
        </tr>
      );
    }
    return universities?.map((item)=>{
      return(
        <tr key={item._id}>
          <td>
            <img src={"http://localhost:8081/" + item.image} height={"150px"} width={"170px"}/>
          </td>
          <td>{item.name}</td>
          <td>
            <button className='btn btn-info' onClick={()=>{
               navigate(ROUTES.departmentAdmin.name + "?universityId=" + item._id + "&name=" + item.name); 
            }}><i className="fa fa-plus"></i> Add Department</button>
          </td>
          <td>
            <button className='btn btn-primary mx-1' onClick={()=>{
              setUniversityId(item._id);
              setForm({...form,name:item.name,image:item.image});
            }}><i className="fa fa-edit"></i></button>
            <button className='btn btn-danger' onClick={()=>{
              deleteUniversity(item._id);
            }} ><i className="fa fa-trash"></i></button>
          </td>
        </tr>
      )
    })
  }

  return <>
    <Header />
    <div className='row p-2 m-2'>
      <div class="card text-center border border-dark mx-auto">
        <div class="card-header bg-dark text-white">
          {universityId?"Edit University":"New University"}
        </div>
        <div class="card-body">
          <div className='form-group row'>
            <label className='col-4' for="txtUni">University</label>
            <div className="col-8">
              <input className="border border-dark form-control" name="name" id="txtUni" type="text" placeholder='Enter University Name' onChange={changeHandler} value={form.name}/>
              <p className='text-danger'>{formError.name}</p>
            </div>
            
          </div>
          <div className='form-group row'>
            <label className='col-4' for="txtImg">Image</label>
            <div className="col-8">
              <input className="border border-dark form-control"  id="txtImg" type="file" onChange={(e)=>{
                let file = e.target.files[0];
                setForm({...form,image:file});
              }}/>
              <p className='text-danger'>{formError.image}</p>
            </div>
            
          </div>
        </div>
        <div class="card-footer bg-dark text-white">
          <button className='btn btn-outline-primary' disabled={profile.role != "admin"} onClick={()=>{
            onUniversitySubmit();
          }}>{universityId?"Update":"Save"}</button>
        </div>
      </div>
    </div>
    <div className='border border-dark p-2 m-2'>
      <table id="myTable" className='display table '>
        <thead>
          <tr>
            <th>University Image</th>
            <th>University Name</th>
            <th>Add Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderUniversities()}</tbody>
      </table> 
    </div>
  </>;
}

export default University