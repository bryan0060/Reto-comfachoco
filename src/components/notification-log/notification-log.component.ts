import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../models/notification.model';

@Component({
  selector: 'app-notification-log',
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-xl font-bold mb-4 text-gray-700">Registro de Actividad</h2>
      <div class="space-y-3 max-h-60 overflow-y-auto pr-2">
        @for (notification of notifications(); track notification.id) {
          <div class="flex items-start gap-3 p-3 rounded-lg" [class]="getNotificationClass(notification.type)">
             <div class="flex-shrink-0 w-5 h-5 mt-0.5">
               @switch(notification.type) {
                 @case('success') {
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                   </svg>
                 }
                 @case('error') {
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                   </svg>
                 }
                 @case('info') {
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                   </svg>
                 }
                 @case('warning') {
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                   </svg>
                 }
               }
             </div>
            <div>
              <p class="text-sm font-medium" [class]="getTextClass(notification.type)">{{ notification.message }}</p>
              <p class="text-xs text-gray-500">{{ notification.timestamp | date:'short' }}</p>
            </div>
          </div>
        } @empty {
          <p class="text-center text-gray-500 py-4">No hay notificaciones recientes.</p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationLogComponent {
  private notificationService = inject(NotificationService);
  notifications = this.notificationService.notifications;

  getNotificationClass(type: NotificationType): string {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-yellow-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  }

  getTextClass(type: NotificationType): string {
    switch(type) {
      case 'success': return 'text-green-800';
      case 'error': return 'text-red-800';
      case 'warning': return 'text-yellow-800';
      case 'info': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  }
}
