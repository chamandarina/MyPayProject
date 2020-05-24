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
     executePayment,
     executeLoan }
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

   class LoanRequest {
    portfolioId
    bankAccountNumber
    receiver
    amount
    period
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
        this.sendNotification = this.sendNotification.bind(this);
        this.validatePeriod = this.validatePeriod.bind(this);

        this.form0 = React.createRef();
        this.form1 = React.createRef();
        this.form2 = React.createRef();

        this.state = {
            bottomNavHidden: false,
            topNavDisabled: false,
            loanProccess: true,
            loading: false,
            loanSum: 0,
            loanByMonth: 0,
            fields: [
                {
                    valid: false,
                    name: "amount",
                    value: 0
                },
                {
                    valid: false,
                    name: "period",
                    value: 0
                },
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
            ]
        }
    }

    componentDidMount() {
        this.setState({ fields: [
            { ...this.state.fields[0], form: this.form0 }, 
            { ...this.state.fields[1], form: this.form0 }, 
            { ...this.state.fields[2], form: this.form2 }, 
            { ...this.state.fields[3], form: this.form2 }, 
        ] });
    }

    validatePeriod(value) {
        let error;
        if (!value) {
            error = "Please enter your amount";
        } else if (value == 0) {
            error = "Amount must be grather than zero";
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

    validateAmount(value) {
        let error;
        if (!value) {
            error = "Please enter your amount";
        } else if (value == 0) {
            error = "Amount must be grather than zero";
        }
        return error;
    }

    hideNavigation() {
        this.setState({ bottomNavHidden: true, topNavDisabled: true });
    }

    showNavigation() {
        this.setState({ bottomNavHidden: false, topNavDisabled: false });
    }

    asyncLoading () {
        this.setState({ loading: true });
        const loan = new LoanRequest();
        
        loan.portfolioId = this.props.customer.portfolioId;
        loan.bankAccountNumber = this.state.fields.find(x => x.name === 'bankAccountNumber').value;
        loan.receiver = this.state.fields.find(x => x.name === 'receiver').value;
        loan.amount = this.state.fields.find(x => x.name === 'amount').value;
        loan.period = this.state.fields.find(x => x.name === 'period').value;
        console.log('tuj sam')
        this.props.executeLoan(loan);
    }

    sendNotification () {
        const phoneNumber = this.props.customer.phoneNumber;
        this.notificationService.sendNotificationOnPaymentExecuted(phoneNumber);
        this.setState({ loading: false });
    }

    loanProcess () {
        this.setState({ loading: false });
                setTimeout(() => {
                this.interestCalculation()
                this.setState({ loading: true, bottomNavHidden: false, topNavDisabled:false });
            }, 3000);  
    }

    interestCalculation() {
        let amount = this.state.fields[0].value;
        let period = this.state.fields[1].value;

        let sum = amount * 1.05;
        let month = sum / period;

        this.setState({ loanSum: sum.toFixed(2), loanByMonth: month.toFixed(2) })

    }

    onClickNext(goToNext, steps, step) {
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        }

        console.log(step.id, 'idjevi')

        if (this.state.loanProccess === true) {
            this.hideNavigation();
            this.loanProcess(goToNext, step);
            this.setState({ loanProccess: false })
        }
        
        if (step.continue === 1) {
            goToNext();
            step.isDone = true
        } else {
            console.log(step.currentIndex, 'current')
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
                if (isValid === formIndex+step.length) {
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
                            <Step id="step1" currentIndex={0} length={2} name={messages["wizard.step-name-1"]} desc={messages["loan.request"]}>
                                <div className="wizard-basic-step row">
                                    <Formik
                                        ref={this.form0}
                                        initialValues={{
                                            amount: this.state.fields[0].value,
                                            period: this.state.fields[1].value,
                                        }}
                                        onSubmit={() => { }}>
                                        {({ errors, touched }) => (
                                            <Form className="av-tooltip tooltip-label-right col-centered">
                                                <FormGroup>
                                                    <Label>{messages["loan.amount"]}</Label>
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
                                                    <Label>{messages["loan.period"]}</Label>
                                                    <Field
                                                        type="number"
                                                        placeholder="Enter period in months"
                                                        className="form-control form-control-wizard-input"
                                                        name="period"
                                                        validate={this.validatePeriod}
                                                    />
                                                    {errors.period && touched.period && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.period}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </Step>
                            <Step id="step2" continue={1} hideTopNav={true}>
                                <div className="wizard-basic-step text-center pt-3">
                                    {
                                        !this.state.loading ? (
                                            <div>
                                                <Spinner color="primary" className="mb-1" />
                                                <p><IntlMessages id="loan.async" /></p>
                                            </div>
                                        ) : (
                                                <div>
                                                    <h2 className="mb-2"><IntlMessages id="loan.approved" /></h2>
                                                    <p><IntlMessages id="loan.approval-message" /></p>
                                                </div>
                                            )
                                    }
                                </div>
                            </Step>
                            <Step id="step3" continue={1} name={messages["wizard.step-name-2"]} desc={messages["loan.conditions"]}>
                                <div className="wizard-basic-step row">
                                    <Formik
                                        ref={this.form1}
                                        initialValues={{
                                            loanSum: this.state.loanSum,
                                            loanByMonth: this.state.loanByMonth,
                                            loanInterest: '5%',
                                        }}
                                        onSubmit={() => { }}>
                                        {({ errors, touched }) => (
                                            <Form className="av-tooltip tooltip-label-right col-centered">
                                                <FormGroup>
                                                    <Label>{messages["loan.sum"]}</Label>
                                                    <Field
                                                        disabled={true}
                                                        className="form-control form-control-wizard-input"
                                                        name="loanSum"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>{messages["loan.month"]}</Label>
                                                    <Field
                                                        disabled={true}
                                                        className="form-control form-control-wizard-input"
                                                        name="loanByMonth"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>{messages["loan.interest"]}</Label>
                                                    <Field
                                                        disabled={true}
                                                        className="form-control form-control-wizard-input"
                                                        name="loanInterest"
                                                    />
                                                </FormGroup>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </Step>
                            <Step id="step4" currentIndex={2} length={2} name={messages["wizard.step-name-3"]} desc={messages["loan.payment-information"]}>
                                <div className="wizard-basic-step row">
                                    <Formik
                                        ref={this.form2}
                                        initialValues={{
                                            receiver: this.state.fields[2].value,
                                            bankAccountNumber: this.state.fields[3].value,
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
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </Step>
                            <Step id="step5" hideTopNav={true}>
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

export default connect(mapStateToProps, { executePayment, executeLoan })(injectIntl(Validation))
