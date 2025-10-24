import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { LeaveType, NewLeaveRequest } from '../../models/leave.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-form',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-40" (click)="close()"></div>
    <div class="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all" 
           [class.animate-fade-in-up]="true">
        <div class="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-800">Nueva Solicitud de Ausencia</h3>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form [formGroup]="leaveForm" (ngSubmit)="submitForm()" class="p-6 space-y-4">
          <div>
            <label for="leaveType" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Ausencia</label>
            <select id="leaveType" formControlName="type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              @for (type of leaveTypes; track type) {
                <option [value]="type">{{ type }}</option>
              }
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
              <input type="date" id="startDate" formControlName="startDate"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
            </div>
            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
              <input type="date" id="endDate" formControlName="endDate"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
            </div>
          </div>
          
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">Motivo (Opcional)</label>
            <textarea id="reason" formControlName="reason" rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button type="button" (click)="close()" class="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="leaveForm.invalid" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
    <style>
      @keyframes fadeInUp {
        from { opacity: 0; transform: translate3d(0, 20px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.3s ease-out forwards;
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestFormComponent {
  // FIX: Explicitly type `fb` as `FormBuilder` to resolve type inference issue.
  private fb: FormBuilder = inject(FormBuilder);
  
  closeModal = output<void>();
  formSubmitted = output<NewLeaveRequest>();
  
  leaveTypes: LeaveType[] = ['Vacaciones', 'Permiso por enfermedad', 'Asuntos personales'];
  
  leaveForm: FormGroup;

  constructor() {
     this.leaveForm = this.fb.group({
      type: [this.leaveTypes[0], Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['']
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  submitForm(): void {
    if (this.leaveForm.valid) {
      this.formSubmitted.emit(this.leaveForm.value);
    }
  }
}