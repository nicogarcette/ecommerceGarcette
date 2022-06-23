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

// objeto para validar que todos los campos esten correctos.
const campos={
    nombre:false,
    surname:false,
    email:false,
    phone:false,
    dni:false
}


const checkCampos=()=>{return campos.nombre && campos.surname && campos.email && campos.dni && campos.phone};

// Agregar un novalidateatributo al elemento del formulario evita la validación nativa en los elementos del formulario (si se aplica), 
// lo que permite que JavaScript administre todas las validaciones sin obstrucciones.
form.noValidate=true;
form.addEventListener("submit", e=>{
    e.preventDefault();

    inputs.forEach(input => {
        validarFormulario(input);   
    });
    
    if (checkCampos()) {
        swal({
            title: "Te estamos redirigiendo a Mercado Pago",
            text: "¡Gracias por confiar!",
            button: false
        }).then(setTimeout(() => {
            // mercadopago();
        }, 3000));
    }else{
        console.log("datos incorrectos");
    }

    
})


const valueWrong=(input)=>{
    const padre=input.parentElement.parentElement;
    padre.className="form_grupo-incorrecto";
    if (input.value==="") {
       const p=padre.querySelector("p");
       p.innerText="Este campo es obligatorio.";
    }

}

const valueRight=(input,message)=>{
    const padre=input.parentElement.parentElement;
    padre.className="form_grupo-correcto";

}


const validarCampo=(input,expresion)=>{

    
    if (input.value==="") {
        valueWrong(input);
        return false;
    }else if (!expresion.test(input.value)) {
        valueWrong(input,``);
        return false;
    }else{
        valueRight(input);
        return true;
    }

}
const validarPhone=()=>{

    if (phone.value==="") {
        valueWrong(phone);
        campos.phone=false;
    }else if ((!expresiones.phone.test(phone.value))||(phone.value.length<10)) {
        valueWrong(phone);
        campos.phone=false;
    }else{
        valueRight(phone);
        campos.phone=true;
    }
}

const validarFormulario=(input)=>{

    switch (input) {
        case nombre:
            campos.nombre=validarCampo(nombre,expresiones.nombre,campos.nombre);
            break;

        case surname:
            campos.surname=validarCampo(surname,expresiones.nombre,campos.surname);
            break;

        case email:
            campos.email=validarCampo(email,expresiones.email,campos.email);
            break;
        case phone:
            validarPhone();
            break;
        case dni:
            campos.dni=validarCampo(dni,expresiones.phone,campos.dni);
            break;
   
        default:
            break;
    }

}

inputs.forEach(input => {
    input.addEventListener(`keyup`,()=>validarFormulario(input));
    input.addEventListener(`blur`,()=>validarFormulario(input));    
});

