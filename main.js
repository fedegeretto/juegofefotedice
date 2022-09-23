const ronda = document.getElementById('ronda');
const botonesSimon = document.getElementsByClassName('cuadrados');
const botonComenzar = document.getElementById('botonComenzar');

class Simon {
    constructor(botonesSimon, botonComenzar, ronda) {
        this.ronda = 0;
        this.posicionUsuario = 0;
        this.totalRondas = 12;
        this.secuencia = [];
        this.velocidad = 1000;
        this.blockedButtons = true;
        this.botones = Array.from(botonesSimon);
        this.display = {
            botonComenzar,
            ronda
        }
        this.sonidoError = new Audio('./sounds/error.wav');
        this.sonidoBotones = [
            new Audio('./sounds/1.mp3'),
            new Audio('./sounds/2.mp3'),
            new Audio('./sounds/3.mp3'),
            new Audio('./sounds/4.mp3'),
        ]
    }

    // Inicia el Simon
    iniciar() {
        this.display.botonComenzar.onclick = () => this.comenzarJuego();
    }

    // Comienza el juego
    comenzarJuego() {
        this.display.botonComenzar.disabled = true; 
        this.actualizarRonda(0);
        this.posicionUsuario = 0;
        this.secuencia = this.crearSecuencia();
        this.botones.forEach((element, i) => {
            element.classList.remove('victoria');
            element.onclick = () => this.clickBoton(i);
        });
        this.mostrarSecuencia();
    }

    // Actualiza la ronda y el tablero
    actualizarRonda(value) {
        this.ronda = value;
        this.display.ronda.textContent = `Round ${this.ronda}`;
    }

    // Crea el array aleatorio de botones
    crearSecuencia() {
        return Array.from({length: this.totalRondas}, () =>  this.obtenerColorAleatorio());
    }

    // Devuelve un número al azar entre 0 y 3
    obtenerColorAleatorio() {
        return Math.floor(Math.random() * 4);
    }

    // Ejecuta una función cuando se hace click en un botón
    clickBoton(value) {
        !this.blockedButtons && this.validarColorElegido(value);
    }

    // Valida si el boton que toca el usuario corresponde a al valor de la secuencia
    validarColorElegido(value) {
        if(this.secuencia[this.posicionUsuario] === value) {
            this.sonidoBotones[value].play();
            if(this.ronda === this.posicionUsuario) {
                this.actualizarRonda(this.ronda + 1);
                this.velocidad /= 1.02;
                this.juegoTerminado();
            } else {
                this.posicionUsuario++;
            }
        } else {
            this.juegoPerdido();
        }
    }

    // Verifica que no haya acabado el juego
    juegoTerminado() {
        if (this.ronda === this.totalRondas) {
            this.juegoGanado();
        } else {
            this.posicionUsuario = 0;
            this.mostrarSecuencia();
        };
    }

    // Muestra la secuencia de botones que va a tener que tocar el usuario
    mostrarSecuencia() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const boton = this.botones[this.secuencia[sequenceIndex]];
            this.sonidoBotones[this.secuencia[sequenceIndex]].play();
            this.toggleButtonStyle(boton)
            setTimeout( () => this.toggleButtonStyle(boton), this.velocidad / 2)
            sequenceIndex++;
            if (sequenceIndex > this.ronda) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.velocidad);
    }

    // Pinta los botones para cuando se está mostrando la secuencia
    toggleButtonStyle(boton) {
        boton.classList.toggle('active');
    }

    // Actualiza el simon cuando el jugador pierde
    juegoPerdido() {
        this.sonidoError.play();
        this.display.botonComenzar.disabled = false; 
        this.blockedButtons = true;
    }

    // Muestra la animacón de triunfo y actualiza el simon cuando el jugador gana
    juegoGanado() {
        this.display.botonComenzar.disabled = false; 
        this.blockedButtons = true;
        this.botones.forEach(cuadrado =>{
            cuadrado.classList.add('victoria');
        });
        this.actualizarRonda('🏆');
    }
}

const simon = new Simon(botonesSimon, botonComenzar, ronda);
simon.iniciar();