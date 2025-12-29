import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: Type;
}

enum Type {
  success,
  error,
  info,
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toast = this._toasts.asReadonly();

  show(message: string, type: Type = Type.success) {
    const id = Date.now();
    const newToast = { id, message, type };
    this._toasts.update((current) => [...current, newToast]);
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }
  remove(id: number) {
    this._toasts.update((allToasts) =>
      allToasts.filter((t: Toast) => t.id !== id)
    );
  }
}
