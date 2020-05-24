import React, { Component } from "react";
import { Card, CardBody, FormGroup, Label, Spinner, InputGroup,
    InputGroupAddon,
    Input,
    InputGroupText } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Wizard, Steps, Step } from 'react-albus';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BottomNavigation } from "../../../components/wizard/BottomNavigation";
import { TopNavigation } from "../../../components/wizard/TopNavigation";
import { Formik, Form, Field } from "formik";
import { NotificationService } from '../../../services/NotificationService';
import './transaction-style.css';
import {
     executePayment }
   from '../../../redux/reporting/actions';

   class PaymentRequest {
    portfolioId
    bankAccountNumber
    receiver
    paymentCode
    amount = 0
    paymentPurpose
    referenceNumber
   }

class Validation extends Component {
    notificationService = null

    constructor(props) {
        super(props);
        this.notificationService = new NotificationService();
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.validateAmount = this.validateAmount.bind(this);
        this.validateBankAccountNumber = this.validateBankAccountNumber.bind(this);
        this.validateReceiver = this.validateReceiver.bind(this);
        this.validatePaymentCode = this.validatePaymentCode.bind(this);
        this.validatePaymentPurpose = this.validatePaymentPurpose.bind(this);
        this.sendNotification = this.sendNotification.bind(this);

        this.form0 = React.createRef();
        this.form1 = React.createRef();
        //this.form2 = React.createRef();

        this.state = {
            bottomNavHidden: false,
            topNavDisabled: false,
            loading: false,
            fields: [
                {
                    valid: false,
                    name: "receiver",
                    value: ""
                },
                {
                    valid: false,
                    name: "bankAccountNumber",
                    value: ""
                },
                {
                    valid: false,
                    name: "referenceNumber",
                    value: ""
                },
                {
                    valid: false,
                    name: "paymentCode",
                    value: ""
                },
                {
                    valid: false,
                    name: "amount",
                    value: 0
                },
                {
                    valid: false,
                    name: "paymentPurpose",
                    value: ""
                }
            ]
        }
    }

    componentDidMount() {
        this.setState({ fields: [
            { ...this.state.fields[0], form: this.form0 }, 
            { ...this.state.fields[1], form: this.form0 }, 
            { ...this.state.fields[2], form: this.form0 }, 
            { ...this.state.fields[3], form: this.form1 }, 
            { ...this.state.fields[4], form: this.form1 }, 
            { ...this.state.fields[5], form: this.form0 }, 
        ] });
    }

    validatePaymentCode(value) {
        let error;
        if (!value) {
            error = "Please enter your payment code";
        } else if (value.length > 3) {
            error = "Value must be shorter than 4 characters";
        }
        return error;
    }

    validateBankAccountNumber(value) {
        let error;
        if (!value) {
            error = "Please enter your bank account number";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }

    validateReceiver(value) {
        let error;
        if (!value) {
            console.log('error validation receiver')
            error = "Please enter your receiver";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }

    validatePaymentPurpose(value) {
        let error;
        if (!value) {
            error = "Please enter your payment purpose";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }

    validateAmount(value) {
        let error;
        if (!value) {
            error = "Please enter your amount";
        } else if (value == 0) {
            error = "Amount must be grather than zero";
        } else if (value > 200) {
            error = "Amount must be less than 200$";
        }
        return error;
    }

    hideNavigation() {
        this.setState({ bottomNavHidden: true, topNavDisabled: true });
    }

    asyncLoading () {
        this.setState({ loading: true });
        const payment = new PaymentRequest();
        payment.portfolioId = this.props.customer.portfolioId;
        payment.bankAccountNumber = this.state.fields.find(x => x.name == 'bankAccountNumber').value;
        payment.receiver = this.state.fields.find(x => x.name == 'receiver').value;
        payment.paymentCode = this.state.fields.find(x => x.name == 'paymentCode').value;
        payment.amount = this.state.fields.find(x => x.name == 'amount').value;
        payment.paymentPurpose = this.state.fields.find(x => x.name == 'paymentPurpose').value;
        payment.referenceNumber = this.state.fields.find(x => x.name == 'referenceNumber').value;
        
        this.props.executePayment(payment);
    }

    sendNotification () {
        const phoneNumber = this.props.customer.phoneNumber;
        this.notificationService.sendNotificationOnPaymentExecuted(phoneNumber);
        this.setState({ loading: false });
    }

    onClickNext(goToNext, steps, step) {
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        }
        let formIndex = step.currentIndex;
        let form = this.state.fields[formIndex].form.current;
        
        form.submitForm().then(() => {
            let fields = this.state.fields;
            let isValid = formIndex;
            for(let i = formIndex; i < formIndex+step.length; i++) {
                let name = this.state.fields[i].name;
                fields[i].value = form.state.values[name];
                fields[i].valid = form.state.errors[name] ? false : true;
                if (fields[i].valid) {
                    isValid++;
                }
            }
            this.setState({fields});
            if (isValid == formIndex+step.length) {
                goToNext();
                step.isDone = true;
                if (steps.length - 2 <= steps.indexOf(step)) {
                    this.hideNavigation();
                    this.asyncLoading();
                    this.sendNotification();
                }
            }
        });
    }

    onClickPrev(goToPrev, steps, step) {
        if (steps.indexOf(step) <= 0) {
            return;
        }
        goToPrev();
    }

    render() {
        const { messages } = this.props.intl;
        return (
            <Card>
                <CardBody className="wizard wizard-default">
                    <Wizard>
                        <TopNavigation className="justify-content-center" disableNav={true} />
                        <Steps>
                            <Step id="step1" currentIndex={0} length={3} name={messages["wizard.step-name-1"]} desc={messages["wizard.step-desc-1"]}>
                                <div className="wizard-basic-step row">
                                    <Formik
                                        ref={this.form0}
                                        initialValues={{
                                            receiver: this.state.fields[0].value,
                                            bankAccountNumber: this.state.fields[1].value,
                                            referenceNumber: this.state.fields[2].value,
                                        }}
                                        onSubmit={() => { }}>
                                        {({ errors, touched }) => (
                                            <Form className="av-tooltip tooltip-label-right col-centered">
                                                <FormGroup>
                                                    <Label>{messages["transaction.receiver"]}</Label>
                                                    <Field
                                                        className="form-control form-control-wizard-input"
                                                        placeholder="Enter who will receive payment"
                                                        name="receiver"
                                                        validate={this.validateReceiver}
                                                    />
                                                    {errors.receiver && touched.receiver && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.receiver}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>{messages["transaction.bank-account-number"]}</Label>
                                                    <Field
                                                        className="form-control form-control-wizard-input"
                                                        placeholder="Enter bank account number"
                                                        name="bankAccountNumber"
                                                        validate={this.validateBankAccountNumber}
                                                    />
                                                    {errors.bankAccountNumber && touched.bankAccountNumber && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.bankAccountNumber}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>{messages["transaction.reference-number"]}</Label>
                                                    <Field
                                                        className="form-control form-control-wizard-input"
                                                        placeholder="Enter reference number (optional)"
                                                        name="referenceNumber"
                                                    />
                                                </FormGroup>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </Step>
                            <Step id="step2" currentIndex={3} length={3} name={messages["wizard.step-name-2"]} desc={messages["wizard.step-desc-2"]}>
                                <div className="wizard-basic-step row">
                                    <Formik
                                        ref={this.form1}
                                        initialValues={{
                                            paymentCode: this.state.fields[3].value,
                                            amount: this.state.fields[4].value,
                                            paymentPurpose: this.state.fields[5].value
                                        }}
                                        onSubmit={() => { }}>
                                        {({ errors, touched }) => (
                                            <Form className="av-tooltip tooltip-label-right col-centered">
                                                <FormGroup>
                                                    <Label>{messages["transaction.payment-code"]}</Label>
                                                    <Field
                                                        className="form-control form-control-wizard-input"
                                                        placeholder="Enter payment code"
                                                        name="paymentCode"
                                                        validate={this.validatePaymentCode}
                                                    />
                                                    {errors.paymentCode && touched.paymentCode && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.paymentCode}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>{messages["transaction.amount"]}</Label>
                                                    <Field name="amount">
                                                        {({ field, form }) => (
                                                          <InputGroup className="mb-3">
                                                            <Input {...field} type="number"
                                                                placeholder="Enter amount in dollars"
                                                                className="form-control form-control-wizard-input"
                                                                validate={this.validateAmount} />
                                                            <InputGroupAddon addonType="prepend">
                                                              <InputGroupText>$</InputGroupText>
                                                            </InputGroupAddon>
                                                          </InputGroup>  
                                                        )}
                                                    </Field>
                                                    {errors.amount && touched.amount && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.amount}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>{messages["transaction.payment-purpose"]}</Label>
                                                    <Field
                                                        className="form-control form-control-wizard-input"
                                                        placeholder="Enter payment purpose"
                                                        name="paymentPurpose"
                                                        validate={this.validatePaymentPurpose}
                                                    />
                                                    {errors.paymentPurpose && touched.paymentPurpose && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.paymentPurpose}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </Step>
                            <Step id="step3" hideTopNav={true}>
                                <div className="wizard-basic-step text-center pt-3">
                                    {
                                        this.state.loading ? (
                                            <div>
                                                <Spinner color="primary" className="mb-1" />
                                                <p><IntlMessages id="wizard.async" /></p>
                                            </div>
                                        ) : (
                                                <div>
                                                    <h2 className="mb-2"><IntlMessages id="wizard.content-thanks" /></h2>
                                                    <p><IntlMessages id="wizard.registered" /></p>
                                                </div>
                                            )
                                    }
                                </div>
                            </Step>
                        </Steps>
                        <BottomNavigation onClickNext={this.onClickNext} onClickPrev={this.onClickPrev} className={"justify-content-center " + (this.state.bottomNavHidden && "invisible")} prevLabel={messages["wizard.prev"]} nextLabel={messages["wizard.next"]} />
                    </Wizard>
                </CardBody>
            </Card>
        );
    }
}

const mapStateToProps = ({ reporting }) => {
    const { customer } = reporting;
    return { customer };
  };

export default connect(mapStateToProps, { executePayment })(injectIntl(Validation))
