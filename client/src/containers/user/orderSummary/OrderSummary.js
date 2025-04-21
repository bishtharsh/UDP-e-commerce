  import React, { useEffect, useState }  from 'react'
  import Header from '../../../components/Header'
  import { useNavigate,useLocation} from 'react-router-dom';
  import axios from 'axios';
  import ROUTES from '../../../navigations/Routes';
  import { Elements , useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
  import { loadStripe } from "@stripe/stripe-js";
  import "./OrderSummary.css";

  const stripePromise = loadStripe("pk_test_51Q7XrsGBP5m4BYYRs56ISpkF0RCEz61AqNFVSHVSaj2Xh526jicsoLb821QMhckcGdYoJaSxKgH2Cw7YozFzYJVy00lWCnxXA1");

  function OrderSummary() {
    const [form,setForm] = useState({user:"",orderTotal:"",name:"",phone:"",address:"",city:"",state:"",postal:""});
    const [formError,setFormError] = useState({
      name:"",phone:"",address:"",city:"",state:"",postal:""});
    const Swal = require('sweetalert2');
    const [Token] = useState(localStorage.getItem('token'));
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const [options, setOptions] = useState([]);  // For storing dynamic options
    const [loading, setLoading] = useState(true);  // For loading state
    const [selectedOption, setSelectedOption] = useState('');  // For selected option
    

    useEffect(() => {
      setCount(cart.length);  
    }, [cart])    
    useEffect(()=>{
      getItemsByUserId();
    },[]);

    useEffect(() => {
      const fetchOptions = async () => {
        try {
          const response = await axios.get('http://localhost:8081/orderHeaderUser?id='+Token); // Adjust your API URL
          setOptions(response.data.headData);  // Assuming the API returns an array of options
          setLoading(false);
        } catch (error) {
          console.error("Error fetching options:", error);
          setLoading(false);
        }
      }
      fetchOptions();
    }, []);

    const handleSelectionChange = (e) => {
      const optionKey = e.target.value;
      setSelectedOption(optionKey);
  
      // Assuming the backend returns data for each option
      const selectedData = options.find(option => option._id === optionKey);
      if (selectedData) {
        setForm({
          name: selectedData.name,
          phone: selectedData.phone,
          address: selectedData.address,
          city: selectedData.city,
          state: selectedData.state,
          postal: selectedData.postalCode
        });
      }else{
        setForm({
          name: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          postal: ""
        });
      }
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

    

    const changeHandler = (e)=>{
      setForm({...form,[e.target.name]: e.target.value});
    };

    function getItemsByUserId(){
      try {
          axios.get("http://localhost:8081/shoppingCarta?id="+Token+"&active=true").then((d)=>{
              setCart(d.data.cartData);
            });
      } catch (error) {
          Swal.fire({
              title: "Error",
              text: "Fail to get data !!!",
              icon: "error"
          });
      }
    }

    function renderCart(){
      if(cart == 0)
        return<>
            <tbody>
                <tr>
                    <td colSpan="4" style={{textAlign:"center"}}>No items in Summary</td>
                </tr>
            </tbody>
            <tfoot style={{borderTop:"2.5px solid rgb(209, 209, 209)",paddingTop:"10px"}}>
              <div className=''>
                <div className='row'>
                    <div className='col-8'>
                        <h6>Subtotal</h6>
                    </div>
                    <div className='text-right col-4'>
                        <h6 className=''>₹{0}</h6>
                    </div>
                </div>
                <div className='row'>
                  <div className='col-8'>
                    <h6 style={{color: "#a1a1a1",fontSize:"14px"}}>Taxes and shipping </h6>
                  </div>
                  <div className='text-right col-4'>
                    <h6 style={{color: "#a1a1a1",fontSize:"14px"}}>₹150</h6>
                  </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                    <h5 >Grand Total</h5>
                    </div>
                    <div className='text-right col-4'>
                      <h5 >₹{0}</h5>
                    </div>
                </div>
              </div>
            </tfoot> 
        </>;
      else
        { // Filter
          const total = cart.filter(item => item.active === true).reduce((sum, item) => sum + item.price * item.quantity, 0);
          const grandTotal = total + 150;
          form.orderTotal = grandTotal||0;
          return cart?.map((item, index) => {
            const isLastItem = index === cart.length - 1;
            return<>
              <tbody className='' >
                <tr className='row'>
                    <td className='col-6'>
                      <strong>{item.product.name}</strong>
                    </td>
                    <td className='col-3 text-center '>
                        <span>{item.quantity}</span>
                    </td>
                    <td className='col-3 text-right'>
                        <strong >₹{item.price * item.quantity}</strong>
                    </td>
                </tr>
              </tbody>
              {isLastItem &&(
                <tfoot style={{borderTop:"2.6px solid rgb(209, 209, 209)",paddingTop:"10px"}}>
                  <div className=''>
                    <div className='row'>
                        <div className='col-8'>
                            <h6>Subtotal</h6>
                        </div>
                        <div className='text-right col-4'>
                            <h6 className=''>₹{total||0}</h6>
                        </div>
                    </div>
                    <div className='row'>
                      <div className='col-8'>
                        <h6 style={{color: "#a1a1a1",fontSize:"14px"}}>Taxes and shipping </h6>
                      </div>
                      <div className='text-right col-4'>
                        <h6 style={{color: "#a1a1a1",fontSize:"14px"}}>₹150</h6>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-8'>
                        <h5 >Grand Total</h5>
                      </div>
                      <div className='text-right col-4'>
                        <h5 >₹{grandTotal||0}</h5>
                      </div>
                    </div>
                  </div>
                </tfoot> 
                  
                )}    
            </>   
          });
        }
    }

    function onUserSubmit(){
      let errors = false;
      let error = {name:"",phone:"",address:"",city:"",state:"",postal:""}

      if(form.name.trim().length == 0){
        errors = true;
        error = {...error,name:"Name Empty !!!"};
      }
      if(form.phone.trim().length == 0){
        errors = true;
        error = {...error,phone:"Phone No. Empty !!!"};
      }else if(form.phone.trim().length > 0 && form.phone.trim().length != 10) {
        errors = true;
        error = {...error,phone:"Phone No. must have 10-digit number. !!!"};
      }
      if(form.address.trim().length == 0){
        errors = true;
        error = {...error,address:"Address Empty !!!"};
      }
      if(form.city.trim().length == 0){
        errors = true;
        error = {...error,city:"City Empty !!!"};
      }
      if(form.state.trim().length == 0){
        errors = true;
        error = {...error,state:"State Empty !!!"};
      }
      if(form.postal.trim().length == 0){
        errors = true;
        error = {...error,postal:"Pin Code Empty !!!"};
      }
      
      if(errors)
      {
        setFormError(error);
      }else
      {
        setFormError(error);
        setShowPayment(true);
      }
    }

    return<>
        <Header/>
        <div className='row p-2 m-2'>
          <div className='mx-auto rounded' style={{width:"80%"}}>
              <div class="card ">
                  <div class="card-header bg-dark text-white">
                      <h5 >Order Summary</h5>
                  </div>
                  <div class="card-body mx-3 row">
                    <div className='col-7'>
                      <div className=''>
                        <h5 className='text-left'>Shipping Address</h5>
                      </div>
                      <div className='mt-4 px-4'>
                        <div className="form-group">
                          <label className='w-100 text-left' htmlFor="options">Select Option</label>
                          <select 
                            className="form-control"
                            id="options"
                            onChange={handleSelectionChange}
                            value={selectedOption}
                          >
                            <option >Add New Details</option>
                            {loading ? (
                              <option disabled>Loading...</option>
                            ) : (
                              options.map((option) => (
                                <option key={option.key} value={option._id}>
                                  {option.name}-{option.city}  {/* Assuming each option has a 'name' */}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                        <div class="form-group">
                          <label className='w-100 text-left' for="name">Name</label>
                          <input type="text" class="form-control" id="name" name='name'  placeholder="Enter Name" onChange={changeHandler} value={form.name}/>
                          <p className='text-danger text-left'>{formError.name}</p> 
                        </div>
                        <div class="form-group">
                          <label className='w-100 text-left' for="phone">Phone Number</label>
                          <input type="text" class="form-control" id="phone" name='phone'  placeholder="Enter Phone Number" onChange={changeHandler} value={form.phone}/>
                          <p className='text-danger text-left'>{formError.phone}</p> 
                        </div>
                        <div class="form-group">
                          <label className='w-100 text-left' for="address">Address</label>
                          <input type="text" class="form-control" id="address" name='address'  placeholder="Enter Address" onChange={changeHandler} value={form.address}/>
                          <p className='text-danger text-left'>{formError.address}</p> 
                        </div>
                        <div class="form-group">
                          <label className='w-100 text-left' for="city">City</label>
                          <input type="text" class="form-control" id="city" name='city'  placeholder="Enter City" onChange={changeHandler} value={form.city}/>
                          <p className='text-danger text-left'>{formError.city}</p> 
                        </div>
                        <div class="form-group">
                          <label className='w-100 text-left' for="state">State</label>
                          <input type="text" class="form-control" id="state" name='state'  placeholder="Enter State" onChange={changeHandler} value={form.state}/>
                          <p className='text-danger text-left'>{formError.state}</p> 
                        </div>
                        <div class="form-group">
                          <label className='w-100 text-left' for="state">Pin Code</label>
                          <input type="Number" class="form-control" id="postal" name='postal' placeholder="Enter Pin Code" onChange={changeHandler} value={form.postal}/>
                          <p className='text-danger text-left'>{formError.postal}</p> 
                        </div>
                      </div>
                      
                    </div>
                    <div className='col-5'>
                      <table className="table text-left " >
                        <thead>
                            <tr className='row'>
                                <th className='col-6'>Product</th>
                                <th className='col-3 text-center'>Quantity</th>
                                <th className='col-3 text-right'>Total</th>    
                            </tr>
                        </thead>
                        {renderCart()}
                      </table>
                      <div>
                        <button className='btn btn-primary' disabled={count === 0}  onClick={()=>{onUserSubmit()}} style={{width:"100%",}} title='Check Out'>Check Out</button>
                      </div>
                      <div className='mt-2'>
                          <a style={{cursor:"pointer",textDecoration:"none",color: "#4d4b4b",float:"right"}} onClick={()=>{navigate(ROUTES.home.name)}} title='Continue Shopping'><i class="fa-solid fa-arrow-left " style={{color: "#4d4b4b"}}></i> Continue Shopping
                          </a>
                      </div> 
                    </div>
                  </div>
                  <div class="card-footer bg-dark text-white"> 
                      <h6 >Thank you for shopping with us.</h6>
                  </div>
              </div>   
          </div>
      </div>      
      {showPayment && (
        <div className="modal" tabIndex="-1" role="dialog" style={{
          display: "block", 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: "rgba(0, 0, 0, 0.5)", 
          zIndex: 1040, 
          animation: 'fadeIn 0.3s forwards'
          }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payment</h5>
                <button type="button" className="close" id="btn" onClick={() => setShowPayment(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <Elements stripe={stripePromise}>
                  <CheckoutForm orderTotal={form.orderTotal}
                    user={Token} 
                    name={form.name} 
                    phone={form.phone} 
                    address={form.address}
                    city={form.city}
                    state={form.state}
                    postal={form.postal}

                  onClose={() => setShowPayment(false)} />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
    
  }
  function CheckoutForm({ orderTotal, user, name, phone, address, city, state, postal }) {
    const [cart, setCart] = useState([]);
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const Swal = require('sweetalert2');
    const [form] = useState({user:user,orderTotal:orderTotal,name:name,phone:phone,address:address,city:city,state:state,postal:postal,stripetoken:""});

    useEffect(()=>{
      getItemsByUserId();
    },[]);

    function getItemsByUserId(){
      try {
          axios.get("http://localhost:8081/shoppingCarta?id="+user+"&active=true").then((d)=>{
              setCart(d.data.cartData);
            });
      } catch (error) {
          Swal.fire({
              title: "Error",
              text: "Fail to get data !!!",
              icon: "error"
          });
      }
    }


    const handlePayment = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      if (!stripe || !elements) {
        Swal.fire({ icon: "error", title: "Error", text: "Stripe not loaded" });
        setLoading(false);
        return;
      }
    
      const cardElement = elements.getElement(CardElement);
      const { token, error } = await stripe.createToken(cardElement);
    
      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message });
        setLoading(false);
        return;
      }
    
      if (token) {
        form.stripetoken = token.id;
    
        try {
          // First, process the payment
          const paymentResponse = await axios.post("http://localhost:8081/checkOut", form);
          
          if (paymentResponse.data.status === "success") {
            const { orderId, transactionId, shipping } = paymentResponse.data;
    
            if (cart) {
               // Use Promise.all to send all order details requests in parallel
              const orderPromises = cart.map((item) => 
                axios.post("http://localhost:8081/orderDetails", {
                  orderId,
                  product: item.product,
                  quantity: item.quantity,
                  price: item.price
                })
                .then((d) => {
                  if (d.data.status === "success") {
                    return axios.delete(`http://localhost:8081/shoppingCart?id=${item._id}`);
                  } else {
                    throw new Error("Failed to add order details");
                  }
                })
              );

              // Wait for all order-related requests to complete
              await Promise.all(orderPromises);
    
              // Send SMS notification
              const message = `Hi ${form.name}, your order has been confirmed. Order ID: ${orderId}. Transaction ID: ${transactionId}. Estimated delivery date: ${shipping}.`;
              
              const response = await axios.post(`http://localhost:8081/sms-send?to=${form.phone}`, { message });
    
              // Navigate to the order confirmation page
              if(response.data.status === "success")
                navigate(ROUTES.orderConfirm.name+"?orderId="+orderId+"&transId="+transactionId);
              else
                navigate(ROUTES.orderSummary.name);
            }
          } else {
            Swal.fire({ icon: "error", title: "Error", text: "Payment failed" });
          }
        } catch (error) {
          console.error("Error during payment or order creation:", error);
          Swal.fire({ icon: "error", title: "Error", text: "An error occurred while processing the payment" });
        }
      }
      
      setLoading(false);
    };
    
  
    return (
      <div className="payment-form">
        <h5>Paying Amount: ₹{orderTotal}</h5>
        <form onSubmit={handlePayment} className="payment-form-body">
          <div className="form-group">
            <label htmlFor="card-element" className="form-label">
              Credit or Debit Card
            </label>
            <div id="card-element" className="card-element-container">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>
          <button type="submit" disabled={!stripe || loading} className={`btn btn-success mt-3 ${loading ? "btn-loading" : ""}`}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    );
  }

  export default OrderSummary
