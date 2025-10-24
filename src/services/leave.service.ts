import { Injectable, signal, computed, inject } from '@angular/core';
import { Employee, LeaveBalance, LeaveRequest, TeamMemberLeave, NewLeaveRequest, LeaveType, LeaveStatus } from '../models/leave.model';
import { NotificationService } from './notification.service';

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: 'Elena Rodríguez',
    position: 'Frontend Developer',
    email: 'elena.rodriguez@example.com',
    avatar: 'https://i.pravatar.cc/100?u=carlos',
    role: 'Empleado',
    leaveBalances: [
      { type: 'Vacaciones', total: 20, used: 5, remaining: 15 },
      { type: 'Permiso por enfermedad', total: 10, used: 2, remaining: 8 },
      { type: 'Asuntos personales', total: 5, used: 1, remaining: 4 },
    ]
  },
  {
    id: 2,
    name: 'Carlos Méndez',
    position: 'Team Lead',
    email: 'carlos.mendez@example.com',
    avatar: 'https://i.pravatar.cc/100?u=elena',
    role: 'Supervisor',
    leaveBalances: [
      { type: 'Vacaciones', total: 25, used: 10, remaining: 15 },
      { type: 'Permiso por enfermedad', total: 10, used: 0, remaining: 10 },
      { type: 'Asuntos personales', total: 5, used: 3, remaining: 2 },
    ]
  }
];

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
    { id: 1, userId: 1, userName: 'Elena Rodríguez', userAvatar: 'https://i.pravatar.cc/100?u=elena', type: 'Vacaciones', startDate: '2024-07-20', endDate: '2024-07-25', status: 'Aprobado', reason: 'Vacaciones de verano', syncedToCalendar: false },
    { id: 2, userId: 1, userName: 'Elena Rodríguez', userAvatar: 'https://i.pravatar.cc/100?u=elena', type: 'Permiso por enfermedad', startDate: '2024-06-10', endDate: '2024-06-10', status: 'Aprobado', syncedToCalendar: true },
    { id: 3, userId: 1, userName: 'Elena Rodríguez', userAvatar: 'https://i.pravatar.cc/100?u=elena', type: 'Asuntos personales', startDate: '2024-08-05', endDate: '2024-08-05', status: 'Pendiente', reason: 'Cita médica', syncedToCalendar: false },
    { id: 4, userId: 1, userName: 'Elena Rodríguez', userAvatar: 'https://i.pravatar.cc/100?u=elena', type: 'Vacaciones', startDate: '2024-12-24', endDate: '2025-01-02', status: 'Pendiente', reason: 'Fiestas de fin de año', syncedToCalendar: false },
];

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private notificationService = inject(NotificationService);

  employees = signal<Employee[]>(MOCK_EMPLOYEES);
  leaveHistory = signal<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  
  currentUser = signal<Employee>(this.employees()[0]);

  currentUserBalance = computed(() => this.currentUser().leaveBalances);
  
  visibleRequests = computed(() => {
    const user = this.currentUser();
    if (user.role === 'Supervisor') {
      return this.leaveHistory();
    }
    return this.leaveHistory().filter(req => req.userId === user.id);
  });

  teamLeaves = computed(() => {
    const approvedLeaves = this.leaveHistory().filter(req => req.status === 'Aprobado');
    const leavesByDate: TeamMemberLeave[] = [];

    for (const req of approvedLeaves) {
        const startParts = req.startDate.split('-').map(Number);
        const endParts = req.endDate.split('-').map(Number);
        
        let currentDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);
        const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);
        
        while (currentDate <= endDate) {
            leavesByDate.push({
                name: req.userName,
                leaveDate: currentDate.toISOString().split('T')[0],
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    return leavesByDate;
  });

  setCurrentUser(employeeId: number): void {
    const user = this.employees().find(emp => emp.id === employeeId);
    if (user) {
      this.currentUser.set(user);
    }
  }

  addLeaveRequest(request: NewLeaveRequest): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = this.currentUser();
        const newRequest: LeaveRequest = {
          id: this.leaveHistory().length + 1,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          ...request,
          status: 'Pendiente',
          syncedToCalendar: false
        };
        this.leaveHistory.update(history => [newRequest, ...history]);
        resolve();
      }, 500);
    });
  }
  
  updateRequestStatus(requestId: number, newStatus: LeaveStatus): void {
    const request = this.leaveHistory().find(r => r.id === requestId);
    if (!request || request.status !== 'Pendiente') return;

    // Update balance if a countable leave type is approved
    if (newStatus === 'Aprobado') {
      const leaveTypesToTrack: LeaveType[] = ['Vacaciones', 'Permiso por enfermedad', 'Asuntos personales'];
      if (leaveTypesToTrack.includes(request.type)) {
        this.employees.update(employees => {
          const employee = employees.find(e => e.id === request.userId);
          if (employee) {
            const balance = employee.leaveBalances.find(b => b.type === request.type);
            if (balance) {
              const days = this.calculateDays(request.startDate, request.endDate);
              balance.used += days;
              balance.remaining -= days;
            }
          }
          return [...employees];
        });
      }
    }

    // Update request status
    this.leaveHistory.update(history => 
      history.map(r => r.id === requestId ? { ...r, status: newStatus } : r)
    );
    
    this.notificationService.addNotification({
      message: `Solicitud de ${request.userName} ha sido ${newStatus.toLowerCase()}.`,
      type: newStatus === 'Aprobado' ? 'success' : 'info'
    });
  }

  markRequestAsSynced(requestId: number): void {
    this.leaveHistory.update(history =>
      history.map(r => r.id === requestId ? { ...r, syncedToCalendar: true } : r)
    );
  }

  private calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    // Add timezone offset to avoid off-by-one day errors with UTC conversion
    startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
    endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }
}