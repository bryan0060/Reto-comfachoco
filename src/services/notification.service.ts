import { Injectable, signal } from '@angular/core';
import { Notification, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationId = 0;
  notifications = signal<Notification[]>([]);

  addNotification(notificationData: { message: string, type: NotificationType }): void {
    const newNotification: Notification = {
      id: this.notificationId++,
      message: notificationData.message,
      type: notificationData.type,
      timestamp: new Date()
    };
    this.notifications.update(currentNotifications => [newNotification, ...currentNotifications]);
  }

  removeNotification(id: number): void {
    this.notifications.update(currentNotifications => 
      currentNotifications.filter(n => n.id !== id)
    );
  }
}
