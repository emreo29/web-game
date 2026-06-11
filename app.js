// ==========================================
// 1. SOUNDEFFEKTE LADEN
// ==========================================
const hoverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');

hoverSound.volume = 0.1;
clickSound.volume = 0.4;

// ==========================================
// 2. TASTATUR & MENÜ LOGIK
// ==========================================
let currentIndex = 0; 
let bgmStarted = false;

// Hilfs-Funktion: Findet alle sichtbaren Buttons
function getVisibleButtons() {
    const buttons = Array.from(document.querySelectorAll('.nav-btn'));
    return buttons.filter(btn => !btn.closest('.hidden'));
}

// Setzt den visuellen Fokus auf den richtigen Button
function updateFocus() {
    const visibleButtons = getVisibleButtons();
    if (visibleButtons.length > 0) {
        visibleButtons[currentIndex].focus(); // Das löst automatisch den "focus" Event-Listener aus!
    }
}

// Hört auf die Pfeiltasten (Jetzt auch Links/Rechts fürs Tekken-Menü!)
document.addEventListener('keydown', (e) => {
    const visibleButtons = getVisibleButtons();
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault(); 
        currentIndex++;
        if (currentIndex >= visibleButtons.length) currentIndex = 0; 
        updateFocus();
    } 
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        currentIndex--;
        if (currentIndex < 0) currentIndex = visibleButtons.length - 1; 
        updateFocus();
    }
});

// ==========================================
// 3. SOUNDS & AUTOMATISCHER CHARAKTERWECHSEL
// ==========================================
const allButtons = document.querySelectorAll('.nav-btn');

allButtons.forEach(button => {
    // Wenn die Maus drüberfährt, synchronisiere die Tastatur-Position
    button.addEventListener('mouseenter', (e) => {
        const visibleButtons = getVisibleButtons();
        currentIndex = visibleButtons.indexOf(e.target); 
        e.target.focus(); 
    });

    // Wenn der Button in den FOKUS rückt (durch Maus oder Pfeiltasten)
    button.addEventListener('focus', () => {
        // 1. Hover-Sound abspielen
        hoverSound.currentTime = 0; 
        hoverSound.play();

        // 2. NEU: Wenn es ein Charakter-Button ist, wechsle sofort das Bild!
        if (button.classList.contains('char-slot')) {
            const charName = button.getAttribute('data-char');
            const charImg = button.getAttribute('data-img');
            wechselCharakterBild(charName, charImg);
        }
    });

    // Wenn geklickt wird (Bestätigungssound)
    button.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

// ==========================================
// 4. CHARAKTER-WECHSEL FUNKTION
// ==========================================
function wechselCharakterBild(name, imagePath) {
    const renderImg = document.getElementById('main-render');
    
    // Verhindert nerviges Flackern, wenn das Bild eh schon geladen ist
    if (renderImg.src.includes(imagePath)) return;
    
    renderImg.style.opacity = 0;
    setTimeout(() => {
        renderImg.src = imagePath;
        document.getElementById('char-name').innerHTML = `<span>${name}</span>`;
        renderImg.style.opacity = 1;
    }, 150);
}

// ==========================================
// 5. MENÜ HIN- UND HERSCHALTEN
// ==========================================
const mainMenu = document.getElementById('mainMenu');
const optionsMenu = document.getElementById('optionsMenu');
const charSelectMenu = document.getElementById('charSelectMenu');

const btnOptions = document.getElementById('btnOptions');
const btnBack = document.getElementById('btnBack');
const btnNewGame = document.getElementById('btnNewGame');
const btnBackFromChar = document.getElementById('btnBackFromChar');

// Klick auf "Optionen"
btnOptions.addEventListener('click', () => {
    mainMenu.classList.add('hidden');          
    optionsMenu.classList.remove('hidden');    
    optionsMenu.classList.add('fade-in');      
    currentIndex = 0;
    setTimeout(updateFocus, 100);
});

// Klick auf "Zurück" aus den Optionen
btnBack.addEventListener('click', () => {
    optionsMenu.classList.add('hidden');       
    mainMenu.classList.remove('hidden');       
    mainMenu.classList.add('fade-in');         
    currentIndex = 0;
    setTimeout(updateFocus, 100);
});

// Klick auf "Neues Spiel" öffnet Charakter-Auswahl UND startet Musik
btnNewGame.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    charSelectMenu.classList.remove('hidden');
    charSelectMenu.classList.add('fade-in');
    
    // Tekken Musik starten
    let bgm = document.getElementById('bgm');
    bgm.volume = 0.3;
    bgm.play().catch(e => console.log("Musik wurde vom Browser blockiert"));
    bgmStarted = true;

    currentIndex = 0;
    setTimeout(updateFocus, 100); 
});

// Klick auf "Zurück" aus der Charakter-Auswahl
btnBackFromChar.addEventListener('click', () => {
    charSelectMenu.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    mainMenu.classList.add('fade-in');
    
    // Tekken Musik stoppen
    const bgm = document.getElementById('bgm');
    bgm.pause();
    bgm.currentTime = 0; 
    bgmStarted = false;

    currentIndex = 0;
    setTimeout(updateFocus, 100);
});

// Beim allerersten Laden der Seite direkt den ersten Button anvisieren
updateFocus();