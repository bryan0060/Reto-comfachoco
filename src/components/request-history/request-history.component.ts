import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../services/leave.service';
import { GoogleCalendarService } from '../../services/google-calendar.service';
import { NotificationService } from '../../services/notification.service';
import { LeaveStatus, LeaveRequest } from '../../models/leave.model';

@Component({
  selector: 'app-request-history',
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-xl font-bold mb-4 text-gray-700">Historial de Solicitudes</h2>
      <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        @for (request of requests(); track request.id) {
          <div class="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors hover:bg-gray-50">
            <div class="flex items-center gap-4">
              <img [src]="request.userAvatar" alt="Avatar" class="h-12 w-12 rounded-full">
              <div>
                <p class="font-semibold text-gray-800">{{ request.userName }}</p>
                <p class="text-sm text-gray-500">{{ request.type }} | {{ request.startDate | date:'dd MMM' }} - {{ request.endDate | date:'dd MMM yyyy' }}</p>
                @if(request.reason) {
                  <p class="text-sm text-gray-600 mt-1 italic">"{{ request.reason }}"</p>
                }
              </div>
            </div>
            <div class="flex flex-col sm:items-end gap-2">
              <div class="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                   [class.bg-green-100]="request.status === 'Aprobado'"
                   [class.text-green-800]="request.status === 'Aprobado'"
                   [class.bg-red-100]="request.status === 'Rechazado'"
                   [class.text-red-800]="request.status === 'Rechazado'"
                   [class.bg-yellow-100]="request.status === 'Pendiente'"
                   [class.text-yellow-800]="request.status === 'Pendiente'">
                <span>{{ request.status }}</span>
              </div>
              @if (currentUser().role === 'Supervisor' && request.status === 'Pendiente') {
                <div class="flex gap-2 mt-2">
                  <button (click)="updateStatus(request.id, 'Aprobado')" class="bg-green-100 text-green-700 hover:bg-green-200 text-xs font-bold py-1 px-3 rounded-full transition-colors">
                    Aprobar
                  </button>
                  <button (click)="updateStatus(request.id, 'Rechazado')" class="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold py-1 px-3 rounded-full transition-colors">
                    Rechazar
                  </button>
                </div>
              }
               @if (request.status === 'Aprobado' && googleCalendarService.isLoggedIn()) {
                <div class="mt-2">
                  @if (request.syncedToCalendar) {
                    <span class="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 py-1 px-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Sincronizado
                    </span>
                  } @else {
                    <button (click)="syncToCalendar(request)" class="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-bold py-1 px-3 rounded-full transition-colors flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      Añadir a Google Calendar
                    </button>
                  }
                </div>
              }
            </div>
          </div>
        } @empty {
          <p class="text-center text-gray-500 py-4">No hay solicitudes para mostrar.</p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestHistoryComponent {
  private leaveService = inject(LeaveService);
  private notificationService = inject(NotificationService);
  googleCalendarService = inject(GoogleCalendarService);
  
  requests = this.leaveService.visibleRequests;
  currentUser = this.leaveService.currentUser;

  updateStatus(requestId: number, status: LeaveStatus): void {
    this.leaveService.updateRequestStatus(requestId, status);
  }

  async syncToCalendar(request: LeaveRequest): Promise<void> {
    try {
      await this.googleCalendarService.createEvent(request);
      this.leaveService.markRequestAsSynced(request.id);
      this.notificationService.addNotification({
        message: 'Ausencia añadida a Google Calendar.',
        type: 'success'
      });
    } catch (error) {
       this.notificationService.addNotification({
        message: 'Error al sincronizar con el calendario.',
        type: 'error'
      });
      console.error('Error syncing to calendar:', error);
    }
  }
}