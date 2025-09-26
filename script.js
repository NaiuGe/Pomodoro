Vue.createApp({
    data(){ 
        return {
            duracionTrabajo: 0.1 * 60, //25 minutos en segundos
            duracionDescanso: 0.2 * 60, //5 minutos en segundos
            tiempo: 0.1 * 60, //25 minutos en segundos

            intervalo: null, //variable para almacenar el intervalo del temporizador. Sirve para pausar/limpiar el setInterval.
            enMarcha: false, //variable para saber si el temporizador esta activado o no. Sirve para evitar que se creen varios intervalos al hacer click en iniciar varias veces.
            enDescanso: false, //variable para saber si estamos en periodo de descanso o de trabajo.

            ciclosTerminados: 0, //contador de pomodoros terminados
            ciclosObjetivo: 4, //objetivo editable por usuario
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
        },
        progresoVisual(){
            // genera un array con true/false para pintar
            return Array.from({length: this.ciclosObjetivo}, (_, i) => i < this.ciclosTerminados);
        }
    },
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

                    //alerta visual
                    this.alertaActiva = true;
                    setTimeout(() => {
                        this.alertaActiva = false;
                    }, 3000);

                    if (!this.enDescanso) {
                        // terminó un pomodoro → pasamos a descanso
                        this.ciclosTerminados++;
                        this.enDescanso = true;

                        if (this.ciclosTerminados >= this.ciclosObjetivo){
                            return; //si se alcanzó el objetivo, no iniciar más ciclos.
                        }

                        this.tiempo = this.duracionDescanso;
                        this.iniciar(); // arranca el descanso
                    } else {
                        // terminó el descanso → volvemos al trabajo
                        this.enDescanso = false;
                        this.tiempo = this.duracionTrabajo;
                        this.iniciar(); // arranca nuevo pomodoro
                    }
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
            this.intervalo = null; //reiniciamos la variable intervalo a null.
            this.enMarcha = false; //indicamos que el temporizador ya no esta en marcha.
            this.enDescanso = false; //reiniciamos el estado a periodo de trabajo.
            this.tiempo = this.duracionTrabajo; //reiniciamos el tiempo al valor por defecto.
            this.ciclosTerminados = 0; //reiniciamos el contador de ciclos terminados.
        }
    }
}).mount('#app'); //montamos la aplicacion en el div con id "app"