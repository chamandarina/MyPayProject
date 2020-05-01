import axios from 'axios';

export class PaymentService {
  constructor() {

  }

  async executePayment(payment) {
    return await axios.post('http://localhost:5000/api/authentication', { payment });
  }
}