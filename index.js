class zapatilla{
    constructor(id,marca,modelo,precio,img,stock){

        this.id=id;
        this.marca=marca;
        this.modelo=modelo;
        this.precio=precio;
        this.img=img;
        this.stock=stock;
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

    RemoverItem(posicion){
        this.carrito.splice(posicion,1);
    }
    // funcionalidad del boton limpiar carrito
    //  preguntar si las funciones dentro del metodo van adentro de la clase
    LimpiarCarrito(){

        this.carrito.splice(0, this.carrito.length);
        
        limpiarModal();
        localStorage.removeItem("carrito");
    }

    // sumador de subtotales
    Subtotal(){
        let aux=this.carrito.reduce((acumulador, x)=>acumulador+(x.precio*x.cantidad),0);
        return aux;
    }

}

const limpiarModal=()=>{
    let bodyCarrito=document.getElementById("bodyCarrito");
    bodyCarrito.innerHTML= `<p class="p-size">Carrito vacio</p>`;
    quitarBtnModal();
    resetItem();
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

// boton que llama a la funcion limpiar carrito
const btnBorrar=(id)=>document.getElementById(id).addEventListener("click",()=>listaCompra.LimpiarCarrito());

// cargar al localStore
const cargarStorage=(clave,valor)=>{
    localStorage.setItem(clave,valor);
}

// obtener datos del storage y cargarlos nuevamente
const obtenerStorage=()=>{

    if (localStorage.getItem("carrito")!==null) {
    
        let listAux=JSON.parse(localStorage.getItem("carrito"));
        listAux.forEach((ele)=>{
            listaCompra.GetCarrito().push(ele);
        })
    }
    contItem();

}

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
     
        let monto=listaCompra.Subtotal();
    
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

                if (listaCompra.GetCarrito()[index].cantidad<element.stock) {
                    listaCompra.GetCarrito()[index].cantidad++;
                    alertAdd();
                }else{
                    Swal.fire({
                        position: 'top',
                        title: 'Sin stock',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else{
                let producto = new zapatilla(element.id,element.marca,element.modelo,element.precio,element.img,element.stock)
                listaCompra.AddProducto(producto);
                alertAdd();
            }

            console.log(listaCompra.GetCarrito());
            // CARGO EL STORAGE
            cargarStorage("carrito",JSON.stringify(listaCompra.GetCarrito()));
            contItem();
        })
    })

   
}

// crea tabla del modal
// puede ir en class ui
const crearModal=(lista,nodo,total)=>{
    nodo.innerHTML="";
    let acumulador=`<table class="table table-striped table-hover">
                        <tr>
                            <th>Producto</th> 
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>SubTotal</th>
                            <td></td>
                        </tr>`

    lista.forEach((element)=>{
        acumulador+=
        ` <tr>
                <td><img class="modal-img" src="./img/${element.img}">${element.marca} ${element.modelo}</td>
                <td>$${element.precio}</td>
                <td>
                    <p id="cant${element.id}">${element.cantidad}</p>
                    <div>
                        <a id="btn_sumar${element.id}" class="masmenos" type="button"><i class="fa-solid fa-circle-plus"></i></a>
                        <a id="btn_restar${element.id}" class="masmenos" type="button"><i class="fa-solid fa-circle-minus"></i></a>
                    </div>
                </td>
                <td id="sbTotal${element.id}">$${element.precio*element.cantidad}</td>
                <td><a id="trash${element.id}" type="button"><i class="fa-solid fa-trash-can trash"></i></a></td>

            </tr> `;


    })

    acumulador+=`<tr>
                    <td>TOTAL</td>
                    <td>---</td>
                    <td>---</td>
                    <td id="mdTotal">$${total}</td>
                    <td></td>
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
    agregarBtnModal();
    botonBasura();
    botonSumaResta();

}
// funcion concretar pago
const botonPagar=()=>document.getElementById("pagar").addEventListener("click",()=>{

    listaCompra.LimpiarCarrito();
    
    Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Compra realizada. Gracias',
        showConfirmButton: false,
        timer: 2000
      })

})

// funcionalidad al boton carrito
const agregarBtnCarrito=()=>{

    let botonCarrito= document.getElementById("botonCarrito");
    let bodyCarrito=document.getElementById("bodyCarrito");


    botonCarrito.addEventListener("click",()=>{

        cargarModal(listaCompra.GetCarrito(),bodyCarrito,listaCompra.Subtotal());
        
        
    })
}
// carga carrito si se hay producto localstorage
const cargarModal=(lista,nodo,monto)=>{
    if (lista.length!=0) {
        crearModal(lista,nodo,monto)
        calcularPago();
    }
};
// agrega los botones de pago y limpiar carrito, cuando hay algo en el carrito
const agregarBtnModal=()=>{
    let btnModal=document.getElementById("btnModal");

    btnModal.innerHTML=`<button id="pagar" type="button" class="btn" data-bs-dismiss="modal">Pagar</button>
                        <button id="limpiar" type="button" class="btn">Vaciar carrito</button>
    `;

    botonPagar();
    btnBorrar("limpiar");

}
// boton basura. elimina un toda la cantidad de un producto.
const botonBasura=()=>{

    listaCompra.GetCarrito().forEach((element) => {

        document.getElementById(`trash${element.id}`).addEventListener("click",()=>{

            let posicion=listaCompra.GetCarrito().indexOf(element);
            listaCompra.RemoverItem(posicion);
            
            limpiarModal();
        
            cargarStorage("carrito",JSON.stringify(listaCompra.GetCarrito()));
        
            let bodyCarrito=document.getElementById("bodyCarrito");
            cargarModal(listaCompra.GetCarrito(),bodyCarrito,listaCompra.Subtotal());
            
            contItem();
        })

    });


}
// suma y resta productos del modal
const botonSumaResta=()=>{

    listaCompra.GetCarrito().forEach((element)=>{

        document.getElementById(`btn_sumar${element.id}`)?.addEventListener("click",()=>{
    
            let index=listaCompra.GetCarrito().indexOf(element);
        
            if (element.cantidad<element.stock) {
                listaCompra.GetCarrito()[index].cantidad++;
            }else{
                Swal.fire({
                    position: 'top',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            
            modalDom(element.id,element.precio,element.cantidad);
          
        });

        document.getElementById(`btn_restar${element.id}`)?.addEventListener("click",()=>{
    
            let index=listaCompra.GetCarrito().indexOf(element);
        
            if (element.cantidad<=element.stock && element.cantidad>1) {
                listaCompra.GetCarrito()[index].cantidad--;
            }
            
            modalDom(element.id,element.precio,element.cantidad);
    
        });    
    })
}

// modifica valores del modal
const modalDom=(id,precio,cantidad)=>{

    let cantidadProductos=document.getElementById(`cant${id}`);
    cantidadProductos.innerText=cantidad;

    let sbtotal=document.getElementById(`sbTotal${id}`);
    sbtotal.innerText="$"+cantidad*precio;

    let mdTotal=document.getElementById("mdTotal");
    mdTotal.innerText="$"+listaCompra.Subtotal();

    contItem();
    cargarStorage("carrito",JSON.stringify(listaCompra.GetCarrito()));
}

// si no hay nada en el carrito, quita los botones
const quitarBtnModal=()=>{
    let btnModal=document.getElementById("btnModal");
    btnModal.innerHTML="";
}

// contador del carrito
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

agregarBtnCarrito();





