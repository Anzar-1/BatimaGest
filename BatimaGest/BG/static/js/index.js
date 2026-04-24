let state = {
    user: null,
    isSignup: false,
    currentView: 'dashboard',
    selectedPriority: 'medium',
    imagePreview: null,
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

// Login
function initLogin() {
    const loginForm = document.getElementById('login-form');
    const toggleSignup = document.getElementById('toggle-signup');
    const nameField = document.getElementById('name-field');
    const loginIcon = document.getElementById('login-icon');
    const loginText = document.getElementById('login-text');

    toggleSignup.addEventListener('click', () => {
        state.isSignup = !state.isSignup;

        if (state.isSignup) {
            nameField.classList.remove('hidden');
            loginIcon.textContent = '✍️';
            loginText.textContent = "S'inscrire";
            toggleSignup.textContent = 'Déjà un compte ? Se connecter';
        } else {
            nameField.classList.add('hidden');
            loginIcon.textContent = '🔑';
            loginText.textContent = 'Se connecter';
            toggleSignup.textContent = "Pas de compte ? S'inscrire";
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value || email.split('@')[0];

        state.user = { email, name };
        document.getElementById('welcome-text').textContent = `Bienvenue, ${name}`;

        showPage('dashboard-page');
        updateDashboard();
    });
}

// Logout
function initLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        state.user = null;
        document.getElementById('login-form').reset();
        showPage('login-page');
    });
}

// Navigation
function initNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            showView(tab.dataset.view);
            if (tab.dataset.view === 'areas') {
                renderAreas();
            }
        });
    });
}

// Dashboard
function updateDashboard() {
    updateStats();
    renderReports();
}

function updateStats() {
    const pending = state.reports.filter(r => r.status === 'pending').length;
    const inProgress = state.reports.filter(r => r.status === 'in_progress').length;
    const resolved = state.reports.filter(r => r.status === 'resolved').length;

    document.getElementById('pending-count').textContent = pending;
    document.getElementById('inprogress-count').textContent = inProgress;
    document.getElementById('resolved-count').textContent = resolved;

    const badge = document.getElementById('notification-badge');
    if (pending > 0) {
        badge.textContent = pending;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function renderReports() {
    const container = document.getElementById('reports-list');

    if (state.reports.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Aucun signalement</h3>
                <p>Vous n'avez pas encore créé de signalement.</p>
            </div>
        `;
        return;
    }

    const html = `
        <h2 class="reports-header">Historique des signalements</h2>
        ${state.reports.map(report => {
            const status = statusLabels[report.status];
            return `
                <div class="report-card">
                    <div class="report-header">
                        <div class="report-title-area">
                            <div class="report-title-row">
                                <h3 class="report-title">${report.commonAreaName}</h3>
                                <span class="priority-badge ${report.priority}">${priorityLabels[report.priority]}</span>
                            </div>
                            <p class="report-description">${report.description}</p>
                            <div class="report-meta">
                                <span>📅 ${formatDate(report.createdAt)}</span>
                                ${report.status !== 'pending' ? `<span>⏱️ Mis à jour le ${formatDateShort(report.updatedAt)}</span>` : ''}
                            </div>
                        </div>
                        <div class="status-badge ${report.status}">
                            <span>${status.icon}</span>
                            <span>${status.label}</span>
                        </div>
                    </div>
                    ${report.image ? `<img src="${report.image}" alt="Photo du signalement" class="report-image">` : ''}
                </div>
            `;
        }).join('')}
    `;

    container.innerHTML = html;
}

// Areas
function renderAreas() {
    const container = document.getElementById('areas-grid');

    const html = commonAreas.map(area => {
        const issues = state.reports.filter(r =>
            r.commonAreaId === area.id &&
            (r.status === 'pending' || r.status === 'in_progress')
        ).length;

        return `
            <div class="area-card">
                <div class="area-content">
                    <div class="area-icon">${area.icon}</div>
                    <div class="area-info">
                        <h3 class="area-name">${area.name}</h3>
                        <p class="area-description">${area.description}</p>
                        ${issues > 0
                            ? `<div class="area-status warning">⚠️ ${issues} signalement${issues > 1 ? 's' : ''} actif${issues > 1 ? 's' : ''}</div>`
                            : '<div class="area-status success">✓ Aucun incident</div>'
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// Create Report
function initCreateReport() {
    const newReportBtn = document.getElementById('new-report-btn');
    const createFromAreasBtn = document.getElementById('create-from-areas-btn');
    const cancelBtn = document.getElementById('cancel-report-btn');
    const reportForm = document.getElementById('report-form');
    const commonAreaSelect = document.getElementById('common-area');
    const priorityButtons = document.querySelectorAll('.priority-btn');
    const imageInput = document.getElementById('image-input');
    const uploadArea = document.getElementById('image-upload-area');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImageBtn = document.getElementById('remove-image');

    // Remplir le select des parties communes
    commonAreas.forEach(area => {
        const option = document.createElement('option');
        option.value = area.id;
        option.textContent = area.name;
        commonAreaSelect.appendChild(option);
    });

    newReportBtn.addEventListener('click', () => {
        showView('create');
        resetForm();
    });

    createFromAreasBtn.addEventListener('click', () => {
        showView('create');
        resetForm();
    });

    cancelBtn.addEventListener('click', () => {
        showView('dashboard');
        resetForm();
    });

    // Gestion de la priorité
    priorityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            priorityButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedPriority = btn.dataset.priority;
        });
    });

    // Upload d'image
    uploadPlaceholder.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                state.imagePreview = reader.result;
                previewImg.src = reader.result;
                uploadPlaceholder.classList.add('hidden');
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.imagePreview = null;
        imageInput.value = '';
        uploadPlaceholder.classList.remove('hidden');
        imagePreview.classList.add('hidden');
    });

    // Soumission du formulaire
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const commonAreaId = commonAreaSelect.value;
        const description = document.getElementById('description').value;

        if (!commonAreaId || !description.trim()) {
            return;
        }

        const commonArea = commonAreas.find(a => a.id === commonAreaId);

        const newReport = {
            id: Date.now().toString(),
            commonAreaId,
            commonAreaName: commonArea.name,
            description,
            priority: state.selectedPriority,
            status: 'pending',
            image: state.imagePreview,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        state.reports.unshift(newReport);

        showView('dashboard');
        updateDashboard();
        resetForm();
    });
}

function resetForm() {
    document.getElementById('report-form').reset();
    document.getElementById('common-area').value = '';
    document.getElementById('description').value = '';

    // Reset priority
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.priority === 'medium') {
            btn.classList.add('active');
        }
    });
    state.selectedPriority = 'medium';

    // Reset image
    state.imagePreview = null;
    document.getElementById('image-input').value = '';
    document.getElementById('upload-placeholder').classList.remove('hidden');
    document.getElementById('image-preview').classList.add('hidden');
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initLogout();
    initNavigation();
    initCreateReport();
    updateDashboard();
});