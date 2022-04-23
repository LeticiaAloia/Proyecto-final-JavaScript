// Evento load para que se cargue la api al cargar la ventana.
window.addEventListener(`load`, () => {
    // Establezco variables de latitud y longitud.
    let lon
    let lat
    // Establezco variables para pedir elementos por DOM.
    const temperatura = document.querySelector(`#temperatura`)
    const ubicacion = document.querySelector(`#ubicacion`)
    const iconosAnimados = document.querySelector(`#iconosAnimados`)

    // Condiciono la traída de los datos de la api a que el usuario acepte brindar su geolocalización.
    if(navigator.geolocation) {
        // Obtengo la geolocalización.
        navigator.geolocation.getCurrentPosition( posicion => {
            console.log(posicion.coords.latitude)

            // ASigno propiedades a las variables. 
            lon = posicion.coords.longitude
            lat = posicion.coords.latitude

            // Es la url de la api. Pido el tiempo para Barcelona, unidades en métrico (metric) y en español (es).
            const url = `https://api.openweathermap.org/data/2.5/weather?q=Barcelona&units=metric&lang=es&appid=3bb36a630691fee63b7e250c7ce64b3d`
            console.log(url)

            // Fetch para traer la api con sus diferentes datos:
            fetch(url)
            .then(response => { return response.json() })
            .then(data => {

                // La temperatura en grados centígrados.
                console.log(data.main.temp)
                let temp = Math.round(data.main.temp)
                temperatura.textContent = `${temp}°C`

                // La ubicación. Console log de data para ver cómo nombra a la descripción del clima.
                console.log(data)
                ubicacion.textContent = data.name

                /* El ícono animado. Hago un switch para que coincida con la descripción, un icono para cada estado. 
                La api proporcionaba iconos estáticos, los que utilizo son de AM Charts, de uso libre. */
                console.log(data.weather[0].main)
                switch (data.weather[0].main) {
                    // Despejado.
                    case `Clear`:
                        iconosAnimados.src = `animated/day.svg`
                        break;
                    // Nublado.
                    case `Clouds`:
                        iconosAnimados.src =`animated/cloudy-day-1.svg`
                        break;
                    // Niebla.
                    case `Fog`:
                        iconosAnimados.src =`animated/cloudy-day-3.svg`
                        break;
                    // Tormenta.
                    case `Thunderstorm`:
                        iconosAnimados.src = `animated/thunder.svg`
                        break;
                    // Lluvioso.
                    case `Rain`:
                        iconosAnimados.src =`animated/rainy-7.svg`
                        break;
                    // Nieve.
                    case `Snow`:
                        iconosAnimados.src =`animated/snowy-1.svg`
                        break;
                    // Llovizna.
                    case `Drizzle`:
                        iconosAnimados.src =`animated/rainy-2.svg`
                        break; 
                    // Atmósfera.
                    case `Atmosphere`:
                        iconosAnimados.src =`animated/weather.svg`  
                        break;
                    // Por defecto, un día con algo de nubes.
                    default:
                        iconosAnimados.src =`animated/cloudy-day-1.svg`  
                        break;        
                }
            })
            // Para mostrar por consola cualquier error eventual.
            .catch(error => {
                console.log(error)
            })
        })
    }
})