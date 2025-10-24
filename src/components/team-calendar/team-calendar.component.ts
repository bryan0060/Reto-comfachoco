import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { LeaveService } from '../../services/leave.service';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  leaves: string[];
}

@Component({
  selector: 'app-team-calendar',
  template: `
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-xl font-bold mb-4 text-gray-700">Calendario del Equipo</h2>
      
      <div class="flex items-center justify-between mb-4">
        <button (click)="changeMonth(-1)" class="p-2 rounded-full hover:bg-gray-100">
          <svg class="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 class="font-semibold text-gray-800 capitalize">{{ currentMonthName() }} {{ currentYear() }}</h3>
        <button (click)="changeMonth(1)" class="p-2 rounded-full hover:bg-gray-100">
          <svg class="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-semibold mb-2">
        <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        @for(day of calendarDays(); track day.date) {
          <div class="h-16 flex flex-col items-center justify-start p-1 rounded-lg"
               [class.bg-gray-50]="!day.isCurrentMonth"
               [class.bg-blue-100]="day.isToday && day.isCurrentMonth"
               [class.border]="day.isToday"
               [class.border-blue-500]="day.isToday">
            <span class="font-medium" 
                  [class.text-gray-400]="!day.isCurrentMonth"
                  [class.text-blue-600]="day.isToday"
                  [class.text-gray-700]="day.isCurrentMonth && !day.isToday">
              {{ day.date.getDate() }}
            </span>
            @if(day.leaves.length > 0) {
              <div class="w-full mt-1 overflow-hidden">
                @for(leave of day.leaves.slice(0, 2); track leave) {
                   <div class="text-xs truncate bg-blue-200 text-blue-800 rounded px-1 mb-0.5">{{leave}}</div>
                }
                @if(day.leaves.length > 2) {
                   <div class="text-xs text-gray-500">+{{ day.leaves.length - 2 }} más</div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCalendarComponent {
  private leaveService = inject(LeaveService);
  teamLeaves = this.leaveService.teamLeaves;

  currentDate = signal(new Date());
  
  currentMonthName = computed(() => this.currentDate().toLocaleString('es-ES', { month: 'long' }));
  currentYear = computed(() => this.currentDate().getFullYear());

  calendarDays = computed(() => this.generateCalendar(this.currentDate()));

  changeMonth(delta: number): void {
    this.currentDate.update(date => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + delta);
      return newDate;
    });
  }

  private generateCalendar(date: Date): CalendarDay[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Adjust start day to be Monday (0=Sun, 1=Mon, ..., 6=Sat)
    let startDayOfWeek = firstDayOfMonth.getDay();
    if (startDayOfWeek === 0) startDayOfWeek = 7; // Sunday becomes 7
    startDayOfWeek -= 1; // Monday becomes 0

    const days: CalendarDay[] = [];

    // Days from previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, 0);
      prevMonthDate.setDate(prevMonthDate.getDate() - i);
      days.unshift({
        date: prevMonthDate,
        isCurrentMonth: false,
        isToday: false,
        leaves: this.getLeavesForDate(prevMonthDate),
      });
    }

    // Days of current month
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const currentDate = new Date(year, month, d);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isToday: currentDate.getTime() === today.getTime(),
        leaves: this.getLeavesForDate(currentDate),
      });
    }

    // Days from next month
    const gridCells = 42; // 6 weeks * 7 days
    while (days.length < gridCells) {
      const nextMonthDate = new Date(lastDayOfMonth);
      nextMonthDate.setDate(lastDayOfMonth.getDate() + (days.length - lastDayOfMonth.getDate() - startDayOfWeek + 1));
      days.push({
        date: nextMonthDate,
        isCurrentMonth: false,
        isToday: false,
        leaves: this.getLeavesForDate(nextMonthDate),
      });
    }

    return days.slice(0, 42);
  }
  
  private getLeavesForDate(date: Date): string[] {
    const dateString = date.toISOString().split('T')[0];
    return this.teamLeaves()
      .filter(leave => leave.leaveDate === dateString)
      .map(leave => leave.name);
  }
}
