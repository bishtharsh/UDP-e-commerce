import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import axios from 'axios';
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";

function UserList() {
  const [clients, setClients] = useState([])
  const [error, setError] = useState('');
  const [profile, setProfile] = useState([]);
  const [search, setSearch] = useState("");
  const [token] = useState(localStorage.getItem('token'));
  const Swal = require('sweetalert2');

  useEffect(() => {
    Profile();
    if(profile.role === "admin")
    {
      getAllUsers();
    }
  }, [profile]);

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

  async function getAllUsers() {
    try {
      const d = await axios.get("http://localhost:8081/userList?role=user");
      if(Array.isArray(d.data.userData))
        setClients(d.data.userData);
    } catch (error) {
      setError('Error fetching users');
      console.log(error);
    }
  }

  async function profileActive(id){
    try{
      const response = await axios.put("http://localhost:8081/active?id="+id);
      if(response.data.message === true){
        getAllUsers();
        Toast.fire({
          icon: "success",
          title: "Account is activated",
        });
      }else{
        getAllUsers();
        Toast.fire({
          icon: "success",
          title: "Account is deactivated",
        });
      }
    }catch(error){
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
    } 
  }

  function renderUsers()
  { 
    if(!clients || clients.length === 0) {
      return (
        <tr>
          <td colSpan="12" className="text-center">
            No User available
          </td>
        </tr>
      );
    }
    const filteredData = clients.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
    return filteredData?.map((item,index) => {
      return(
        <tr key={item._id}>
          <td>{index + 1}</td>
          <td>{item.firstname+" "+item.lastname}</td>
          <td>{item.email}</td>
          <td>{item.phone}</td>
          <td>
            <button
              className={`btn btn-sm ${item.active===false? `btn-success `: `btn-danger`} `}
              onClick={()=>{profileActive(item._id)}}
              title={item.active===false?"Activate":"Deactivate"}
            >
              <i className={item.active===false?"fa-solid fa-lock-open":"fa-solid fa-lock"}></i>
              
            </button>
          </td>
        </tr>
      );
    });
  }
  
  return(
    <>
      <Header />
      <div className="container mt-4 bordered">
        <h4>User List</h4>
        {error&&<p className="text-danger">{error}</p>}
        <div className='border border-dark p-2 m-2 rounded'>
          <div class="input-group mb-3">
            <div class="input-group-prepend ">
              <span class="input-group-text " style={{
                fontWeight: 600,
              }}id="basic-addon3">Search</span>
            </div>
            <input
              id="basic-url" 
              type="text"
              className='form-control'
              placeholder="User Details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <table id="myTable" className="table ">
            <thead>
              <tr>
                <th>Sr. id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {renderUsers()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default UserList;
