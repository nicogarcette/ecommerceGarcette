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
// consulta al json y carga productos dinamicamente 
const cargarProductos= async ()=>{

    const response = await fetch("./productos.json");
    let data= await response.json();
    
    data.forEach((element)=>{
        let allcards=document.getElementById("allcards");
        
        allcards.innerHTML+=    `<div class="card col-lg-4 col-12">
                                <h2>${element.marca} ${element.modelo}</h2>         
                                <img class="card-img" src="img/${element.img}" alt="zapatilla">
                                <p class="p-size">$${element.precio}</p>
                                <button id="btn-zapatilla${element.id}" class="btn">Agregar</button>
                            </div>`;
    
    })

    data.forEach((element)=>{
        document.getElementById(`btn-zapatilla${element.id}`)?.addEventListener("click",()=>{

            if (listaCompra.GetCarrito().find(zapatilla=>zapatilla.id===element.id)) {
        
                let index=listaCompra.GetCarrito().findIndex(zapatilla=>zapatilla.id===element.id);

                if (listaCompra.GetCarrito()[index].cantidad<element.stock) {
                    listaCompra.GetCarrito()[index].cantidad++;
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
            }
            // CARGO EL STORAGE
            cargarStorage("carrito",JSON.stringify(listaCompra.GetCarrito()));
            contItem();
        })
    })   
}


// consulta metodo de pago
function metodoPago(precio,metodo) {

    let total;
    let mensaje= document.getElementById("total");
    switch (metodo) {
        case "credito":
            total=Math.round(precio*1.35);
            mensaje.innerHTML=`<p class="p-size">Al pagar con credito se le hace un recargo del 35%. Precio final: $${total}</p>`
            break;
        case "efectivo":
            total=Math.round((precio-(precio*0.10)));
            mensaje.innerHTML=`<p class="p-size">Al pagar en efectivo se le hace un descuento del 10%. Precio final: $${total}</p>`;
            break;
        case "debito":
            total=Math.round((precio*1.10));
            mensaje.innerHTML=`<p class="p-size">Al pagar con debito se le hace un recargo del 10%. Precio final: $${total}</p>`;
            break;
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

// selecciona metodo de pago y consulta el nuevo valor segun el metodo de pago.
const calcularPago=()=>{

    let opcion = document.getElementById("opcion");
    opcion.addEventListener("change",(opc)=>{

        let metodo=opc.target.value;
     
        let monto=listaCompra.Subtotal();
    
        metodoPago(Math.floor(monto),metodo); 
    });


}

// ubicacion
cargarStorage("location",window.location.href);


