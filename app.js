// --- 1. Soundeffekte laden ---
const hoverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Kurzes Ticken
const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'); // Tieferer Bestätigungs-Sound

// Lautstärke anpassen (Menü-Sounds sollten dezent sein)
hoverSound.volume = 0.1;
clickSound.volume = 0.4;

// --- 2. Sounds an ALLE Buttons heften ---
const allButtons = document.querySelectorAll('.nav-btn');

allButtons.forEach(button => {
    // Wenn die Maus drüberfährt
    button.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0; // Spult den Sound auf Anfang
        hoverSound.play();
    });

    // Wenn geklickt wird
    button.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

// --- 3. Menü-Navigation (Das Hin- und Herschalten) ---
const mainMenu = document.getElementById('mainMenu');
const optionsMenu = document.getElementById('optionsMenu');

const btnOptions = document.getElementById('btnOptions');
const btnBack = document.getElementById('btnBack');

// Klick auf "Optionen"
btnOptions.addEventListener('click', () => {
    mainMenu.classList.add('hidden');          // Hauptmenü verstecken
    optionsMenu.classList.remove('hidden');    // Optionen anzeigen
    optionsMenu.classList.add('fade-in');      // Coole Animation abspielen
});

// Klick auf "Zurück"
btnBack.addEventListener('click', () => {
    optionsMenu.classList.add('hidden');       // Optionen verstecken
    mainMenu.classList.remove('hidden');       // Hauptmenü anzeigen
    mainMenu.classList.add('fade-in');         // Coole Animation abspielen
});


// --- 4. Tastatur-Steuerung (Gamepad-Feeling) ---
let currentIndex = 0; // Merkt sich, auf welchem Button wir gerade stehen

// Hilfs-Funktion: Findet nur die Buttons, die aktuell auf dem Bildschirm sichtbar sind
function getVisibleButtons() {
    const buttons = Array.from(document.querySelectorAll('.nav-btn'));
    // Filtert alle Buttons raus, die im versteckten Kasten (.hidden) liegen
    return buttons.filter(btn => !btn.closest('.hidden'));
}

// Setzt den visuellen Fokus auf den richtigen Button
function updateFocus() {
    const visibleButtons = getVisibleButtons();
    if (visibleButtons.length > 0) {
        visibleButtons[currentIndex].focus(); // Simuliert, dass wir mit der Maus drauf sind
        
        // Den Hover-Sound auch bei der Tastatur abspielen!
        hoverSound.currentTime = 0;
        hoverSound.play();
    }
}

// Hört auf die Pfeiltasten
document.addEventListener('keydown', (e) => {
    const visibleButtons = getVisibleButtons();
    
    if (e.key === 'ArrowDown') {
        e.preventDefault(); // Verhindert, dass die ganze Seite scrollt
        currentIndex++;
        // Wenn wir ganz unten sind, springen wir wieder nach oben!
        if (currentIndex >= visibleButtons.length) currentIndex = 0; 
        updateFocus();
    } 
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex--;
        // Wenn wir ganz oben sind, springen wir nach ganz unten!
        if (currentIndex < 0) currentIndex = visibleButtons.length - 1; 
        updateFocus();
    }
    // Die Enter-Taste müssen  nicht extra programmieren! 
    // Der Browser klickt fokussierte Buttons bei "Enter" automatisch.
});

// Profi-Trick: Maus und Tastatur synchronisieren!
// Wenn du zwischendurch die Maus benutzt, merkt sich die Tastatur die neue Position.
const allNavButtons = document.querySelectorAll('.nav-btn');
allNavButtons.forEach((button) => {
    button.addEventListener('mouseenter', (e) => {
        const visibleButtons = getVisibleButtons();
        // Suche die Position des Buttons, auf dem die Maus gerade ist
        currentIndex = visibleButtons.indexOf(e.target); 
        e.target.focus();
    });
});

// Wenn wir das Menü wechseln (Optionen öffnen/schließen), setzen wir die Auswahl wieder nach ganz oben
btnOptions.addEventListener('click', () => {
    currentIndex = 0;
    setTimeout(updateFocus, 100); // 100 Millisekunden warten, bis das neue Menü da ist
});

btnBack.addEventListener('click', () => {
    currentIndex = 0;
    setTimeout(updateFocus, 100);
});

// Beim allerersten Laden der Seite direkt den ersten Button anvisieren
updateFocus();

// =========================================
// 5. NEU: CHARACTER SELECT LOGIK
// =========================================

const btnNewGame = document.getElementById('btnNewGame');
const charSelectMenu = document.getElementById('charSelectMenu');
const btnBackFromChar = document.getElementById('btnBackFromChar');
let bgmStarted = false;

// Klick auf "Neues Spiel" öffnet das Character Select
btnNewGame.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    charSelectMenu.classList.remove('hidden');
    charSelectMenu.classList.add('fade-in');
    
    // Setzt die Pfeiltasten-Steuerung auf das erste Charakter-Icon
    currentIndex = 0;
    setTimeout(updateFocus, 100); 
});

// Klick auf "Zurück" im Character Select
btnBackFromChar.addEventListener('click', () => {
    charSelectMenu.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    mainMenu.classList.add('fade-in');
    
    // Tekken Musik stoppen beim Zurückgehen
    const bgm = document.getElementById('bgm');
    bgm.pause();
    bgm.currentTime = 0; // Spult die Musik auf Anfang
    bgmStarted = false;

    currentIndex = 0;
    setTimeout(updateFocus, 100);
});

// Funktion, um den Charakter zu wechseln (wird im HTML über onclick aufgerufen)
window.selectChar = function(name, imagePath) {
    const renderImg = document.getElementById('main-render');
    
    // Kurzer Fade-Effekt für das Render-Bild
    renderImg.style.opacity = 0;
    setTimeout(() => {
        renderImg.src = imagePath;
        document.getElementById('char-name').innerHTML = `<span>${name}</span>`;
        renderImg.style.opacity = 1;
    }, 150);
    
    // Musik beim ersten Klick starten
    if (!bgmStarted) {
        let bgm = document.getElementById('bgm');
        bgm.volume = 0.3; // Nicht zu laut starten
        bgm.play().catch(e => console.log("Audio play prevented by browser"));
        bgmStarted = true;
    }
};