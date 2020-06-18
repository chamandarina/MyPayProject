import axios from 'axios';
import { AuthService } from '../helpers/IdentityServer';

export class ReportingService {
  authService
  instance
  config
  constructor() {
    this.authService = new AuthService();

    this.instance = axios.create({
      baseURL: 'https://mypay-reporting.azurewebsites.net/api/',
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


  async fetchCustomer(userId) {
    //let paymentRequest = JSON.stringify(payment);
    console.log(userId, 'userId ovde bre')
    return await this.instance.get('reporting/' +userId).then(response => response).catch(err => err);
  }
 
}