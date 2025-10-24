import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';

// Models
import { NewLeaveRequest } from './models/leave.model';

// Components
import { HeaderComponent } from './components/header/header.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LeaveBalanceComponent } from './components/leave-balance/leave-balance.component';
import { RequestHistoryComponent } from './components/request-history/request-history.component';
import { TeamCalendarComponent } from './components/team-calendar/team-calendar.component';
import { RequestFormComponent } from './components/request-form/request-form.component';
import { NotificationLogComponent } from './components/notification-log/notification-log.component';

// Services
import { LeaveService } from './services/leave.service';
import { NotificationService } from './services/notification.service';
import { GoogleCalendarService } from './services/google-calendar.service';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    UserProfileComponent,
    LeaveBalanceComponent,
    RequestHistoryComponent,
    TeamCalendarComponent,
    RequestFormComponent,
    NotificationLogComponent,
  ],
  template: `
    <div class="bg-gray-50 min-h-screen font-sans">
      <app-header></app-header>
      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-8">
            @if (leaveService.currentUser().role === 'Empleado') {
              <app-leave-balance (newRequest)="showRequestForm.set(true)"></app-leave-balance>
            }
            <app-request-history></app-request-history>
          </div>

          <!-- Right Column -->
          <div class="space-y-8">
            <app-user-profile></app-user-profile>
            <app-team-calendar></app-team-calendar>
            <app-notification-log></app-notification-log>
          </div>
        </div>
      </main>

      @if (showRequestForm()) {
        <app-request-form 
          (closeModal)="showRequestForm.set(false)"
          (formSubmitted)="handleLeaveRequest($event)">
        </app-request-form>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  leaveService = inject(LeaveService);
  private notificationService = inject(NotificationService);
  private googleCalendarService = inject(GoogleCalendarService);

  showRequestForm = signal(false);

  constructor() {
    this.googleCalendarService.initClient();
  }

  async handleLeaveRequest(formData: NewLeaveRequest): Promise<void> {
    try {
      this.notificationService.addNotification({
        message: `Procesando solicitud de ${formData.type}...`,
        type: 'info',
      });
      this.showRequestForm.set(false);

      await this.leaveService.addLeaveRequest(formData);

      this.notificationService.addNotification({
        message: 'Solicitud de ausencia enviada con éxito.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      this.notificationService.addNotification({
        message: 'Error al enviar la solicitud. Inténtalo de nuevo.',
        type: 'error',
      });
    }
  }
}