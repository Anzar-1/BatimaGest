

console.log("bonjour");
const INITIAL_NOTIFICATIONS = JSON.parse(document.getElementById('notif-data').textContent)

let state = {
    user: null,
    isSignup: false,
    currentView: 'dashboard',
    selectedPriority: 'medium',
    imagePreview: null,
    notifications: INITIAL_NOTIFICATIONS,
    reports: [
        {
            id: '1',
            commonAreaId: 'elevator',
            commonAreaName: 'Ascenseur principal',
            description: "L'ascenseur fait un bruit étrange au 3ème étage",
            priority: 'high',
            status: 'in_progress',
            createdAt: new Date('2026-04-15'),
            updatedAt: new Date('2026-04-17')
        },
        {
            id: '2',
            commonAreaId: 'parking',
            commonAreaName: 'Parking souterrain',
            description: 'Une lampe est grillée près de la place 45',
            priority: 'low',
            status: 'pending',
            createdAt: new Date('2026-04-18'),
            updatedAt: new Date('2026-04-18')
        },
        {
            id: '3',
            commonAreaId: 'garden',
            commonAreaName: 'Jardin commun',
            description: 'La porte du jardin ne ferme plus correctement',
            priority: 'medium',
            status: 'resolved',
            createdAt: new Date('2026-04-10'),
            updatedAt: new Date('2026-04-16')
        }
    ]
};

const commonAreas = [
    { id: 'elevator', name: 'Ascenseur principal', icon: '🏢', description: 'Ascenseur desservant tous les étages' },
    { id: 'parking', name: 'Parking souterrain', icon: '🚗', description: 'Parking au sous-sol, 45 places' },
    { id: 'garden', name: 'Jardin commun', icon: '🌳', description: 'Espace vert avec aire de jeux' },
    { id: 'lobby', name: "Hall d'entrée", icon: '👥', description: 'Hall principal avec boîtes aux lettres' },
    { id: 'pool', name: 'Piscine', icon: '🏊', description: 'Piscine extérieure (été uniquement)' },
    { id: 'gym', name: 'Salle de sport', icon: '💪', description: 'Salle de fitness au 1er sous-sol' }
];

const statusLabels = {
    pending: { label: 'En attente', icon: '⏱️' },
    in_progress: { label: 'En cours', icon: '⚠️' },
    resolved: { label: 'Résolu', icon: '✅' }
};

const priorityLabels = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Haute'
};




// ============================================================
// SYSTÈME DE NOTIFICATIONS RÉSIDENT
// ============================================================

function updateNotifBadge() {
    const unread = state.notifications.filter(n => !n.lue).length;
    const badge  = document.getElementById('notif-badge');
    if (unread > 0) {
        badge.textContent = unread > 9 ? '9+' : unread;
        badge.classList.remove('hidden');
        badge.style.animation = 'none';
        requestAnimationFrame(() => { badge.style.animation = ''; });
    } else {
        badge.classList.add('hidden');
    }
}

function renderNotifications() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    if (state.notifications.length === 0) {
        list.innerHTML = `<div class="notif-empty"><span>🔔</span><p>Aucune notification</p></div>`;
        return;
    }

    list.innerHTML = state.notifications.map(n => `
        <div class="notif-item ${n.lue ? '' : 'notif-unread'}" data-id="${n.id}" role="button" tabindex="0">
            <div class="notif-icon">
                ${n.type === 'status_change' ? '🔄' : n.type === 'new_report' ? '📋' : 'ℹ️'}
            </div>
            <div class="notif-content">
                <p class="notif-message">${n.fields.message}</p>
                <span class="notif-time">${n.fields.created_at}</span>
            </div>
            ${!n.lue ? '<div class="notif-dot"></div>' : ''}
        </div>
    `).join('');

    list.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', () => markNotifRead(item.dataset.id));
    });
}

function markNotifRead(notifId) {
    const notif = state.notifications.find(n => n.id === notifId);
    if (notif && !notif.lue) {
        notif.lue = true;
        saveNotifications();
        renderNotifications();
        updateNotifBadge();
    }
}

function markAllNotifRead() {
    state.notifications.forEach(n => (n.lue = true));
    saveNotifications();
    renderNotifications();
    updateNotifBadge();
    showToast('Toutes les notifications sont marquées comme lues.', 'info');
}

function initNotifPanel() {
    const btn        = document.getElementById('notifications-btn');
    const panel      = document.getElementById('notif-panel');
    const overlay    = document.getElementById('notif-overlay');
    const closeBtn   = document.getElementById('close-notif-panel');
    const markAllBtn = document.getElementById('mark-all-read-btn');

    if (!btn || !panel) 
        {   console.log("Btn ou Panel non trouvée")
            return;}


    const openPanel = () => {
        panel.classList.add('open');
        overlay.classList.add('open');
    };
    const closePanel = () => {
        panel.classList.remove('open');
        overlay.classList.remove('open');
    };

    btn.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    markAllBtn.addEventListener('click', markAllNotifRead);

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });
}

// ============================================================
// TOAST
// ============================================================

function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) 
        {   console.log("container not found")
            return;}

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✅', error: '❌', info: '🔔', warning: '⚠️' };
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || '🔔'}</span>
        <span class="toast-msg">${message}</span>
        <button class="toast-close" aria-label="Fermer">×</button>`;
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// Utilitaires
function formatDate(date) {
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(date) {
    const months = ['janv', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showView(viewId) {
    state.currentView = viewId;
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewId}-view`).classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-view="${viewId}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Navigation
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(tab => {
        tab.addEventListener('click', () => {
            showView(tab.dataset.view);
            if (tab.dataset.view === 'areas') {
                renderAreas();
            }
        });
    });
}

//trying to disable button after click:
function a(element) {
  element.disabled = true;
}



// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderNotifications();
    initNotifPanel();
});
