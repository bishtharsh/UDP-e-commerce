import React, { useEffect, useState , useMemo } from 'react'
import Header from '../../../components/Header'
import { useLocation ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import Swal from 'sweetalert2'
// dataTable
import $ from "jquery";
//import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net";
import ROUTES from '../../../navigations/Routes';

function useQuery(){
  const {search} =useLocation();
  return React.useMemo(()=> new URLSearchParams(search),[search]);
}

function Product() {
  const Swal = require('sweetalert2');
  const query = useQuery();
  const [productId,setProductId] = useState(null);
  const [products,setProducts] = useState([]  );
  const [form,setForm] = useState({name:"",images:null,description:"",price:"",qyt:10,departmentId: query.get("id")});
  const [formError,setFormError] = useState({name:"",images:"",description:"",price:"",qyt:""});
  const navigate = useNavigate();
  useEffect(()=>{
    getProductsByDepartment();
  },[]);

  useEffect(()=>{
    if (products.length > 0) {
      const table = $("#myTable").DataTable();
      return () => {
        table.destroy(); // Cleanup on unmount or re-render
      };
    }
  }, [products]);

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

  const changeHandler = (e) => {
    setForm({...form,[e.target.name]: e.target.value });
  };

  function resetForm(){
    setForm({name:"",images:null,description:"",price:"",qyt:10,departmentId: query.get("id")});
  }

  function getProductsByDepartment(){
    try {
      axios.get("http://localhost:8081/product?departmentId="+ query.get("id")).then((d)=>{
        setProducts(d.data.prdData);
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
      //alert('Unable to access API !!!');
    }
  }
  function saveProduct()
  {
    try{
      let formData = new FormData();
      for(let i=0; i<form.images.length; i++)
      {
        formData.append("images",form.images[i], form.images[i].name);
      }
      formData.append("name",form.name);
      formData.append("description",form.description);
      formData.append("price",form.price);
      formData.append("qyt",form.qyt);
      formData.append("departmentId",query.get("id"));

      axios.post("http://localhost:8081/product",formData,{
        "content-type":"multipart/form-data",
      }).then((d)=>{
        Toast.fire({
          icon: "success",
          title: d.data.message,
        });
        //alert(d.data.message);
        getProductsByDepartment();
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

  function updateProduct()
  { 
    try{
      let formData = new FormData();
      for(let i=0; i<form.images.length; i++)
      { 
        formData.append("images",form.images[i], form.images[i].name);
      }
      
      formData.append("id", productId);
      formData.append("name",form.name);
      formData.append("description",form.description);
      formData.append("price",form.price);
      formData.append("qyt",form.qyt);
      
      axios.put("http://localhost:8081/product",formData,{
        "content-type":"multipart/form-data",
      }).then((d)=>{
        Toast.fire({
          icon: "success",
          title: d.data.message,
        });
        //alert(d.data.message);
        getProductsByDepartment();
        resetForm();
        window.location.reload();
      });
    }catch(error){
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
      //alert('Unable to access API  !!!');
    }
  }

  function deleteProduct(id)
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
          axios.delete("http://localhost:8081/product",{data:{id:id}}).then((d)=>{
            Toast.fire({
              icon: "success",
              title: d.data.message,
            });
            //alert(d.data.message);
            getProductsByDepartment()
          })
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Fail to submit data !!!",
            icon: "error"
          });
        }
      }
    });
  }

  function onProductSubmit(){
    let errors = false;
    let error = {name:"", images:"", description:"",price:"",qyt:""};
    if(form.name.trim().length == 0)
    {
      errors = true;
      error = {...error,name:"Product Name Empty !!!"};
    }
    if(form.description.trim().length == 0)
    {
      errors = true;
      error = {...error,description:"Product Description Empty !!!"};
    }
    if(form.price.trim().length == 0 || form.price.trim() == "0")
    {
      errors = true;
      error = {...error,price:"Product Price Empty !!!"};
    }
    if(form.qyt == 0 || form.qyt == "")
    {
      errors = true;
      error = {...error,qyt:"Product Quantity Empty/Zero !!!"};
    }
    if(form.images == null)
    {
      errors = true;
      error = {...error,images:"Please select Image !!!"};
    }
    if(errors)
    {
      setFormError(error);
    }else{
      setFormError(error);
      productId? updateProduct() : saveProduct();
    }   
  }

  function renderProducts()
  {
    if (!products || products.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            No products available
          </td>
        </tr>
      );
    }
    return products?.map((item)=>{
      return(
        <tr key={item._id}>
          <td>
            <img src={"http://localhost:8081/" + item.images[0]} height={"150px"} width={"170px"}/>
          </td>
          <td>{item.name}</td>
          <td width="20%" >{item.description}</td>
          <td>{item.price}</td>
          <td className={item.qyt==0?"text-danger text-right fw-bolder":"text-right"}>{item.qyt}</td>
          <td>
            <button className="btn btn-info" onClick={() =>{navigate(ROUTES.productDetails.name + "?id=" + item._id + "&name=" + item.name);}}>
              <i className='fas fa-cart-plus'></i>
            </button>
            <button className='btn btn-primary mx-1' onClick={()=>{
              setProductId(item._id);
              setForm({...form,name:item.name,images:item.images,description:item.description,price:item.price,qyt:item.qyt});
            }}><i className="fa fa-edit"></i></button>
            <button className='btn btn-danger' onClick={()=>{
              deleteProduct(item._id);
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
          {productId?"Edit Product":"New Product"}
        </div>
        <div class="card-body">
          <div className='form-group row'>
            <label className='col-4' for="txtUni">Department</label>
            <div className="col-8">
              <input className="border border-dark form-control" name="name" id="txtUni" type="text" disabled value={query.get("name")}/>
            </div>
          </div>
          <div className='form-group row'>
            <label className='col-4' for="txtUni">Product</label>
            <div className="col-8">
              <input className="border border-dark form-control" name="name" id="txtUni" type="text" placeholder='Enter Product Name' onChange={changeHandler} value={form.name}/>
              <p className='text-danger'>{formError.name}</p>
            </div> 
          </div><div className='form-group row'>
            <label className='col-4' for="txtUni">Description</label>
            <div className="col-8">
              <textarea rows="2" className="border border-dark form-control" name="description" id="txtUni"  placeholder='Enter Product description' onChange={changeHandler} value={form.description}/>
              <p className='text-danger'>{formError.description}</p>
            </div> 
          </div>
          <div className='form-group row'>
            <label className='col-4' for="txtUni">Price</label>
            <div className="col-8">
              <input className="border border-dark form-control" name="price" id="txtUni" type="text" placeholder='Enter Product Price' onChange={changeHandler} value={form.price}/>
              <p className='text-danger'>{formError.price}</p>
            </div> 
          </div>
          <div className='form-group row'>
            <label className='col-4' for="txtUni">Quantity</label>
            <div className="col-8">
              <input className="border border-dark form-control" name="qyt" id="txtUni" type="number" placeholder='Enter Product Quantity' onChange={changeHandler} value={form.qyt}/>
              <p className='text-danger'>{formError.qyt}</p>
            </div> 
          </div>
          <div className='form-group row'>
            <label className='col-4' for="txtImg">Image</label>
            <div className="col-8">
              <input className="border border-dark form-control"  id="txtImg" type="file" multiple onChange={(e)=>{
                let files = e.target.files;
                setForm({...form,images:files});
              }}/>
              <p className='text-danger'>{formError.images}</p>
            </div>
            
          </div>
        </div>
        <div class="card-footer bg-dark text-white">
          <button className='btn btn-outline-primary' onClick={()=>{
            onProductSubmit();
          }}>{productId?"Update":"Save"}</button>
        </div>
      </div>
    </div>
    <div className='border border-dark p-2 m-2'>
      <table id="myTable" className='display table table-stripe'>
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price(in ₹)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderProducts()}</tbody>
      </table>
    </div>
  </div>;
}

export default Product