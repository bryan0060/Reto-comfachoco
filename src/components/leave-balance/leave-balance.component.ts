import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-balance',
  template: `
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-700">Saldo de Ausencias</h2>
        <button (click)="newRequest.emit()" 
                class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>Nueva Solicitud</span>
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        @for (balance of balances(); track balance.type) {
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-600">{{ balance.type }}</h3>
            <p class="text-3xl font-bold text-gray-800 mt-2">{{ balance.remaining }} <span class="text-base font-medium text-gray-500">días</span></p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div class="bg-blue-500 h-2 rounded-full" [style.width.%]="(balance.total > 0 ? (balance.used / balance.total) : 0) * 100"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1 text-right">{{ balance.used }} de {{ balance.total }} usados</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveBalanceComponent {
  private leaveService = inject(LeaveService);
  balances = this.leaveService.currentUserBalance;
  newRequest = output<void>();
}
