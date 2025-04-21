import React, { useEffect, useState , useMemo } from 'react'
import Header from '../../../components/Header'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ROUTES from '../../../navigations/Routes';
import 'font-awesome/css/font-awesome.min.css';
import Swal from 'sweetalert2';
// dataTable
  import $ from "jquery";
  //import "datatables.net-dt/css/dataTables.dataTables.css";
  import "datatables.net";

function useQuery(){
  const {search} =useLocation();
  return React.useMemo(()=> new URLSearchParams(search),[search]);
}

function Department() {
  const query = useQuery();
  const Swal = require('sweetalert2');
  const [departmentId,setDepartmentId] = useState(null);
  const [departments,setDepartments] = useState([]);
  const [form,setForm] = useState({name:"",image:null ,university: query.get("universityId")});
  const [formError,setFormError] = useState({name:"",image:""});
  const navigate = useNavigate();
  
    useEffect(()=>{
      getDepartmentsByUniversity();
    }, []);
    useEffect(()=>{
      if (departments.length > 0) {
        const table = $("#myTable").DataTable();
        return () => {
          table.destroy(); // Cleanup on unmount or re-render
        };
      }
    }, [departments]);
  
    const changeHandler = (e) => {
      setForm({...form,[e.target.name]: e.target.value });
    };

    function resetForm(){
      setForm({name:"",image:null ,university: query.get("universityId")});
    }
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

    function getDepartmentsByUniversity(){
      try {
        axios.get("http://localhost:8081/department?universityId="+ query.get("universityId")).then((d)=>{
          setDepartments(d.data.depData);
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

    function saveDepartment()
    {
    try{
      let formData = new FormData();
      formData.append("name",form.name);
      formData.append("image",form.image, form.image.name);
      formData.append("universityId",query.get("universityId"));
      axios.post("http://localhost:8081/department",formData,{
        "content-type":"multipart/form-data",
      }).then((d)=>{
        Toast.fire({
          icon: "success",
          title: d.data.message,
        });
        //alert(d.data.message);
        getDepartmentsByUniversity();
        resetForm();
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

  function updateDepartment()
  { 
    try{
      let formData = new FormData();
      formData.append("id", departmentId);
      formData.append("name",form.name);
      formData.append("image",form.image);
      axios.put("http://localhost:8081/department",formData,{
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

  function deleteDepartment(id)
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
          axios.delete("http://localhost:8081/department",{data:{id:id}}).then((d)=>{
            Toast.fire({
              icon: "success",
              title: d.data.message,
            });
            //alert(d.data.message);
            getDepartmentsByUniversity();
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

  function onDepartmentSubmit(){
    let errors = false;
    let error = {name:"", image:""};
    if(form.name.trim().length == 0)
    {
      errors = true;
      error = {...error,name:"Department Name Empty !!!"};
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
      departmentId? updateDepartment() : saveDepartment();
  }

  function renderDepartments()
  {
    if (!departments || departments.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            No departments available
          </td>
        </tr>
      );
    }
    return departments?.map((item)=>{
      return(
        <tr key={item._id}>
          <td>
            <img src={"http://localhost:8081/" + item.image} height={"150px"} width={"170px"}/>
          </td>
          <td>{item.name}</td>
          <td>
            <button className='btn btn-info' onClick={()=>{
               navigate(ROUTES.productAdmin.name + "?id=" + item._id + "&name=" + item.name); 
            }}><i className="fa fa-plus"></i> Add Product</button>
          </td>
          <td>
            <button className='btn btn-primary mx-1' onClick={()=>{
              setDepartmentId(item._id);
              setForm({...form,name:item.name,image:item.image});
            }}><i className="fa fa-edit"></i></button>
            <button className='btn btn-danger' onClick={()=>{
              deleteDepartment(item._id);
            }} ><i className="fa fa-trash"></i></button>
          </td>
        </tr>
      )
    })
  }

  

  return <div>
    <Header/>
    <div className='row p-2 m-2'>
      <div class="card text-center border border-dark mx-auto">
        <div class="card-header bg-dark text-white">
          {departmentId?"Edit Department":"New Department"}
        </div>
        <div class="card-body">
          <div className='form-group row'>
            <label className='col-4' >University</label>
            <div className="col-8">
              <input className="border border-dark form-control" name="name"  type="text" disabled value={query.get("name")}/>
            </div>
          </div>
          <div className='form-group row'>
            <label className='col-4' for="txtUni">Department</label>
            <div className="col-8">
              <input className="border border-dark form-control" name="name" id="txtUni" type="text" placeholder='Enter Department Name' onChange={changeHandler} value={form.name}/>
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
          <button className='btn btn-outline-primary' onClick={()=>{
            onDepartmentSubmit();
          }}>{departmentId?"Update":"Save"}</button>
        </div>
      </div>
    </div>
    <div className='border border-dark p-2 m-2'>
      <table id="myTable" className="display table table-stripe ">
        <thead>
          <tr>
            <th>Department Image</th>
            <th>Department Name</th>
            <th>Add Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderDepartments()}</tbody>
      </table>
    </div>
  </div>;
}

export default Department