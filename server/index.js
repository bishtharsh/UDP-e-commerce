import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import { CreateUniversity, DeleteUniversity, GetUniversity, UpdateUniversity } from './controllers/University.js';
import { CreateDepartment, DeleteDepartment, GetDepartment, UpdateDepartment } from './controllers/Department.js';
import { CreateProduct, DeleteProduct, GetProductDetails, GetProductsByDepartmentId, UpdateProduct, UpdateProductQyt } from './controllers/Product.js';
import { changePassword, Profile, Login, Register, GetAllUser, ProfileInOut } from './controllers/User.js';
import { checkVerification, startVerification, SendSms  } from './controllers/TwoFactor.js';
import { CreateItem, DeleteItem, GetItemsByUserId, UpdateCartItemQuantityByOne, ActiveItem,GetItemsByUserIdActive, CheckOut, GetOrderHeaderByUserId , CreateDetails, GetAllOrderHeader, GetOrderDetailsByOrderId ,OrderInOut} from './controllers/ShoppingCart.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//University
const storageUniv = multer.diskStorage({
    destination:"uploadUniv/",
    filename:(req, file, cb) => {
        cb(null,`${Date.now()}--${file.originalname}`);
    }
});

const uploadUniv = multer({
    storage: storageUniv,
});

app.post("/university",uploadUniv.single("image"),CreateUniversity);
app.put("/university",uploadUniv.single("image"),UpdateUniversity);
app.delete("/university",DeleteUniversity);
app.get("/university",GetUniversity);

//department
const storageDept = multer.diskStorage({
    destination:"uploadDept/",
    filename:(req, file, cb) => {
        cb(null,`${Date.now()}--${file.originalname}`);
    }
});

const uploadDept = multer({
    storage: storageDept,
});

app.post("/department",uploadDept.single("image"),CreateDepartment);
app.put("/department",uploadDept.single("image"),UpdateDepartment);
app.delete("/department",DeleteDepartment);
app.get("/department",GetDepartment);

//product
const storagePrd = multer.diskStorage({
    destination:"uploadPrd/",
    filename:(req, file, cb) => {
        cb(null,`${Date.now()}--${file.originalname}`);
    }
});

const uploadPrd = multer({
    storage: storagePrd,
});

app.post("/product",uploadPrd.array("images"),CreateProduct);
app.put("/product",uploadPrd.array("images"),UpdateProduct);
app.delete("/product",DeleteProduct);
app.get("/product",GetProductsByDepartmentId);
app.get("/productDetail",GetProductDetails);
app.put("/updateProductQyt",UpdateProductQyt);

//Shopping Cart
app.post("/shoppingCart",CreateItem);
app.put("/shoppingCart",UpdateCartItemQuantityByOne);
app.put("/shoppingCarta",ActiveItem);
app.delete("/shoppingCart",DeleteItem);
app.get("/shoppingCart",GetItemsByUserId);
app.get("/shoppingCarta",GetItemsByUserIdActive);

//checkOut
app.post("/checkOut",CheckOut);
app.get("/orderHeaderUser",GetOrderHeaderByUserId);
app.get("/orderHeader",GetAllOrderHeader);
app.put("/orderHeaderActive",OrderInOut);
//OrderDetails
app.post("/orderDetails",CreateDetails);
app.get("/orderDetails",GetOrderDetailsByOrderId);

//User
app.get("/userList",GetAllUser);
app.post("/register",Register);
app.post("/login",Login);
app.get("/profile",Profile);
app.post("/changepassword",changePassword);
app.put("/active",ProfileInOut);
//app.post("/editprofile",editProfile);

//2-Factor

app.post('/start-verification',startVerification);
app.post('/check-verification',checkVerification);
app.post('/sms-send',SendSms);

//Image Access
app.use(express.static("uploadUniv/"));
app.use(express.static("uploadDept/"));
app.use(express.static("uploadPrd/"));

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("database connected");
    app.listen(process.env.PORT,()=>{
        console.log("Server running at port: "+process.env.PORT);
    });
}).catch((c)=>{
    console.log("database connection error",c);
});
