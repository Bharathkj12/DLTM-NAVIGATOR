// ── Dubai DLTM Projection Definition ──────────────────
const DUBAI_DLTM =
    '+proj=tmerc +lat_0=0 +lon_0=55.3333333333333 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs';
const WGS84 = 'EPSG:4326'; // standard lat/lon

// ── State ─────────────────────────────────────────────
// ── State ─────────────────────────────────────────────
let currentMode = 'dltm'; // 'dltm' or 'gps'
let currentLat = null;
let currentLng = null;

// ── DOM refs ──────────────────────────────────────────
const eastingInput = document.getElementById('easting');
const northingInput = document.getElementById('northing');
const latInput = document.getElementById('latitude');
const lngInput = document.getElementById('longitude');

const inputDltm = document.getElementById('input-dltm');
const inputGps = document.getElementById('input-gps');
const resDltm = document.getElementById('res-dltm');
const resGps = document.getElementById('res-gps');

const resLat = document.getElementById('res-lat');
const resLng = document.getElementById('res-lng');
const resEasting = document.getElementById('res-easting');
const resNorthing = document.getElementById('res-northing');

const resultsEl = document.getElementById('results');
const errorEl = document.getElementById('error');
const btnMaps = document.getElementById('btn-maps');
const btnWhatsApp = document.getElementById('btn-whatsapp');
const btnDltm = document.getElementById('mode-dltm');
const btnGps = document.getElementById('mode-gps');

// ── Helpers ───────────────────────────────────────────
function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
}

function clearError() {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
}

function setActionButtons(enabled) {
    btnMaps.disabled = !enabled;
    btnWhatsApp.disabled = !enabled;
}

function setMode(mode) {
    currentMode = mode;
    clearError();
    resultsEl.classList.remove('visible');
    setActionButtons(false);

    if (mode === 'dltm') {
        btnDltm.classList.add('active');
        btnGps.classList.remove('active');
        inputDltm.style.display = 'block';
        inputGps.style.display = 'none';
        resDltm.style.display = 'block';
        resGps.style.display = 'none';
    } else {
        btnGps.classList.add('active');
        btnDltm.classList.remove('active');
        inputDltm.style.display = 'none';
        inputGps.style.display = 'block';
        resDltm.style.display = 'none';
        resGps.style.display = 'block';
    }
}

// ── Convert ───────────────────────────────────────────
function convert() {
    clearError();

    if (currentMode === 'dltm') {
        convertDltmToGps();
    } else {
        convertGpsToDltm();
    }
}

function convertDltmToGps() {
    const eastingRaw = eastingInput.value.trim();
    const northingRaw = northingInput.value.trim();

    if (!eastingRaw || !northingRaw) {
        showError('Please enter both Easting and Northing values.');
        return;
    }

    const easting = parseFloat(eastingRaw);
    const northing = parseFloat(northingRaw);

    if (isNaN(easting) || isNaN(northing)) {
        showError('Coordinates must be valid numbers.');
        return;
    }

    if (easting < 0 || northing < 0) {
        showError('Values must be positive.');
        return;
    }

    try {
        const [lng, lat] = proj4(DUBAI_DLTM, WGS84, [easting, northing]);
        updateResults(lat, lng, easting, northing);
    } catch (err) {
        showError('Conversion failed. Check your coordinates.');
    }
}

function convertGpsToDltm() {
    const latRaw = latInput.value.trim();
    const lngRaw = lngInput.value.trim();

    if (!latRaw || !lngRaw) {
        showError('Please enter both Latitude and Longitude values.');
        return;
    }

    const lat = parseFloat(latRaw);
    const lng = parseFloat(lngRaw);

    if (isNaN(lat) || isNaN(lng)) {
        showError('Coordinates must be valid numbers.');
        return;
    }

    // Basic geographic sanity checks
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        showError('Invalid Latitude or Longitude range.');
        return;
    }

    try {
        const [easting, northing] = proj4(WGS84, DUBAI_DLTM, [lng, lat]);
        updateResults(lat, lng, easting, northing);
    } catch (err) {
        showError('Conversion failed. Check your coordinates.');
    }
}

function updateResults(lat, lng, easting, northing) {
    currentLat = lat;
    currentLng = lng;

    // Update GPS results
    resLat.textContent = lat.toFixed(8);
    resLng.textContent = lng.toFixed(8);

    // Update DLTM results (round to 2 decimal places for meters)
    resEasting.textContent = easting.toFixed(3);
    resNorthing.textContent = northing.toFixed(3);

    resultsEl.classList.add('visible');
    setActionButtons(true);
}

// ── Google Maps & WhatsApp (Shared) ───────────────────
function openGoogleMaps() {
    if (currentLat === null || currentLng === null) return;
    const url = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
    window.open(url, '_blank');
}

function shareWhatsApp() {
    if (currentLat === null || currentLng === null) return;
    const mapsUrl = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
    // Show DLTM or GPS depending on what was calculated/input?
    // Let's just share the location link for simplicity.
    const message = `Here is the location: ${mapsUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ── Allow Enter key ───────────────────────────────────
eastingInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
northingInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
latInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
lngInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
