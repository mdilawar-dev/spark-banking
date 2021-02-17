  
// api url 
const api_url = "/users"; 
const api_url2="/history";
  
// Function to hide the loader 
function hideloader() { 
  document.getElementById('loading').style.display = 'none'; 
}



// Defining async function 






 async function getapi(url ,url2) { 
    
    // Storing response 
    const response = await fetch(url); 
    const response2 = await fetch(url2); 
    
    // Storing data in form of JSON 
    var data = await response.json(); 
    var data2 = await response2.json(); 
    var user_Data =[data ,data2]
    //console.log(user_Data); 
    if (response) { 
        hideloader(); 
    } 
  
    interface(data,data2);
   

} 

   // Calling that async function 
getapi(api_url ,api_url2); 


async function getUser(){
     
  let userID = window.location.hash.replace('#', '');
  if(userID === ''){
         console.log("no user ID yet");
  }else {
  const userResponse = await fetch(`/users/userID/${userID}`);
  var data = await userResponse.json(); 

 setuser(data);
   
  }
 


}




async function update_data(id1,id2,amount){
  
try{
    await fetch(`/users/${id1}/${id2}/${amount}`,
      {method: 'PUT',
      body: JSON.stringify({completed: true,
      crossDomain: true
    }),
      headers:{"Content-type": "application/json; charset=UTF-8"
  ,}
    
    }
    ).then(response => response.json()).then(json => alert(json.message))

    getapi(api_url ,api_url2); 
    document.getElementById("send_form").innerHTML = ''; 
    document.getElementById('userprofile').innerHTML='';
  
}catch(error){

    alert("Something went wrong Check all details");
}
   

}
     


// Function to define innerHTML for HTML table 

    
   
   
   
//window.addEventListener('hashchange', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event ,getUser ));
    
    
//window.location.hash='';
  

  


     /** document.getElementById("tran_m").addEventListener("click", function() {
        document.getElementById('allusers').style.display='none';
        document.getElementById('all_trc').style.display='none';
        document.getElementById('trn_money').style.display = 'block';
 
      });
*/


function setuser(data){
  let t1;
  let userprofile ;
  window.location.hash='';
  //console.log(data.data.email);

  
   userprofile = 
  `
  <span class="font-weight-bold">acc_id:${data.data.id}<br>User:${data.data.name} <br>Email:${data.data.email}<br>current_Balance:${data.data.balance}</span>
 `;
 
      t1 = 
  `
  <option>${data.data.email}</option>
 `;


 document.getElementById("send_form").innerHTML = t1; 
 document.getElementById('userprofile').innerHTML=userprofile;

  
}


function interface(data,data2){

  let tab =  
  `
  <thead class="thead-light">
  <tr> 
     
    <th>acc_id</th>
      <th>Name</th> 
         <th>Email</th>
           <th>Current Balance</th> 
           <th>view user</th> 
   </tr>
   </thead>  
   
   `; 

// Loop to access all rows  
for (let r of data.data) { 
  tab += 
 
  
  `<tr>  <tbody id="myTable">
<td ">${r.id}</td>
<td>${r.name} </td> 
<td>${r.email}</td>  
<td>${r.balance}</td>  
<td> <a href="#${r.id}" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true">View</a></td>      
</tr>
</tbody>

`; 
} 


let t;
for (let r of data.data) { 
  t += 
`
<option>${r.email}</option>
`;


}

document.getElementById("users").innerHTML = tab; 
document.getElementById("send_to").innerHTML =t; 
/**********************************************************/
let tab2 =  
`
<thead class="thead-dark">
  <tr> 
     
    <th>change_no</th>
      <th>send_form</th> 
         <th>-/+</th>
           <th>send_to</th> 
           <th></th>
           <th>Amount</th> 
           <th>transfered_at</th>
           
           
   </tr>
   </thead> 
`;

for (let r of data2.data) { 
  tab2 += 
` 
<tr>   
<td scope="row">${r.change_no}</td>
<td>${r.Debited}</td>  
<td>${r.flag}</td> 
<td>${r.Credited}<td>
<td>${r.amount}</td>
<td>${r.transfered_at}</td>
</tr>
`;


} 

document.getElementById("tra").innerHTML = tab2; 

const allusers=document.getElementById('allusers');
const all_trc=document.getElementById('all_trc');
const trn_money=document.getElementById('trn_money');
const welcome=document.getElementById("welcome");

allusers.style.display='none';
all_trc.style.display='none';
trn_money.style.display='none';


document.getElementById("show").addEventListener("click", function() {
  
  all_trc.style.display='none';
  welcome.style.display='none';
 trn_money.style.display = 'block';
 allusers.style.display = 'block';

});

document.getElementById("trac_history").addEventListener("click", function() {
  welcome.style.display = 'none';
allusers.style.display='none';
  trn_money.style.display = 'none';
  all_trc.style.display = 'block';
  
});
 

const idd1=document.getElementById('send_form');
const idd2 =document.getElementById('send_to');
const amount_to_send =document.getElementById('send_amount');

document.getElementById('send1').addEventListener('click',()=>{
 console.log("helo")
     update_data(idd1.value,idd2.value,amount_to_send.value)

});

}