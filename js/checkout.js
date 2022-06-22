const form=document.getElementById("form");
const inputs=[...document.querySelectorAll(".form_input")]; 


const nombre=document.getElementById("nombre");
const surname=document.getElementById("surname");
const email=document.querySelector("#email");
const phone=document.getElementById("phone");
const dni=document.getElementById("dni");
// const error=document.getElementById("error");

const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	phone: /^\d{8,14}$/ // 8 a 14 numeros.
}

form.addEventListener("submit", e=>{
    e.preventDefault();
    
  

})


const valueWrong=(nodo)=>{
    const padre=nodo.parentElement.parentElement;
    padre.className="form_grupo-incorrecto";
}
const valueRight=(nodo)=>{
    const padre=nodo.parentElement.parentElement;
    padre.className="form_grupo-correcto";

}

const validarFormulario=(input)=>{

    switch (input) {
        case nombre:
            if (nombre.value==="") {
                valueWrong(nombre);
            }else if (!expresiones.nombre.test(nombre.value)) {
                valueWrong(nombre);
            }else{
                valueRight(nombre);
            }
            break;

        case surname:
            if (surname.value==="") {
                valueWrong(surname);
            }else if (!expresiones.nombre.test(surname.value)) {
                valueWrong(surname);
            }else{
                valueRight(surname);
            }
        
            break;
        case email:
            if (email.value==="") {
                valueWrong(email);
            }else if (!expresiones.email.test(email.value)) {
                valueWrong(email);
            }else{
                valueRight(email);
            }
        
            break;
        case phone:
            console.log(phone.value.lenght)
            if (phone.value==="") {
                valueWrong(phone);
            }else if ((!expresiones.phone.test(phone.value))||(phone.value.length<10)) {
                valueWrong(phone);
            }else{
                valueRight(phone);
            }
            break;
        case dni:
            if (dni.value==="") {
                valueWrong(dni);
            }else if ((!expresiones.phone.test(dni.value))) {
                valueWrong(dni);
            }else{
                valueRight(dni);
            }
            break;
   
        default:
            break;
    }

}

inputs.forEach(input => {
    input.addEventListener(`keyup`,()=>validarFormulario(input));
    input.addEventListener(`blur`,()=>validarFormulario(input));    
});