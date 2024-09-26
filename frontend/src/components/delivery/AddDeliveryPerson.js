//Add product
import React,{useState} from "react";
import axios from "axios";
import DeliveryHeader from "../delivery/DeliveryHeader";
export default function AddDeliveryPerson(){
    
    const[fname,setfname]=useState("");
    const[lname,setlname]=useState("");
    const[email,setemail]=useState("");
    const[number,setnumber]=useState("");
    const[password,setpassword]=useState("");
    const[street,setstreet]=useState("");
    const[city,setcity]=useState("");
    const[nic,setnic]=useState("");
    const [dlisen, setdlisen] = useState(""); // Add this state


    function sendData(e){
        e.preventDefault();
        
        const AddDeliveryPersons={
            fname,
            lname,
            email,
            number,
            password,
            street,
            city,
            nic,
            dlisen, // Include deliveryPersonId
        }
        axios.post("http://localhost:8070/adddeliveryperson/addperson",AddDeliveryPersons).then(()=>{
            alert("Product added")
            setfname("");
            setlname("");
            setemail("");
            setnumber("");
            setpassword("");
            setstreet("");
            setcity("");
            setnic("");
            setdlisen(""); // Reset deliveryPersonId

        }).catch((err)=>{
            alert(err)
        })
    }




    return(
      
        <div className="container">
          <DeliveryHeader/>
            <form onSubmit={sendData}>
  <div class="form-group">
    <label for="fname">fname</label>
    <input type="text" class="form-control" id="fname" placeholder="fname" 
    onChange={(e)=>{
        setfname(e.target.value); //Assign value to the productname
    }}/>
    
  </div>
  <div class="form-group">
    <label for="lname">lname</label>
    <input type="text" class="form-control" id="lname" placeholder="lname"
    onChange={(e)=>{
        setlname(e.target.value); 
    }}/>
    
  </div>
  <div class="form-group">
    <label for="email">email</label>
    <input type="text" class="form-control" id="email" placeholder="email"
    onChange={(e)=>{
        setemail(e.target.value); 
    }}/>
    
  </div>

  <div class="form-group">
    <label for="number">number</label>
    <input type="text" class="form-control" id="number" placeholder="number"
    onChange={(e)=>{
        setnumber(e.target.value); 
    }}/>
    
  </div>

  <div class="form-group">
    <label for="password">password</label>
    <input type="text" class="form-control" id="password" placeholder="password"
    onChange={(e)=>{
        setpassword(e.target.value); 
    }}/>
    
  </div>

  <div class="form-group">
    <label for="street">street</label>
    <input type="text" class="form-control" id="street" placeholder="street"
    onChange={(e)=>{
        setstreet(e.target.value); 
    }}/>
    
  </div>

  <div class="form-group">
    <label for="city">city</label>
    <input type="text" class="form-control" id="city" placeholder="city"
    onChange={(e)=>{
        setcity(e.target.value); 
    }}/>
    
  </div>

  <div class="form-group">
    <label for="nic">nic</label>
    <input type="text" class="form-control" id="nic" placeholder="nic"
    onChange={(e)=>{
        setnic(e.target.value); 
    }}/>
    
  </div>

  <div class="form-group">
    <label for="dlisen">nic</label>
    <input type="text" class="form-control" id="dlisen" placeholder="dlisen"
    onChange={(e)=>{
        setdlisen(e.target.value); 
    }}/>
    
  </div>
  
  
  
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
        </div>
    )
}
