import axios from 'axios';
import { AuthService } from '../helpers/IdentityServer';

export class NotificationService {
  authService
  instance
  config
  constructor() {
    this.authService = new AuthService();

    this.instance = axios.create({
      baseURL: 'https://mypay-notification.azurewebsites.net/api/',
      headers: { 'Content-Type': 'application/json' }
      });

    this.authService.getUser().then(user => {
      if (user) {
        this.config = {
          headers: { Authorization: `Bearer ${user.access_token}` }
        };
      }
    }); 
}

async sendNotificationOnPaymentExecuted(phoneNumber) {

  let notificationRequest = JSON.stringify({
    phoneNumber: phoneNumber
  });

  await this.instance.post('notifications/paymentExecuted', 
  notificationRequest).then(response => response).catch(err => err);
  }
}

