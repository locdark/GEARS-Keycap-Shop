// ============================================================================
// GEARS KEYCAP SHOP - NOTIFICATION SERVICE (OOP SINGLETON)
// Quan ly thong bao Toast notification hien dai
// ============================================================================

class NotificationService {
    constructor() {
        if (NotificationService.instance) {
            return NotificationService.instance;
        }
        this._containerId = 'gears-toast-container';
        NotificationService.instance = this;
    }

    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    _getOrCreateContainer() {
        if (typeof document === 'undefined') return null;
        let container = document.getElementById(this._containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = this._containerId;
            container.style.cssText = `
                position: fixed;
                top: 24px;
                right: 24px;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
                max-width: 380px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        if (typeof document === 'undefined') {
            console.log(`[Notification:${type}] ${message}`);
            return;
        }

        const container = this._getOrCreateContainer();
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `gears-toast toast-${type}`;
        
        const colors = {
            success: { bg: '#10b981', icon: 'fa-check-circle', border: 'rgba(16, 185, 129, 0.4)' },
            error: { bg: '#ef4444', icon: 'fa-exclamation-circle', border: 'rgba(239, 68, 68, 0.4)' },
            warning: { bg: '#f59e0b', icon: 'fa-exclamation-triangle', border: 'rgba(245, 158, 11, 0.4)' },
            info: { bg: '#3b82f6', icon: 'fa-info-circle', border: 'rgba(59, 130, 246, 0.4)' }
        };

        const theme = colors[type] || colors.info;

        toast.style.cssText = `
            background: #151822;
            color: #ffffff;
            border-left: 4px solid ${theme.bg};
            border-top: 1px solid ${theme.border};
            border-right: 1px solid ${theme.border};
            border-bottom: 1px solid ${theme.border};
            padding: 14px 18px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
            font-size: 13.5px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(8px);
        `;

        toast.innerHTML = `
            <i class="fas ${theme.icon}" style="color: ${theme.bg}; font-size: 16px;"></i>
            <span style="flex: 1; line-height: 1.4;">${message}</span>
            <span style="cursor: pointer; opacity: 0.6; font-size: 14px;" onclick="this.parentElement.remove()">&times;</span>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 10);

        // Auto dismiss
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 300);
        }, duration);
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    info(message) {
        this.show(message, 'info');
    }

    warning(message) {
        this.show(message, 'warning');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationService;
}
if (typeof window !== 'undefined') {
    window.NotificationService = NotificationService;
}
