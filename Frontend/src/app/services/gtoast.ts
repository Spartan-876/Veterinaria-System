import { Injectable } from '@angular/core';

export interface ToastOptions {
  summary?: string;
  detail?: string;
  life?: number;
}

@Injectable({ providedIn: 'root' })
export class GToast {

  private container: HTMLElement | null = null;

  private config: Record<string, { bg: string; icon: string; progress: string }> = {
    success:  { bg: '#10b981', icon: 'pi pi-check-circle',      progress: '#059669' },
    error:    { bg: '#ef4444', icon: 'pi pi-times-circle',       progress: '#dc2626' },
    warn:     { bg: '#f59e0b', icon: 'pi pi-exclamation-triangle', progress: '#d97706' },
    info:     { bg: '#06b6d4', icon: 'pi pi-info-circle',        progress: '#0891b2' },
    contrast: { bg: '#1f2937', icon: 'pi pi-check',              progress: '#111827' },
    secondary:{ bg: '#6b7280', icon: 'pi pi-bell',               progress: '#4b5563' },
  };

  private init(): void {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'gtoast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);

      if (window.innerWidth <= 640) {
        this.container.style.right = '10px';
        this.container.style.left = '10px';
        this.container.style.top = '10px';
      }
    }
  }

  private show(type: string, title: string, message: string, duration = 3500): void {
    this.init();
    const cfg = this.config[type] ?? this.config['info'];
    const id = 'gtoast-' + Date.now();

    const toast = document.createElement('div');
    toast.id = id;
    toast.style.cssText = `
      pointer-events: auto;
      min-width: 300px;
      max-width: 380px;
      background: white;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
      overflow: hidden;
      transform: translateX(420px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      position: relative;
    `;

    if (window.innerWidth <= 640) {
      toast.style.minWidth = 'auto';
      toast.style.maxWidth = '100%';
    }

    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; padding:14px 16px; position:relative;">
        <div style="width:38px; height:38px; background:${cfg.bg}; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i class="${cfg.icon}" style="color:white; font-size:17px;"></i>
        </div>
        <div style="flex:1; min-width:0;">
          <h4 style="font-weight:700; font-size:14px; color:#111827; margin:0 0 2px 0; font-family:inherit;">
            ${title}
          </h4>
          <p style="font-size:12px; color:#6b7280; margin:0; line-height:1.5; font-family:inherit;">
            ${message}
          </p>
        </div>
        <button id="${id}-close"
                style="background:none; border:none; color:#d1d5db; cursor:pointer; padding:4px; width:24px; height:24px; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s;">
          <i class="pi pi-times" style="font-size:12px;"></i>
        </button>
      </div>
      <div id="${id}-bar" style="position:absolute; bottom:0; left:0; height:3px; background:${cfg.progress}; width:100%; transition:width ${duration}ms linear; border-radius:0 0 14px 14px;"></div>
    `;

    this.container!.appendChild(toast);

    // Animación entrada
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);

    // Iniciar barra de progreso
    const bar = document.getElementById(`${id}-bar`);
    setTimeout(() => {
      if (bar) bar.style.width = '0%';
    }, 50);

    // Botón cerrar
    const closeBtn = document.getElementById(`${id}-close`);
    closeBtn?.addEventListener('click', () => this.close(id));
    closeBtn?.addEventListener('mouseover', () => {
      if (closeBtn) { closeBtn.style.background = '#f3f4f6'; closeBtn.style.color = '#374151'; }
    });
    closeBtn?.addEventListener('mouseout', () => {
      if (closeBtn) { closeBtn.style.background = 'none'; closeBtn.style.color = '#d1d5db'; }
    });

    // Auto-cerrar
    let timeoutId = setTimeout(() => this.close(id), duration);

    // Pausar al hover
    toast.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      if (bar) { bar.style.transition = 'none'; }
    });

    toast.addEventListener('mouseleave', () => {
      if (bar) {
        const remaining = parseFloat(bar.style.width) / 100 * duration;
        bar.style.transition = `width ${remaining}ms linear`;
        bar.style.width = '0%';
        timeoutId = setTimeout(() => this.close(id), remaining);
      }
    });
  }

  private close(id: string): void {
    const toast = document.getElementById(id);
    if (toast) {
      toast.style.transform = 'translateX(420px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
        if (this.container && this.container.children.length === 0) {
          this.container.remove();
          this.container = null;
        }
      }, 350);
    }
  }

  success(detail: string, options?: Partial<ToastOptions>): void {
    this.show('success', options?.summary ?? 'Éxito', detail, options?.life ?? 3500);
  }

  error(detail: string, options?: Partial<ToastOptions>): void {
    this.show('error', options?.summary ?? 'Error', detail, options?.life ?? 5000);
  }

  warn(detail: string, options?: Partial<ToastOptions>): void {
    this.show('warn', options?.summary ?? 'Advertencia', detail, options?.life ?? 4000);
  }

  info(detail: string, options?: Partial<ToastOptions>): void {
    this.show('info', options?.summary ?? 'Información', detail, options?.life ?? 3500);
  }

  secondary(detail: string, options?: Partial<ToastOptions>): void {
    this.show('secondary', options?.summary ?? 'Aviso', detail, options?.life ?? 2500);
  }

  contrast(detail: string, options?: Partial<ToastOptions>): void {
    this.show('contrast', options?.summary ?? 'Éxito', detail, options?.life ?? 1500);
  }

  clear(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
