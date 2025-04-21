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

function UserProduct() {
  const Swal = require('sweetalert2');
  const query = useQuery();
  const [products,setProducts] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(()=>{
    getProductsByDepartment();
  },[]);

  function getProductsByDepartment(){
    try {
      axios.get("http://localhost:8081/product?departmentId="+ query.get("id")).then((d)=>{
        setProducts(d.data.prdData);
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to get data !!!",
        icon: "error"
      });
    }
  }

  function renderProducts(){
    if(products == 0)
      return(<p className='mx-auto text-danger'>Products are not available.</p>);
    else
    {
      const filteredData = products.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
      );
      return filteredData?.map((item)=>{
        return(
          <div className='col-3 my-2' >
            <div class="card" style={{max_height:"35vh"}}>
              <img class="card-img-top p-2" src={"http://localhost:8081/" + item.images[0]} alt="Card image cap"  style={{height:"20vh"}}  />
              <div class="card-body">
                <h5>{query.get("name")}</h5>
                <h6 className='my-2'>{item.name}</h6>
                <button onClick={()=>{
                  navigate(ROUTES.productDetails.name + "?id=" + item._id + "&name=" + item.name);
                }} class="btn btn-primary" disabled={item.active === false} title={item.active === false? "Product is not available.":"Product Details"}>Product Details</button>
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
      <h1 className='mx-auto'>Products</h1>
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
            placeholder="Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {renderProducts()}
      </div>
    </div>
  </div>;
}

export default UserProduct