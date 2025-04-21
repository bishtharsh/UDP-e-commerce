import React, { useEffect, useState }  from 'react'
import Header from '../../../components/Header'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import ROUTES from '../../../navigations/Routes';

function Home() {
  const Swal = require('sweetalert2');
  const [universities,setUniversities] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(()=>{
    getAllUniversities();
  },[]);

  function getAllUniversities(){
    try {
      axios.get("http://localhost:8081/university").then((d)=>{
        setUniversities(d.data.univData);
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to get data !!!",
        icon: "error"
      });
    }
  }

  function renderUniversities(){
    if(universities == 0)
      return(<p className='mx-auto text-danger'>Universities are not available.</p>);
    else
    { // Filter
      const filteredData = universities.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
      );
      return filteredData?.map((item)=>{
        return(
          <div className='col-3 my-2' >
            <div class="card" style={{max_height:"35vh"}}>
              <img class="card-img-top" src={"http://localhost:8081/" + item.image} alt="Card image cap"  style={{height:"19.5vh"}} />
              <div class="card-body">
                <h6 className='my-3' style={{
                        overflow: "hidden",
                        display: "inline-block",
                        textOverflow: "ellipsis",
                        maxWidth: "156px",
                        whiteSpace: "nowrap",
                        lineHeight: "3.2vh",
                  }}>{item.name}</h6>
                <button onClick={()=>{
                  navigate(ROUTES.departmentUser.name + "?universityId=" + item._id + "&name=" + item.name);
                }} class="btn btn-primary">View Department</button>
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
      <h1 className='mx-auto'>Universities</h1>
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
            placeholder="University Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {renderUniversities()}
      </div>
    </div>
   
  </div>;
}

export default Home