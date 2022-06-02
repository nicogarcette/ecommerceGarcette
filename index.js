class zapatilla{
    constructor(id,marca,modelo,precio,img){

        this.id=id;
        this.marca=marca;
        this.modelo=modelo;
        this.precio=precio;
        this.img=img;
    }

    imprimirIndumentaria(){
        return `Marca: ${this.marca}.\nModelo: ${this.modelo}.\nPrecio: $${this.precio}.`;
    }

}

class Carrito{
    constructor(){

        this.carrito=[];
    }

    // agregar producto
    GetCarrito(){
        return this.carrito;
    }

    AddProducto(zapatilla){

        this.carrito.push({...zapatilla,cantidad:1});

        console.log(this.carrito);

    }

    RemoveProducto(prenda){

        let index;
        switch (prenda) {
            case 1:
                index=this.carrito.indexOf(pantalon);
                break;
            case 2:
                index=this.carrito.indexOf(remera);
                break;
            case 3:
                index=this.carrito.indexOf(zapatilla);
                break;
        }
        
        if (index!=-1 && index!=null) {
            listaCompra.splice(index,1);
        }
    }
    

}

// consulta metodo de pago
function metodoPago(precio,metodo) {

    let total;
    let mensaje= document.getElementById("total");
    switch (metodo) {
        case "credito":
            total=Math.round(precio*1.35);
            mensaje.innerHTML=`<p class="p-size">Al pagar con credito se le hace un recargo del 35%. Precio final: $${total}</p>`
            return total;
        case "efectivo":
            total=Math.round((precio-(precio*0.10)));
            mensaje.innerHTML=`<p class="p-size">Al pagar en efectivo se le hace un descuento del 10%. Precio final: $${total}</p>`;
            return total;
        case "debito":
            total=Math.round((precio*1.10));
            mensaje.innerHTML=`<p class="p-size">Al pagar con debito se le hace un recargo del 10%. Precio final: $${total}</p>`;
            return total;
        default:
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Metodo de pago incorrecto!',
                showConfirmButton: false,
                timer: 1500
              })
            break;
    }
}

// sumador de subtotales
function subtotal(lista) {
    let aux=lista.reduce((acumulador, x)=>acumulador+(x.precio*x.cantidad),0);
    return aux;
}

// funcionalidad del boton limpiar carrito
const limpiarCarrito=()=>{
    listaCompra.GetCarrito().splice(0, listaCompra.GetCarrito().length);
    resetItem();
    bodyCarrito.innerHTML= `<p class="p-size">Carrito vacio</p>`;
    localStorage.removeItem("carrito");
}

const btnBorrar=(id)=>document.getElementById(id).addEventListener("click",()=>limpiarCarrito())

// cargar al localStore
const cargarStorage=(clave,valor)=>{
    localStorage.setItem(clave,valor);
}

// obtener datos del storage y cargarlos nuevamente
const obtenerStorage=()=>{

    if (localStorage.getItem("carrito")!==null) {
    
        let listAux=JSON.parse(localStorage.getItem("carrito"));
        listAux.forEach((ele)=>{
            console.log(ele);
            listaCompra.GetCarrito().push(ele);
        })
    }
}

// funcion concretar pago
const botonPagar=()=>document.getElementById("pagar").addEventListener("click",()=>{

    limpiarCarrito();
    let mensaje= document.getElementById("total");
    
    Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Compra realizada. Gracias',
        showConfirmButton: false,
        timer: 2000
      })

})

// alerta cuando se agrega un producto
const alertAdd=()=>{
    
    Toastify({
    
        text: "Añadido al carrito",
        
        duration: 3000
        
        }).showToast();

}

// selecciona metodo de pago
const calcularPago=()=>{

    let opcion = document.getElementById("opcion");
    opcion.addEventListener("change",(opc)=>{

        let metodo=opc.target.value;
        console.log(metodo);


        // let selectedOpcion = this.options[opcion.selectedIndex];
        // let metodo=selectedOpcion.text;
        let monto=subtotal(listaCompra.GetCarrito());
    
        metodoPago(Math.floor(monto),metodo); 
    });


}

// cargar productos dinamicamente desde el json
const cargarProductos= async ()=>{

    let response = await fetch("./productos.json");
    let data= await response.json();
    

    data.forEach((element)=>{

        // const zapa=new zapatill();    
        let cards=document.getElementById("temporada");

        cards.innerHTML+=    `<div class="card col-lg-4 col-12">
                                <h2>${element.marca} ${element.modelo}</h2>         
                                <img class="card-img" src="img/${element.img}" alt="zapatilla">
                                <p class="p-size">$${element.precio}</p>
                                <button id="btn-zapatilla${element.id}" class="btn">Agregar</button>
                            </div>`

    })

    data.forEach((element)=>{
        document.getElementById(`btn-zapatilla${element.id}`)?.addEventListener("click",()=>{

            if (listaCompra.GetCarrito().find(zapatilla=>zapatilla.id===element.id)) {
        
                let index=listaCompra.GetCarrito().findIndex(zapatilla=>zapatilla.id===element.id);
                listaCompra.GetCarrito()[index].cantidad++;

            }else{
                let producto = new zapatilla(element.id,element.marca,element.modelo,element.precio,element.img)
                listaCompra.AddProducto(producto);
            }

            let monto=subtotal(listaCompra.GetCarrito());   
             // CARGO EL STORAGE
            cargarStorage("carrito",JSON.stringify(listaCompra.GetCarrito()));
            alertAdd();
            contItem();
        })

    })
}

// crea tabla del modal
const crearModal=(lista,nodo,total)=>{
    nodo.innerHTML="";
    let acumulador=`<table class="table table-striped table-hover">
                        <tr>
                            <th>foto</th> 
                            <th>Prenda</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>SubTotal</th>
                        </tr>`

    lista.forEach((element)=>{
        acumulador+=
        ` <tr>
                <td><img class="modal-img" src="./img/${element.img}"></td>
                <td>${element.marca} ${element.modelo}</td>
                <td>${element.cantidad}</td>
                <td>$${element.precio}</td>
                <td>$${element.precio*element.cantidad}</td>
            </tr> `;


    })

    acumulador+=`<tr>
                    <td>TOTAL</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>$${total}</td>
                </tr>
        </table>
        <form id="formulario" class="">
                    <p>Elija metodo de pago:
                    <select id="opcion" name="pago">
                        <option></option>
                        <option value="efectivo">efectivo</option>
                        <option value="credito">credito</option>
                        <option value="debito">debito</option>
                    </select>
                    </p>
                </form>
                <div id="total">
                </div>`

    nodo.innerHTML=acumulador;

}

// funcionalidad al boton carrito
const agregarBtnCarrito=()=>{

    let botonCarrito= document.getElementById("botonCarrito");
    let bodyCarrito=document.getElementById("bodyCarrito");


    botonCarrito.addEventListener("click",()=>{

        cargarModal(listaCompra.GetCarrito(),bodyCarrito,subtotal(listaCompra.GetCarrito()));
        calcularPago();
    })
}
// carga carrito si se hay producto localstorage
const cargarModal=(lista,nodo,monto)=>{

    lista.length!=0 && crearModal(lista,nodo,monto);
};
const contItem=()=>{
    const itemTotal= document.getElementById("item_total");
    let cant=listaCompra.GetCarrito().reduce((acumulador,x)=>acumulador+x.cantidad,0)
    itemTotal.innerHTML=cant;
}
const resetItem=()=>{
    const itemTotal= document.getElementById("item_total");
    itemTotal.innerHTML=0;
}

//                               ----------------------------Programa-------------------------------------

// creo el carrito
const listaCompra=new Carrito;
 
cargarProductos();

obtenerStorage();

botonPagar();

contItem();

agregarBtnCarrito();

btnBorrar("limpiar");



