class Utils {

    static dateFormat(date){

        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+ date.getHours()+ ':'+ date.getMinutes();

    } 
    
    static showAndHide(show, hide){
 
		document.querySelector(`#${show}`).style.display = 'block';
 
		document.querySelector(`#${hide}`).style.display = 'none';
 
	}

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }


    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    } 
}