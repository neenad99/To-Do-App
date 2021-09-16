const payload = sessionStorage.getItem("payload");
const userId = JSON.parse(payload).user_id;
const userEmail = JSON.parse(payload).identifier;
const addbtn = document.querySelector("#addTask");
const logoutBtn = document.querySelector("#logout");
const inputTask = document.querySelector('#inputTask');
const tasklist = document.querySelector('#tasklist');
const host = "https://to-do-project-app.herokuapp.com";  
// const host =  enter your heroku app url here

function showalert(message,status){
    const div = document.createElement('div');
    var classname = 'success';
    if(status == 'fail')classname = 'danger';
    div.className=`alert alert-${classname}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#addTaskForm');
    container.insertBefore(div,form);
    //vanishing 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(),3000);
}

logoutBtn.addEventListener('click',(e)=>{
    sessionStorage.removeItem("payload");
    window.location.href = '/';
});

function getTasks(){
    let request = new Request(`${host}/${userId}/all`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    });

    fetch(request)
    .then((resp)=>resp.json()
    .then((res)=>{
        let tasks = res.tasks;
        while(tasklist.firstChild)tasklist.removeChild(tasklist.firstChild);
        tasks.forEach(task => {
            var li = document.createElement("li");
            li.classList.add("list-group-item","hov","libasic");
            li.appendChild(document.createTextNode(`${task.content}`));
            var span = document.createElement("span");
            if(task.status == "done"){
                li.style.backgroundColor = '#accec6';
                li.style.textDecoration = "line-through";
            }
            else{
                var button = document.createElement("button");
                button.setAttribute('id',`${task._id}`);
                button.appendChild(document.createTextNode('Done'));
                button.classList.add("btn","btn-success","btn-small");
                button.style.marginRight = '10px';
                span.appendChild(button);
            }
            var button = document.createElement("button");
            button.setAttribute('id',`${task._id}`);
            button.appendChild(document.createTextNode('Delete'));
            button.classList.add("btn","btn-danger","btn-small");
            span.appendChild(button);
            li.appendChild(span);
            tasklist.appendChild(li);
        });
    })).catch((err)=>{
        showalert("some error occured try again or reload page","fail");
    });

}


addbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    if(inputTask.value == ""){
        alert("missing content!");
        return ;
    }

    let request = new Request(`${host}/${userId}/add`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({content:inputTask.value,status:'not done'})
    });
    inputTask.value = '';
    fetch(request).then((resp)=>resp.json().then((res)=>{
        getTasks();
    }).catch((err)=>{showalert("some error occured try again or reload page","fail");}));


});

tasklist.addEventListener('click',(e)=>{
    if(e.target.tagName === 'BUTTON'){
        if(e.target.innerText === 'Done'){
            let request = new Request(`${host}/${userId}/update/${e.target.id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({status:'done'})
            });

            fetch(request).then((resp)=>resp.json().then((res)=>{
                getTasks();
            }))
            .catch((err)=>{
                showalert("some error occured try again or reload page","fail");
            });
        }
        else{
            let request = new Request(`${host}/${userId}/delete/${e.target.id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                }
            });

            fetch(request).then((resp)=>resp.json().then((res)=>{
                getTasks();
            }))
            .catch((err)=>{
                showalert("some error occured try again or reload page","fail");
            });
        }
    }
});