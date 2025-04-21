import React, { useEffect, useState }  from 'react'
import Header from '../../../components/Header'
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import ROUTES from '../../../navigations/Routes';

function useQuery(){
  const {search} =useLocation();
  return React.useMemo(()=> new URLSearchParams(search),[search]);
}
function UserDepartment() {
  const Swal = require('sweetalert2');
  const query = useQuery();
  const [departments,setDepartments] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(()=>{
    getDepartmentsByUniversity();
  },[]);

  function getDepartmentsByUniversity(){
    try {
      axios.get("http://localhost:8081/department?universityId="+ query.get("universityId")).then((d)=>{
        setDepartments(d.data.depData);
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to get data !!!",
        icon: "error"
      });
    }
  }

  function renderDepartments(){
    if(departments == 0)
      return(<p className='mx-auto text-danger'>Departments are not available.</p>);
    else
    {
       // Filter
       const filteredData = departments.filter((item) =>
       Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
       );
       return filteredData?.map((item)=>{
        return(
          <div className='col-3 my-2' >
            <div class="card"  style={{max_height:"35vh"}}>
              <img class="card-img-top" src={"http://localhost:8081/" + item.image} alt="Card image cap"  style={{height:"20vh"}}/>
              <div class="card-body">
                <h5>{query.get("name")}</h5>
                <h6 className='my-2' >{item.name}</h6>
                <button onClick={()=>{
                  navigate(ROUTES.productUser.name + "?id=" + item._id + "&name=" + item.name);
                }} class="btn btn-primary">View Products</button>
              </div>
            </div>
          </div>
        );
      });
    }
    
  }

  return <div>
    <Header/>
    <div className='row m-2'>
      <h1 className='mx-auto'>Departments</h1>
    </div>
    <div className='border border-dark rounded mx-auto' style={{width:"80%", minHeight:"80vh"}}>
      <div className="row mx-auto p-2" style={{width:"100%",display:"flex",flexWrap:"wrap"}} >
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
            placeholder="Department Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {renderDepartments()}
        </div>
    </div>
  </div>;
}

export default UserDepartment