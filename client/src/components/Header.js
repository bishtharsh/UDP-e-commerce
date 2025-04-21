import React,{useEffect,useState} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import ROUTES from '../navigations/Routes';
//import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
//import '@fortawesome/react-fontawesome';


function Header() {
  const navigate = useNavigate();
  const [token,setToken] = useState(localStorage.getItem('token'));
  const Swal = require('sweetalert2');
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState([]);
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if(token){
      Profile();
      getItemsByUserId();
    }
  }, []);
  useEffect(() => {
    setCount(cart.length);
  }, [cart])

  function Profile() {
    axios.get("http://localhost:8081/profile?id="+token).then((d) => {
      setProfile(d.data.userData);
    });
  }

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        setToken(null);
        navigate(ROUTES.home.name);
        window.location.reload();
      }
      return;
    });
  };

  function getItemsByUserId(){
    try {
      axios.get("http://localhost:8081/shoppingCart?id="+token).then((d)=>{
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

  const handleProfile = ()=>{
    const imageSrc = profile.role === 'user'? require("../assets/male.jpeg") // Male placeholder image
    :require("../assets/admin.jpg"); // Female placeholder image

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };
    return (
      <div className="dropdown">
        {/* Dropdown Toggle */}
        <button
          className="btn btn-primary m-2 my-sm-0 rounded-circle"
          type="button"
          id="profileDropdown" title='Profile'
          aria-expanded={showDropdown}
          onClick={toggleDropdown}
        >
          <i class="fas fa-user"></i>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div
            className="dropdown-menu show "
            aria-labelledby="profileDropdown"
            data-bs-toggle="dropdown-menu"
            style={{ position: "absolute",
              margin:"10px",
              top: "100%", // Position below the button
              left: "50%", // Align center horizontally
              transform: "translateX(-50%)", // Center using transform
              minWidth: "200px", // Optional width
              z_Index: 1000, // Ensure dropdown appears above other elements
              }}
          >
            <div className=" text-center">
              <img
                src={imageSrc}
                alt="Profile"
                className="rounded-circle mb-2 border border-info"
                style={{ width: "65px", height: "60px" }}
              />
              <h6 className="mb-0">{profile.firstname+" "+profile.lastname}</h6>
              <span className="text-gery ">{profile.email}</span><br/>
              <span className="text-gery " style={{ textTransform: 'capitalize' }}>{profile.role}</span>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" type="button" onClick={()=>{navigate(ROUTES.eprofile.name);}}>
            <i class="fas fa-user-edit me-2"></i> Edit Profile
            </button>
            <button className="dropdown-item" type="button" onClick={()=>{navigate(ROUTES.password.name);}}>
              <i className="far fa-edit me-2"></i> Change Password
            </button>
          </div>
        )}
      </div>
    );
  }
  return <>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <h1 class="navbar-brand"  >UDP</h1>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <Link class="nav-link" to={ROUTES.home.name} >Home</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to={ROUTES.about.name}>About </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to={ROUTES.support.name}>Support </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to={ROUTES.contact.name}>Contact </Link> 
          </li>
          {profile.role == "user" &&(
            <li class="nav-item">
              <Link class="nav-link" to={ROUTES.myOrder.name}>My Order</Link> 
            </li>
          )}

          {profile.role == "admin" &&(
            <li class="nav-item">
              <Link class="nav-link" to={ROUTES.universityAdmin.name}>UDP List </Link> 
            </li>
          )}
          {profile.role == "admin" &&(
            <li class="nav-item">
              <Link class="nav-link" to={ROUTES.userList.name}>User List </Link> 
            </li>
          )}
          {profile.role == "admin" &&(
            <li class="nav-item">
              <Link class="nav-link" to={ROUTES.allOrder.name}>All Orders</Link> 
            </li>
          )}
          
        </ul>
        <form class="form-inline my-2 my-lg-0">
        {token && profile.role?(
            <>
              <button className='btn btn-outline-light rounded-circle' title='View Cart' onClick={()=>{navigate(ROUTES.shoppingCart.name);}}>
                <i class="fa fa-shopping-cart" ></i>
                {count > 0 &&(
                  <span className="badge rounded-circle bg-danger " style={{position: 'absolute',top: "11px",color:'white',width:"19px",height:"19px"}}>{count}
                  </span>
                )}
              </button>
              {handleProfile()}
              <button className="btn btn-outline-danger my-2 my-sm-0" title='Log Out' onClick={(e) => { e.preventDefault();
                  handleLogout();
                }}><i class="fas fa-sign-out"></i> Log Out</button>
            </>
          ):(
            <>
              <button className='m-2 my-sm-0 btn btn-success' onClick={()=>{navigate(ROUTES.register.name);}}>Sign Up</button>
              <button className="btn btn-outline-success my-2 my-sm-0" onClick={()=>{navigate(ROUTES.login.name,{state:'false'});}} ><i class="fa-solid fa-arrow-right-to-bracket"></i> Log In</button>
            </>
          )}
        </form> 
      </div>
    </nav>
  </>; 
}
export default Header;