
const form = document.querySelector("form");
const input = document.querySelector("input");
const todoList = document.querySelector(".todo-list");

var Todo = localStorage.getItem("Todo");
var tester = [];

if( Todo == null || Todo == "undefined" ) Todo = [];
else Todo = JSON.parse(Todo);

const allImage = [ 
    "./images/icon-check.svg",
    "./images/icon-moon.svg",
    "./images/icon-sun.svg",
    "./images/bg-desktop-light.jpg",
    "./images/bg-desktop-dark.jpg",
]

const task = document.querySelector(".task");
const cloneTask = task.cloneNode(true);

task.parentNode.removeChild(task);

function updateData() {
    const name = document.querySelectorAll(".task-name");
    Todo = [];

    name.forEach( (taskName) => {
        
        let num = 0;
        if( taskName.classList.contains( "active" ) ) num = 1;
        
        Todo.push( [taskName.textContent , num ] );
    });

    localStorage.setItem( "Todo", JSON.stringify(Todo) );

    const count = document.querySelector(".item-left span");
    count.textContent = Todo.length;

    const draggables = document.querySelectorAll(".draggable");
    const containers = document.querySelectorAll(".todo-list:not(.bar)");

    draggables.forEach( draggable => {

        draggable.addEventListener("dragstart" , () =>{
            draggable.classList.add("dragging");
        } )

        draggable.addEventListener("dragend" , () =>{
            draggable.classList.remove("dragging");
        } )
    })

}

function circleClick( newTask )
{
    const img = newTask.querySelector("img");   
    const insider = newTask.querySelector(".insider");
    const content = newTask.querySelector(".task-name");
    
    img.classList.toggle("active");
    insider.classList.toggle("active");
    content.classList.toggle("active");
}

function appendTask( taskName ) {

    const newTask = cloneTask.cloneNode(true);
    newTask.querySelector(".task-name").textContent = taskName[0];

    todoList.appendChild( newTask );

    const cross = newTask.querySelector(".cross-mark");
    cross.addEventListener( "click" , () => {
        todoList.removeChild( newTask );
        updateData();
    });

    const circle = newTask.querySelector(".circle");
    circle.addEventListener( "click" , () => {
        circleClick( newTask );
        updateData();
    })

    if( taskName[1] ) circleClick( newTask );

}

Todo.forEach( (task) => {
    appendTask( task );
})
updateData();


form.addEventListener( "submit" , (val) => {    
    val.preventDefault();

    const taskName = input.value;
    input.value = "";

    if( taskName.length > 0 ) {

        appendTask( [ taskName , 0 ] );
        updateData();
    }
});

// option click

const options = document.querySelectorAll(".status-options .option");

options[0].classList.add( "blue-text" );

function clearColorText() {
    for(let i = 0; i < 3; i++)
        options[i].classList.remove("blue-text");
}

options[0].addEventListener("click" , () => {

    const tasks = document.querySelectorAll(".task");
    tasks.forEach( (task) => {
        task.style.display = "block";
    })

    clearColorText();
    options[0].classList.add( "blue-text" );
    
});

options[2].addEventListener( "click" , () => {

    const tasks = document.querySelectorAll(".task");
    tasks.forEach( (task) => {
        if( task.querySelector(".task-name").classList.contains("active") ) {
            task.style.display = "block";
        }
        else task.style.display = "none";
    })

    clearColorText();
    options[2].classList.add( "blue-text" );
} )

options[1].addEventListener( "click" , () => {

    const tasks = document.querySelectorAll(".task");
    tasks.forEach( (task) => {
        if( task.querySelector(".task-name").classList.contains("active") ) {
            task.style.display = "none";
        }
        else task.style.display = "block";
    })

    clearColorText();
    options[1].classList.add( "blue-text" );
} )

// clear

const clearOp = document.querySelector(".status-bar .clear");
clearOp.addEventListener( "click" , () =>{
    
    const tasks = document.querySelectorAll(".task");
    tasks.forEach( (task) => {
        if( task.querySelector(".task-name").classList.contains("active") ) {
            todoList.removeChild( task );
        }
        else task.style.display = "block";
    })

    updateData();

    clearColorText();
    options[0].classList.add( "blue-text" );
})

// mode toggle

const modeIcon = document.querySelector(".text-container .mode img");

var run = 0;

modeIcon.addEventListener( "click" , () => {
    
    run = ( run + 1 ) % 2;
    modeIcon.src = allImage[2 - run];

    const backImage = document.querySelector(".image-container");
    backImage.style.backgroundImage = `url(${allImage[4-run]})`;

    if( run == 1 ){
        document.documentElement.style.setProperty("--dark-blue" , "white");
        document.documentElement.style.setProperty("--dark-desaturated-blue", "hsl(236, 33%, 92%)" );
        document.documentElement.style.setProperty("--text-color", "hsl(235, 21%, 11%)" );
        document.documentElement.style.setProperty("--brighter", "black" );
        document.documentElement.style.setProperty("--circle-color", "hsl(233, 11%, 84%)" );
    }
    else {
        document.documentElement.style.setProperty("--dark-blue" , "hsl( 235, 21% , 11% )");
        document.documentElement.style.setProperty("--dark-desaturated-blue", "hsl(235, 24%, 19%)" );
        document.documentElement.style.setProperty("--text-color", "rgba(255, 255, 255, 0.623)" );
        document.documentElement.style.setProperty("--brighter", "white" );
        document.documentElement.style.setProperty("--circle-color", "rgba(255, 255, 255, 0.11)" );
    }

})

// draggable

const containers = document.querySelectorAll(".todo-list:not(.bar)");

function getUnderElement( container , draggingY ) {
    const curDraggables = container.querySelectorAll(".draggable:not(.dragging)");
    
    for(let i = 0; i < curDraggables.length ; i++){
        
        const rectData = curDraggables[i].getBoundingClientRect();
        if( rectData.y > draggingY )
            return i;
    }

    return undefined;
}

containers.forEach( container => {
    container.addEventListener( "dragover" , el => {
        const dragging = document.querySelector(".dragging");
        const under = getUnderElement( container , el.clientY );

        if( under != undefined && dragging != null ){
            const curDraggables = container.querySelectorAll(".draggable:not(.dragging)");
            curDraggables[under].before( dragging );
        }

        else if( dragging != null )
            container.appendChild( dragging );
        updateData();    
    })
});