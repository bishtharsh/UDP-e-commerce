import React, { useEffect, useState }  from 'react'
import Header from '../../../components/Header'
import { useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios';
import ROUTES from '../../../navigations/Routes';
import { get } from 'jquery';


function useQuery(){
  const {search}=useLocation();
  return React.useMemo(()=> new URLSearchParams(search),[search]);
}

function ProductDetails(){
  const Swal = require('sweetalert2');
  const query = useQuery();
  const [productDetails,setProductDetails] = useState(null);
  const navigate = useNavigate();
  const [form,setForm] = useState({user:"",product:"",quantity:1,price:""});
  const [formError,setFormError] = useState({quantity:""});
  const [token] = useState(localStorage.getItem('token'));
  const [profile, setProfile] = useState([]);


  useEffect(()=>{
    getProductDetail();
    if(token){
      Profile();
    }
  },[]);

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

  const changeHandler = (e)=>{
    setForm({...form,[e.target.name]: e.target.value});
  };

    function getProductDetail(){
      try{
        axios.get("http://localhost:8081/productDetail?id="+ query.get("id")).then((d)=>{
          setProductDetails(d.data.prdData);
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Fail to get data !!!",
          icon: "error"
        });
      }
    }

  async function addProductToCart(){
    try {
      form.user = profile._id;
      form.product = productDetails._id;
      form.price = productDetails.price;

      const d = await axios.post("http://localhost:8081/shoppingCart",form);
      const c = await axios.put("http://localhost:8081/updateProductQyt?id="+productDetails._id+"&qyt="+form.quantity);
      if(c.data.status === "success"){
        if(d.data.status === "success"){
          Toast.fire({
            icon: "success",
            title: d.data.message,
          });
          setTimeout(() => {
            window.location.reload(); 
          }, 2000);
          
        }else{
          Toast.fire({
            icon: "error",
            title: d.data.message,
          });
        }
      }else{
        Toast.fire({
          icon: "error",
          title: c.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to get data !!!",
        icon: "error"
      });
    }
  }

  function onCartSubmit(){
    let errors = false;
    let error = {
      quantity:""
    };

    if(form.quantity === 0){
      errors = true;
      error = {...error,quantity:"Quantity Empty !!!"};
    }else if(form.quantity > productDetails.qyt){
      errors = true;
      error = {...error,quantity:"Available quantity is "+productDetails.qyt+" !!!"};
    }
    if(form.quantity <1){
      errors = true;
      error = {...error,quantity:"Quantity less then 1 !!!"};
    }
    if(errors)
    {
      setFormError(error);
    }else
    {
      setFormError(error);
      if(!profile._id)
      {
        Swal.fire({
          title: "Login Required?",
          text: "To Add products in Cart !",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Go, Log In Page!"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(ROUTES.login.name,{state:'true'});
          }
        });
      }else{
        addProductToCart();
      }
    }
}

  return <>
    <Header/>
    <div className='row p-2 m-2'>
      <div className='mx-auto  rounded ' style={{width:"60%"}}>
        <div class="card ">
          <div class="card-header bg-dark text-white">
            <h5 >Product Details</h5>
          </div>
          <div class="card-body mx-3 row">
            <div className='col-6'>
              <div className='row'>
                <h5 class="card-title text-left">{productDetails?.name}</h5>
              </div>
          
              <div id="carouselExampleCaptions" className="carousel slide  border border-dark rounded " data-ride="carousel" data-interval="2000" > 
                <ol class="carousel-indicators mb-0">
                  {productDetails?.images?.map((item, index) => (
                    <li data-target="#carouselExampleCaptions" data-slide-to={index} class={`bg-dark ${index === 0 ? "active":""}`}></li>
                  ))}
                </ol>
                <div className="carousel-inner">
                  {productDetails?.images?.map((item, index) => (
                    <>
                      <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      >
                        <img
                          src={`http://localhost:8081/${item}`}
                          height="250px"
                          width="200px"
                          className="d-block w-100 p-2"
                          alt={`Slide ${index + 1}`}
                        />
                        <div class="text-dark">
                          <p>{`Product Image ${index + 1}`}</p>
                        </div>
                      </div>
                      
                    </>
                  ))}
                </div>
                <button class="carousel-control-prev " type="button" data-target="#carouselExampleCaptions" data-slide="prev">
                  <i class="fas fa-chevron-left fa-fade " style={{color: '#000000'}}></i>
                  <span class="sr-only ">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-target="#carouselExampleCaptions" data-slide="next">
                  <i class="fas fa-chevron-right fa-fade " style={{color: '#000000'}}></i>
                  <span class="sr-only">Next</span>
                </button>
              </div> 
            </div>
            <div className='col-6 mx-auto'>
              <div className='row my-2'>
                <h5 className='card-title text-left'>Description :</h5>
                <span class=" text-left"  style={{fontSize:"15px"}}>
                  {productDetails?.description}
                </span>
              </div>    

              <div className='row'>
                <h5 className='card-text text-left'>Price : ₹{productDetails?.price}/-</h5>
              </div>           
              
              <div className='row my-2'>
                <label for="Qyt" className=' text-left col-4' style={{fontSize:"1.25rem",fontWeight:"500"}}>Quantity:</label>
                <div className='form-group col-8' >
                  <input type='number' id='quantity' name="quantity" placeholder='Enter product Quantity' className='form-control' value={form.quantity} onChange={changeHandler}/>
                  <p className='text-danger'>{formError.quantity}</p>
                </div>
              </div>
              <button onClick={()=>{onCartSubmit()}} class="btn btn-outline-success">
                <i class="fas fa-cart-plus"></i> Add To Cart
              </button>
              <button type='button' class="btn btn-outline-primary mx-2" onClick={()=>{
                if(!profile._id)
                {
                  Swal.fire({
                    title: "Login Required?",
                    text: "To Add products in Cart !",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Go, Log In Page!"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate(ROUTES.login.name,{state:'true'});
                    }
                  });
                }else{
                  navigate(ROUTES.shoppingCart.name);
                }
                
              }}><i className="fas fa-cart-shopping" ></i> View Cart</button>
            </div>
          </div>
          <div class="card-footer bg-dark text-white"> 
          <h6 >Thank you for shopping with us.</h6>
          </div>
        </div>
      </div>
    </div>
  </>;
}
export default ProductDetails