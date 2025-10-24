import { Injectable, signal } from '@angular/core';
import { LeaveRequest } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  isLoggedIn = signal(false);

  initClient(): void {
    console.log('Google Calendar Service initialized (mock).');
    // In a real app, you would initialize the Google API client here.
    // We can check local storage for a mock token to persist login state.
    if (typeof localStorage !== 'undefined' && localStorage.getItem('mock_google_token')) {
      this.isLoggedIn.set(true);
    }
  }

  handleAuthClick(): void {
    console.log('Handling auth click (mock).');
    // Simulate a login flow
    setTimeout(() => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mock_google_token', 'fake_token');
      }
      this.isLoggedIn.set(true);
    }, 500);
  }

  handleSignoutClick(): void {
    console.log('Handling signout click (mock).');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mock_google_token');
    }
    this.isLoggedIn.set(false);
  }

  createEvent(request: LeaveRequest): Promise<void> {
    if (!this.isLoggedIn()) {
      return Promise.reject('User is not logged in to Google Calendar.');
    }

    console.log(`Simulating creating calendar event for ${request.userName}'s ${request.type}`);
    console.log(`From: ${request.startDate} to ${request.endDate}`);
    if (request.reason) {
      console.log(`Reason: ${request.reason}`);
    }

    // Simulate an API call
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Mock event created successfully.');
        resolve();
      }, 1000);
    });
  }
}
