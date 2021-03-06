class UserController {

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        
        this.submit(); 
        this.onEdit();
    }

    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", e => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            console.log(values);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index]

            tr.dataset.user = JSON.stringify(values);

            tr.innerHTML = `
            <tr>
                <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${values.name}</td>
                <td>${values.email}</td>
                <td>${(values.admin) ? 'Sim' : 'Não'} </td>
                <td>${Utils.dateFormat(values.register)}</td>
                
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
            `; 
            
            this.addEventsTr(tr);

            this.updateCount();

            
        });

    }

    submit(){

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if (!values) return false;

            this.getPhoto().then((content) => {

                    values.photo = content;

                    this.addLine(values);

                    btn.disabled = false;

                    this.formEl.reset();
                    
                },(e)=>{

                    console.error(e);

                }
            );
        });
    } // Fecha Submit


    getPhoto(){

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=> {
    
                if (item.name === 'photo'){ 
    
                    return item;
     
                }
                 
            });
    
            let file = (elements[0].files[0]);
    
    
            fileReader.onload = () => {
    
                resolve(fileReader.result);
    
            };

            fileReader.onerror = (e) =>{

                reject(e);

            }
    
            if (file){
 
                fileReader.readAsDataURL(file);
            } else {

                resolve('dist/img/boxed-bg.jpg');

            }

        });

    }

    getValues(formEl){
            
        let user = {};
        let isValid = true;


        [...formEl.elements].forEach(function(field, index){

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                
                field.parentElement.classList.add('has-error');
                isValid = false;
            }


            if (field.name == "gender"){
        
                if (field.checked){
                    user[field.name] = field.value;
        
                }
            } else if (field.name == "admin"){
                
                user[field.name] = field.checked;
                
            } else {
        
                user[field.name] = field.value;
        
            }
    
        });
    
        if (!isValid){

            return false;

        }


        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        ); 


    } // fecha getValues()

    insert (data){

        sessionStorage.setItem("", "")

    }


    addLine(dataUser){

        let tr = document.createElement('tr');

        this.insert();

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <tr>
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? 'Sim' : 'Não'} </td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `; 


        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);
    
        this.updateCount();
    }

    addEventsTr(tr){

        tr.querySelector(".btn-edit").addEventListener("click", e=> {

            let json = (JSON.parse(tr.dataset.user)); 

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json){

                let field = this.formUpdateEl.querySelector("[name=" +name.replace("_", "") +"]");

                if (field){

                    if (field.type == 'file') continue;

                    switch (field.type){
                        case 'file':
                            continue;
                        break;

                        case 'radio':
                            field = field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default: 
                            field.value = json[name];

                    }

                } 

            }

            this.formUpdateEl.querySelector(".photo".src = json._photo);

            this.showPanelUpdate();        
        });
        
    }


    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount(){ 

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;

        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-admin").innerHTML = numberAdmin;

    } //Metodo para validação se foi adc um novo user + acrescer o contador de usuarios no front

}