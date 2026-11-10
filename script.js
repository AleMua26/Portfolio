// =========================================
// LOGICA FORM DI CONTATTO (INVIO EMAIL)
// =========================================
function inviaEmail(evento) {
    evento.preventDefault();
    const nome = document.getElementById('nome').value;
    const cognome = document.getElementById('cognome').value;
    const data = document.getElementById('data').value;
    const messaggio = document.getElementById('messaggio').value;
    
    let testoData = data ? `\nData preferita: ${data}` : "";
    const oggetto = encodeURIComponent(`Nuova richiesta di appuntamento da ${nome} ${cognome}`);
    const corpoEmail = encodeURIComponent(
        `Ciao Alessandra,\n\nHai ricevuto una nuova richiesta dal tuo sito web.\n\nDettagli del cliente:\nNome: ${nome} ${cognome}${testoData}\n\nMessaggio:\n${messaggio}\n\n---\nPuoi rispondere direttamente a questa email per contattare il cliente.`
    );
    const emailDestinazione = "Dale2648@gmail.com";
    window.location.href = `mailto:${emailDestinazione}?subject=${oggetto}&body=${corpoEmail}`;
}

// =========================================
// ANIMAZIONI FADE-IN ALLO SCROLL
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const elementiDaAnimare = document.querySelectorAll('.animazione-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('mostra');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10 }); // Abbassato per farlo triggerare prima ed evitare accavallamenti visivi

    elementiDaAnimare.forEach(elemento => observer.observe(elemento));
});

// =========================================
// VISUALIZZATORE IMMAGINI AVANZATO (Lightbox)
// =========================================
let immaginiCorrenti = [];
let indiceCorrente = 0;

function apriImmagine(elementoScheda) {
    const carosello = elementoScheda.closest('.contenitore-carosello');
    const schede = Array.from(carosello.querySelectorAll('.scheda-immagine'));
    
    immaginiCorrenti = schede.map(scheda => scheda.querySelector('img').src);
    indiceCorrente = schede.indexOf(elementoScheda);
    
    aggiornaImmagineModale();
    
    const modale = document.getElementById("visualizzatore-immagini");
    modale.style.display = "block";
    document.body.style.overflow = "hidden"; 
}

function aggiornaImmagineModale() {
    const img = document.getElementById("immagine-ingrandita");
    img.src = immaginiCorrenti[indiceCorrente];
}

function cambiaImmagine(direzione, evento) {
    if(evento) evento.stopPropagation();
    
    indiceCorrente += direzione;
    
    if (indiceCorrente >= immaginiCorrenti.length) {
        indiceCorrente = 0;
    } else if (indiceCorrente < 0) {
        indiceCorrente = immaginiCorrenti.length - 1;
    }
    
    aggiornaImmagineModale();
}

function chiudiImmagine(evento) {
    if (evento && evento.target.id === 'visualizzatore-immagini') {
        chiudiImmagineForzata();
    }
}

function chiudiImmagineForzata() {
    document.getElementById("visualizzatore-immagini").style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener('keydown', (evento) => {
    const modaleAperta = document.getElementById("visualizzatore-immagini").style.display === "block";
    if (modaleAperta) {
        if (evento.key === "Escape") chiudiImmagineForzata();
        if (evento.key === "ArrowRight") cambiaImmagine(1);
        if (evento.key === "ArrowLeft") cambiaImmagine(-1);
    }
});

// =========================================
// SCORRIMENTO AUTOMATICO CAROSELLI (Ogni 4.8 secondi)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    let autoScrollInPausa = false;

    setInterval(() => {
        const modaleAperta = document.getElementById('visualizzatore-immagini').style.display === 'block';
        if (autoScrollInPausa || modaleAperta) return;

        document.querySelectorAll('.contenitore-carosello').forEach(carosello => {
            if(carosello.matches(':hover')) return;

            const primaScheda = carosello.querySelector('.scheda-immagine');
            if(!primaScheda) return;
            
            const quantitaScorrimento = primaScheda.offsetWidth + 25; 
            
            // Logica di reset robusta
            if (carosello.scrollLeft + carosello.clientWidth >= carosello.scrollWidth - 15) {
                carosello.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carosello.scrollBy({ left: quantitaScorrimento, behavior: 'smooth' });
            }
        });
    }, 4800);

    document.querySelectorAll('.contenitore-carosello').forEach(carosello => {
        carosello.addEventListener('touchstart', () => autoScrollInPausa = true, {passive: true});
        carosello.addEventListener('touchend', () => {
            setTimeout(() => autoScrollInPausa = false, 3000); 
        }, {passive: true});
    });
});

// =========================================
// LOGICA DELLA SCIA DI GLITTER
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    
    const generaColoreCasuale = () => {
        const lettere = '0123456789ABCDEF';
        let colore = '#';
        for (let i = 0; i < 6; i++) {
            colore += lettere[Math.floor(Math.random() * 16)];
        }
        return colore;
    };

    const coloreGlitterAttuale = generaColoreCasuale();
    
    const gestisciMovimento = (x, y) => {
        const modale = document.getElementById("visualizzatore-immagini");
        if (modale.style.display === "block") return; 

        const particellaGlitter = document.createElement('div');
        particellaGlitter.className = 'scia-glitter';
        
        particellaGlitter.style.left = `${x}px`;
        particellaGlitter.style.top = `${y}px`;
        particellaGlitter.style.backgroundColor = coloreGlitterAttuale;
        particellaGlitter.style.boxShadow = `0 0 10px 2px ${coloreGlitterAttuale}`;

        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;
        particellaGlitter.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        document.body.appendChild(particellaGlitter);

        setTimeout(() => particellaGlitter.remove(), 800);
    };

    window.addEventListener('mousemove', (evento) => {
        gestisciMovimento(evento.clientX, evento.clientY);
    });

    window.addEventListener('touchmove', (evento) => {
        const tocco = evento.touches[0];
        gestisciMovimento(tocco.clientX, tocco.clientY);
    }, {passive: true});
});
