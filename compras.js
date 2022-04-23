// Evento load para cargar la función al cargar la ventana.
window.addEventListener(`load`, () => {

    // Array de todos los productos, con imágenes.
    const listaProductos = [
    {
        id: 1,
        nombre: `Nueces`,
        precio: 390,
        imagen: `media/nuez.webp`
    },
    {
        id: 2,
        nombre: `Almendras`,
        precio: 430,
        imagen: `media/almendra.webp`
    },
    {
        id: 3,
        nombre: `Nueces pecan`,
        precio: 510,
        imagen: `media/pecan.webp`
    },
    {
        id: 4,
        nombre: `Avellanas`,
        precio: 380,
        imagen: `media/avellana.webp`
    }
    ];

    // // Variable que creaba el array para pasarle los productos por Json.

    // let listaProductos = [];

    // /* Función para el fetch con ruta relativa, con async-await, que no funcionó. El array sí aparece por console, pero por 
    // algún motivo no lo levantan las demás funciones. */

    // const getProductos = async() => {
    // let prod = await fetch(`/articulos.json`);
    // listaProductos = await prod.json();
    // console.log(listaProductos)
    // }

    // getProductos();


    // Variable para la divisa.
    const divisa = `$`;
    // Variables para el DOM. Items y botones.
    const DOMitems = document.querySelector(`#items`);
    const DOMcarrito = document.querySelector(`#carrito`);
    const DOMtotal = document.querySelector(`#total`);
    const DOMbotonVaciar = document.querySelector(`#boton-vaciar`);
    const DOMbotonComprar = document.querySelector(`#boton-compra`);
    // Variable para el almacenaje de la página.
    const miLocalStorage = window.localStorage;

    // Función que renderiza las cards con los productos. 
    const renderizarProductos = () => {
        listaProductos.forEach((info) => {

            // Estructura
            const nodo = document.createElement(`div`);
            nodo.classList.add(`col-sm-6`);

            // Body
            const nodoCardBody = document.createElement(`div`);
            // Agrego el CSS directamente en JS, por ejemplo, la clase de mi CSS "tarjeta".
            nodoCardBody.classList.add(`tarjeta`);

            // Imagen
            const nodoImagen = document.createElement(`img`);
            nodoImagen.classList.add(`img-fluid`);
            nodoImagen.setAttribute(`src`, info.imagen);

            // Artículo y precio
            const nodoTitle = document.createElement(`h5`);
            nodoTitle.classList.add(`pizarra-venta`);
            // En la pizarra aparecen nombre y precio siempre actualizados por los datos del array.
            nodoTitle.textContent = info.nombre + ` - ${divisa}${info.precio} / 250g`;

            // Botón para agregar el producto.
            const nodoBoton = document.createElement(`button`);
            nodoBoton.classList.add(`boton-venta`);
            nodoBoton.textContent = `Agregar`;
            nodoBoton.setAttribute(`contador`, info.id);
            nodoBoton.addEventListener(`click`, aniadirProductoAlCarrito);
            
            // Insertamos los nodos.
            nodoCardBody.appendChild(nodoImagen);
            nodoCardBody.appendChild(nodoTitle);
            nodoCardBody.appendChild(nodoBoton);
            nodo.appendChild(nodoCardBody);
            DOMitems.appendChild(nodo);
        });
    }

    // Función evento para añadir productos al carrito de compras.
    const aniadirProductoAlCarrito = (evento) => {
        // Añado el nodo al carrito.
        carrito.push(evento.target.getAttribute(`contador`))
        // Actualizo el carrito. 
        renderizarCarrito();
        // Actualizo el Local Storage.
        guardarCarritoEnLocalStorage();
    };

     // Variable para el array de carrito, vacío.
    let carrito = [];

    // Función para renderizar los productos guardados en el carrito.
    const renderizarCarrito = () => {
        // Vacío el html.
        DOMcarrito.textContent = ``;

        // Quito los duplicados del carrito.
        const carritoSinDuplicados = [...new Set(carrito)];

        // Genero los nodos a partir del array vacío carrito.
        carritoSinDuplicados.forEach((item) => {
            // Obtengo el item que necesitamos de la variable de listado de productos.
            const miItem = listaProductos.filter((itemListaProductos) => {
                // Me aseguro de que coincida la id del producto.
                return itemListaProductos.id === parseInt(item);
            });

            // Cuenta el número de veces que se repite el producto.
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // Incrementa el contador si en la repetición coincide la id.
                return itemId === item ? total += 1 : total;
            }, 0);

            // Creo el nodo del item del carrito.
            const nodo = document.createElement(`li`);
            nodo.classList.add(`tarjeta`, `text-right`, `mx-2`);
            nodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            // Boton de quitar elemento del carrito.
            const miBoton = document.createElement(`button`);
            miBoton.classList.add(`boton`);
            miBoton.textContent = `Quitar`;
            miBoton.dataset.item = item;
            miBoton.addEventListener(`click`, quitarItemCarrito);
            // Combino los nodos.
            nodo.appendChild(miBoton);
            DOMcarrito.appendChild(nodo);

        });
        // Renderizo el precio total en el HTML.
        DOMtotal.textContent = calcularTotal();
    };

    // Función evento para quitar un elemento del carrito.
    const quitarItemCarrito = (evento) => {
        // Obtengo el la id del producto que hay en el boton clickeado.
        const id = evento.target.dataset.item;

        // Borro todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        
        // Vuelvo a renderizar el carrito actualizado.
        renderizarCarrito();
        // Actualizo en el Local Storage.
        guardarCarritoEnLocalStorage();
    };

    
    // Calculo el precio total, incluyendo los productos repetidos.
    const calcularTotal = () => {
        // Recorro el array del carrito.
        return carrito.reduce((total, item) => {
            // Obtengo el precio de cada producto.
            const miItem = listaProductos.filter((itemListaProductos) => {
                return itemListaProductos.id === parseInt(item);
            });
            // Los sumo al total.
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    };

    // Informo el precio total de la compra.
    const compraTotal = DOMtotal.textContent

    // Función que vacía el carrito y lo vuelve a renderizar.
    const vaciarCarrito = () => {
        // Limpio los productos guardados.
        carrito = [];
        // Renderizo los cambios.
        renderizarCarrito();
        // Borro el Local Storage.
        localStorage.clear();
    };

    // Evento para la función del botón de comprar.
    DOMbotonComprar.onclick = () => {
        // Condicional que establece que si la compra es igual a 0, avisa por Toastify que no se puede realizar.
        if(calcularTotal() == 0) {
        Toastify ({
            text: `¡No podés comprar 0 productos!`, 
            duration: 2000,
            style: {
                background: `rgba(29, 48, 1, 0.555)`
            }
        }).showToast();
        }

        // De lo contrario, se realiza la compra con las siguientes características:
        else {
        // Con Sweet Alert, informo que se ha realizado correctamente la compra.
        Swal.fire({
            title: `¡Listo!`,
            text: `Tu compra se realizó correctamente.`,
            imageUrl: `media/itemprueba3.webp`,
            imageWidth: 300,
            icon: `success`,
            background: `linear-gradient(#f1db9d, #fcfbf9)`,
            confirmButtonText: `¡Ok!`,
            confirmButtonColor: `rgb(0, 50, 0)`
        })

        // Llamo a la función para vaciar el carrito al finalizar la compra.
        vaciarCarrito ();
        }    
    };

    // Guardo el carrito en Local Storage, en formato json.
    const guardarCarritoEnLocalStorage = () => {
        miLocalStorage.setItem(`carrito`, JSON.stringify(carrito));
    };

    // Recupero un eventual carrito del Local Storage, con parse.
    const cargarCarritoDeLocalStorage = () => {
        // Condicional para cargar información si el carrito ya existe.
        if (miLocalStorage.getItem(`carrito`) !== null) {
            // Cargo la información
            carrito = JSON.parse(miLocalStorage.getItem(`carrito`));
        }
    };

    // Evento para el botón de vaciar el carrito
    DOMbotonVaciar.addEventListener(`click`, vaciarCarrito);

    // Llamo a las funciones.
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});

