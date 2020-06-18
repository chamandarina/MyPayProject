import axios from 'axios';
import { AuthService } from '../helpers/IdentityServer';

export class PaymentService {
  authService
  instance
  config
  constructor() {
    this.authService = new AuthService();

    this.instance = axios.create({
      baseURL: 'http://localhost:51911/api/',
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
 
async executePayment(payment) {
  let paymentRequest = JSON.stringify(payment);
  return await this.instance.post('payment', 
  paymentRequest).then(response => response).catch(err => err);
}


async executeLoan(loan) {
  let loanRequest = JSON.stringify(loan);
  return await this.instance.post('loan', 
  loanRequest).then(response => response).catch(err => err);
  }


}