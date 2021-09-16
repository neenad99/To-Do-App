function todoInitialize(){
    // Checking if the payload is available or not
    const payload = sessionStorage.getItem("payload");
    const userId = JSON.parse(payload).user_id;
    const userEmail = JSON.parse(payload).identifier;
    
    const host = "https://to-do-project-app.herokuapp.com"; 
    // const host =  enter your heroku app url here
    if (payload) {
    // If the payload is available then console.log the payload
    console.log("Payload : " + payload);
    let request = new Request(`${host}/${userId}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({user_id:userId,email:userEmail,todo:[]})
    });

    fetch(request).then((resp)=>resp.json().then((res)=>{
        if(res.error != null){
            throw new Error(res.error);
        }
        console.log("user added");
        window.location.href = "/index";
    }).catch((err)=>{console.log("error in user login",err)}));

    }else {
    // If the payload isn't available, that means the user hasn't logged in yet.
    // So redirecting back to "/login"
    window.location.href = "/";
    }
}

 // Fetching payload from sessionStorage
 const payload = sessionStorage.getItem("payload");
 if (payload) {
   // If the payload is available, that means the user has logged in already.
   // So redirecting back to "/login"
   window.location.href = "/index";
 }
 var config = {
   // should be same as the id of the container created on 3rd step
   containerID: "sawo-container",
   // can be one of 'email' or 'phone_number_sms'
   identifierType: "email",
   // Add the API key copied from 2nd step
   apiKey: "ca130ee3-f7cd-468a-a722-864aee1caff8",
   // Add a callback here to handle the payload sent by sdk
   onSuccess: (payload) => {
     // Storing the payload in sessionStorage
     sessionStorage.setItem("payload", JSON.stringify(payload));
     // Redirecting to "/success"
     todoInitialize();
   },
 };
 var sawo = new Sawo(config);
 sawo.showForm();