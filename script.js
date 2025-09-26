Vue.createApp({
    el: "#app",
    data(){ 
        return {
            tiempo: 0.1 * 60, //25 minutos en segundos
            intervalo: null, //variable para almacenar el intervalo del temporizador. Sirve para pausar/limpiar el setInterval.
            enMarcha: false, //variable para saber si el temporizador esta activado o no. Sirve para evitar que se creen varios intervalos al hacer click en iniciar varias veces.
            duracionDefault: 0.1 * 60, //duracion por defecto del temporizador en segundos
            pomodorosTerminados: 0, //contador de pomodoros terminados
            alertaActiva: false,
        }
    }, 
    computed: { //computed es una propiedad que se usa para calcular valores basados en otras propiedades. Se usa como una propiedad, pero es una funcion.
        tiempoFormateado(){ //tiempoFormateado es una funcion que formatea el tiempo en minutos y segundos.
            let minutos = Math.floor(this.tiempo /60);
            //Math.floor redondea hacia abajo un numero decimal.
            let segundos = this.tiempo % 60;
            //this.tiempo hace referencia a la propiedad tiempo del objeto data.

            let mm = minutos.toString().padStart(2, "0");
            //toString convierte un numero en una cadena de texto.
            //padStart agrega ceros a la izquierda hasta que la cadena tenga 2 caracteres.
            let ss = segundos.toString().padStart(2, "0");

            return `${mm}:${ss}`; //retornamos una cadena de texto con el formato mm:ss
        }},
    methods: {
        iniciar(){
            //Evitar que se dupliquen los intervalos.
            if (this.enMarcha) return;

            //indicamos que el temporizador esta en marcha.
            this.enMarcha = true;

            // creamos el intervalo que se ejecutara cada segundo.
            this.intervalo = setInterval (() => {
                if (this.tiempo > 0) {
                    this.tiempo--; //disminuimos el tiempo en 1 segundo
                } else {
                    //se llegó a 0 -> detenemos todo y ejecutamos la acción final.
                    clearInterval(this.intervalo); //limpiamos el intervalo cuando el tiempo llega a 0.
                    this.intervalo = null; //reiniciamos la variable intervalo a null.
                    this.enMarcha = false; //indicamos que el temporizador ya no esta en marcha.

                    //alerta
                    this.alertaActiva = true;
                    setTimeout(() => {
                        this.alertaActiva = false;
                    }, 3000);

                    this.pomodorosTerminados++; //incrementamos el contador de pomodoros terminados.
                    this.resetear(); //reiniciamos el temporizador al valor por defecto.
                }
            }, 1000); //1000 milisegundos = 1 segundo.  Es parte de lafunción "setInterval", el primer parámetro es la función que se ejecutará y el segundo parámetro es el intervalo de tiempo en milisegundos.
        },
        pausar(){
            if (this.intervalo) { //si el intervalo existe, lo limpiamos.
                clearInterval(this.intervalo);
                this.intervalo = null; //reiniciamos la variable intervalo a null.
                this.enMarcha = false; //indicamos que el temporizador ya no esta en marcha.
            }
        },
        resetear(){
            clearInterval(this.intervalo);
            this.tiempo = this.duracionDefault; //reiniciamos el tiempo al valor por defecto.
            this.enMarcha = false; //indicamos que el temporizador ya no esta en marcha.
        }
    }
}).mount('#app'); //montamos la aplicacion en el div con id "app"