window.onload = function(){
    var task_day = document.getElementsByClassName('task_day');
    var add_task = document.getElementsByClassName('add_task');
    var length = task_day.length;
    for (let i = 0; i < length; i++){
        attachmentAddTask(task_day[i], add_task[i]);
        attachmentEdit(task_day[i]);
    }
}

// Add New Record
function attachmentAddTask(ul, button){
    button.onclick = function(){
        document.getElementById('title_modal').innerHTML = 'Enter description';
        $('#my_modal').modal('show');
        document.getElementById('task').focus();
        document.getElementById('save').onclick = function(){
            var str = document.getElementById('task').value;
            // Checking if a string is empty
            if (str != ""){
                ul.innerHTML += `<li>${str} <input type = 'checkbox'></li>`;
                document.getElementById('task').value = '';
            }           
            $('#my_modal').modal('hide');
        }  
    }
}

// Edit record for doubleclick
function attachmentEdit(ul){
    ul.ondblclick = function(event){
        var element = event.target;
        if (element.nodeName == 'LI'){
            if (element.getElementsByTagName('input')[0].hasAttribute('checked')){
                alert('Виконане завдання можна тільки видалити');
            } else{
                document.getElementById('task').value = element.innerText;
                document.getElementById('title_modal').innerHTML = 'Edit task';
                $('#my_modal').modal('show');
                document.getElementById('task').focus();
                document.getElementById('save').onclick = function(){
                    var str = document.getElementById('task').value;
                    // If string is empty remove record
                    if (str != ""){
                        element.innerHTML = `${str} <input type = 'checkbox'>`;
                        document.getElementById('task').value = '';
                    } else {
                        element.remove();
                    }
                    
                    $('#my_modal').modal('hide');
                }
            }  
        }
    }

    // Check "checkbox" status
    ul.onclick = function(event){
        var element = event.target;
        if (element.nodeName == 'INPUT'){
            if (!element.hasAttribute('checked')){
                element.setAttribute('checked', 'checked');
                element.parentElement.style.textDecoration = 'line-through';
            } else {
                element.removeAttribute('checked');
                element.parentElement.style.textDecoration = 'none';
            }
        }
    }   
}

// Delete checked records
function deleteSelected(){
    var element = document.getElementsByTagName('li');
    for (let i = 0; i < element.length; i++) {
        var input_element = element[i].getElementsByTagName('input');
        if (input_element[0].hasAttribute('checked')){
            element[i].remove();
            i--;
        }   
    }
}

// Save in coockie
class itemTask {
    constructor (id_day, task, check){
        this.id_day = id_day;
        this.task = task;
        this.check = check;
    }
}

function save(){
    var task_day_col = document.getElementsByClassName('task_day');
    var noteBook = [];
    for (let i = 0; i < task_day_col.length; i++){
        var task_day = task_day_col[i].getElementsByTagName('li');
        
        for(let n = 0; n < task_day.length; n++){
            var task = task_day[n].innerText;
            var check = task_day[n].getElementsByTagName('input')[0].getAttribute('checked');
            noteBook.push(new itemTask(i, task, check));
        }
    }
    var expires = new Date();
    expires.setDate(expires.getDate() + 30);
    var path = 'path=/';
    document.cookie = `noteBook=${JSON.stringify(noteBook)};expires=${expires.toUTCString()}; ${path}`;
}

// Load from coockie
function load(){
    // Delete old records  
    var old_record = document.getElementsByTagName('li');
    for (let i = 0; i < old_record.length; i++){
        old_record[i].remove();
        i--;
    }

    // Read coockie and convert to array
    var start, end, noteBook;
    var decode = decodeURIComponent(document.cookie);
    start = decode.indexOf('noteBook');
    if (start != -1){
        start = decode.indexOf('=', start) + 1;
        end = decode.indexOf(';', start);
        if (end != -1){
            noteBook = decode.slice(start, end);
        }else{
            noteBook = decode.slice(start);
        }
        noteBook = JSON.parse(noteBook);
        if (noteBook != ""){
            insertRecords(noteBook);
        } else{
            alert('Записів не знайдено');
        }
    }else {
        alert('Записів не знайдено');
    }

    

    // Inserts the obtained values by day of the week
    function insertRecords(noteBook){
        var task_day_col = document.getElementsByClassName('task_day');
        for (let i = 0; i < task_day_col.length; i++){
            for (let n = 0; n < noteBook.length; n++){
                if (noteBook[n].id_day == i){
                    if (noteBook[n].check == 'checked'){
                        task_day_col[i].innerHTML += `<li style='text-decoration: line-through'>${noteBook[n].task} <input type = 'checkbox' checked ='checked'></li>`;
                    } else{
                        task_day_col[i].innerHTML += `<li>${noteBook[n].task} <input type = 'checkbox'></li>`;
                    }
                }
            }
        }
    }
    
}

