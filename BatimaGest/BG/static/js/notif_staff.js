

const INITIAL_NOTIFICATIONS = JSON.parse(
  document.getElementById('notif-data').textContent);

// ---- État global admin ----
let adminState = {
    adminNotifications: INITIAL_NOTIFICATIONS,
};

// ============================================================
// SYSTÈME DE NOTIFICATIONS ADMIN
// ============================================================

function updateAdminNotifBadge() {
    const unread = adminState.adminNotifications.filter(n => !n.lue).length;
    const badge  = document.getElementById('admin-notif-badge');
    if (!badge) return;
    if (unread > 0) {
        badge.textContent = unread > 9 ? '9+' : unread;
        badge.classList.remove('hidden');
        badge.style.animation = 'none';
        requestAnimationFrame(() => { badge.style.animation = ''; });
    } else {
        badge.classList.add('hidden');
    }
}

function renderAdminNotifications() {
    const list = document.getElementById('admin-notif-list');
    if (!list) return;

    if (adminState.adminNotifications.length === 0) {
        list.innerHTML = `<div class="notif-empty"><span>📋</span><p>Aucune notification</p></div>`;
        return;
    }

    list.innerHTML = adminState.adminNotifications.map(n => `
        <div class="notif-item ${n.lue ? '' : 'notif-unread'}" data-id="${n.id}"
             role="button" tabindex="0"
             ${n.reportId ? `onclick="markAdminNotifRead('${n.id}'); showReportDetails('${n.reportId}');"` : `onclick="markAdminNotifRead('${n.id}')"`}>
            <div class="notif-icon">
                ${n.type === 'new_report' ? '📋' : n.type === 'status_update' ? '🔄' : 'ℹ️'}
            </div>
            <div class="notif-content">
                <p class="notif-message">${n.fields.message}</p>
                <span class="notif-time">${n.fields.created_at}</span>
            </div>
            ${!n.lue ? '<div class="notif-dot"></div>' : ''}
        </div>
    `).join('');
}

function markAdminNotifRead(notifId) {
    const notif = adminState.adminNotifications.find(n => n.id === notifId);
    if (notif && !notif.lue) {
        notif.lue = true;
        saveAdminNotifs();
        renderAdminNotifications();
        updateAdminNotifBadge();
    }
}

function markAllAdminNotifsRead() {
    adminState.adminNotifications.forEach(n => (n.lue = true));
    saveAdminNotifs();
    renderAdminNotifications();
    updateAdminNotifBadge();
    showToast('Toutes les notifications sont marquées comme lues.', 'info');
}

function initAdminNotifPanel() {
    const btn        = document.getElementById('admin-notif-btn');
    const panel      = document.getElementById('admin-notif-panel');
    const overlay    = document.getElementById('admin-notif-overlay');
    const closeBtn   = document.getElementById('close-admin-notif-panel');
    const markAllBtn = document.getElementById('admin-mark-all-read-btn');

    if (!btn || !panel) {
        console.log("btn or panel not found");
        return;}

    const openPanel  = () => { panel.classList.add('open'); overlay.classList.add('open'); };
    const closePanel = () => { panel.classList.remove('open'); overlay.classList.remove('open'); };

    btn.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    markAllBtn.addEventListener('click', () => { markAllAdminNotifsRead(); closePanel(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });
}

// ============================================================
// TOAST
// ============================================================

function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.log("container not found.");
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

// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Batima-Gest Admin — Initialisation...');
    renderAdminNotifications(); 
    initAdminNotifPanel();
    console.log('✅ Application admin prête !');
});