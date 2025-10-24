export type LeaveType = 'Vacaciones' | 'Permiso por enfermedad' | 'Asuntos personales';
export type LeaveStatus = 'Pendiente' | 'Aprobado' | 'Rechazado';
export type UserRole = 'Empleado' | 'Supervisor';

export interface LeaveRequest {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  type: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason?: string;
  status: LeaveStatus;
  syncedToCalendar?: boolean;
}

export interface NewLeaveRequest {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  avatar: string;
  role: UserRole;
  leaveBalances: LeaveBalance[];
}


export interface TeamMemberLeave {
  name: string;
  leaveDate: string; // YYYY-MM-DD
}