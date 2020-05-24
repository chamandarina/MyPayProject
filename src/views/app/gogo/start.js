import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Card, CardBody, CardTitle, CardSubtitle, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import IconCardsCarousel from '../../../containers/dashboards/IconCardsCarousel';
import RecentOrders from '../../../containers/dashboards/RecentOrders';
import Logs from '../../../containers/dashboards/Logs';
import Tickets from '../../../containers/dashboards/Tickets';
import Calendar from '../../../containers/dashboards/Calendar';
import BestSellers from '../../../containers/dashboards/BestSellers';
import DashboardTransactions from '../../../containers/dashboards/DashboardTransactions';
import ProfileStatuses from '../../../containers/dashboards/ProfileStatuses';
import GradientCardContainer from '../../../containers/dashboards/GradientCardContainer';
import Cakes from '../../../containers/dashboards/Cakes';
import GradientWithRadialProgressCard from '../../../components/cards/GradientWithRadialProgressCard';
import SortableStaticticsRow from '../../../containers/dashboards/SortableStaticticsRow';
import AdvancedSearch from '../../../containers/dashboards/AdvancedSearch';
import SmallLineCharts from '../../../containers/dashboards/SmallLineCharts';
import SalesChartCard from '../../../containers/dashboards/SalesChartCard';
import ProductCategoriesPolarArea from '../../../containers/dashboards/ProductCategoriesPolarArea';
import WebsiteVisitsChartCard from '../../../containers/dashboards/WebsiteVisitsChartCard';
import ConversionRatesChartCard from '../../../containers/dashboards/ConversionRatesChartCard';
import TopRatedItems from '../../../containers/dashboards/TopRatedItems';
import IntlMessages from "../../../helpers/IntlMessages";
import { ThemeColors } from '../../../helpers/ThemeColors'


import { barChartOptions1, barChartOptions2 } from '../../../components/charts/config';

import {
  BarChart,
} from "../../../components/charts";


class Start extends Component {
  colors = ThemeColors()
  constructor() {
    super();

    this.state = {
      data:[],
      chartDataTransactions: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            key: 1,
            label: 'Transactions',
            borderColor: this.colors.themeColor1,
            backgroundColor: this.colors.themeColor1_10,
            data: [],
            borderWidth: 2
          },
        ]
      },
      chartDataLoans: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            key:1,
            label: 'Loans',
            borderColor: this.colors.themeColor2,
            backgroundColor: this.colors.themeColor2_10,
            data: [],
            borderWidth: 2
          },
      
        ]
      }
    }

  }

  // componentWillMount() {
  //   const {payments, loans, chartDataPayments, chartDataLoans} = this.props;
  //   // const totalNextPaymentAmount = chartDataPayments.length > 0 ? chartDataPayments.reduce((result,payment)=> result+payment, 0) : 0;
  //   // const totalCurrentPaymentAmount = this.state.chartDataTransactions.datasets[0].data.length > 0 ? this.state.chartDataTransactions.datasets[0].data.reduce((result, payment) => result+payment, 0) : 0;
  //   // if (totalNextPaymentAmount != totalCurrentPaymentAmount) {
  //   this.makeData(payments, loans);
  //   this.makeChartData(chartDataPayments, chartDataLoans);
    
  // }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   // const {payments, loans, chartDataPayments, chartDataLoans} = prevProps;
  //   // this.makeData(payments, loans);
  //   // this.makeChartData(chartDataPayments, chartDataLoans);

  //   let key = 1;
  //   const payments = prevProps.chartDataPayments;
  //   const loans = prevProps.chartDataLoans;
  //   const totalNextPaymentAmount = payments.reduce((result,payment)=> result+payment, 0);
  //   const totalCurrentPaymentAmount = prevState.chartDataTransactions.datasets[0].data.reduce((result, payment) => result+payment, 0);
  //   if (!prevProps.loading && totalCurrentPaymentAmount != totalNextPaymentAmount) {
  //     this.makeData(prevProps.payments, prevProps.loans);
  //     this.makeChartData(payments, loans);
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !nextProps.loading;
  //   const payments = nextProps.chartDataPayments;
  //   const totalNextPaymentAmount = payments.reduce((result,payment)=> result+payment, 0);
  //   const totalCurrentPaymentAmount = this.state.chartDataTransactions.datasets[0].data.reduce((result, payment) => result+payment, 0)
  //   const shouldUpdate = totalNextPaymentAmount != totalCurrentPaymentAmount;
  //   console.log(shouldUpdate, 'shta kazes')
  //   return shouldUpdate;
  // }

  static getDerivedStateFromProps(props, state) {
    let key = 1;
    const p = props.payments;
    const l = props.loans;
    const payments = props.chartDataPayments;
    const loans = props.chartDataLoans;
    const totalNextPaymentAmount = payments.reduce((result,payment)=> result+payment, 0);
    const totalCurrentPaymentAmount = state.chartDataTransactions.datasets[0].data.reduce((result, payment) => result+payment, 0);
    const totalPaymentAmount = p.reduce((result,payment)=> result+payment.amount, 0);
    //const currentPaymentAmount = this.state.chartDataTransactions.datasets[0].data.reduce((result, payment) => result+payment, 0);
    const totalLoanAmount = l.reduce((result,loan)=> result+loan.amount, 0);
    let currentMonthLoanRate = 0;
    let currentMonthInterestRate = 0;
    if (l.length > 0) {
      currentMonthLoanRate = l.reduce((result, loan) => result + (loan.amount / loan.period), 0);
      currentMonthInterestRate = l.reduce((result, loan) => result + (loan.interest / loan.period), 0);
    }
    //console.log(l[0].interest, 'interestRate')
    //const totalAmount = totalPaymentAmount + totalLoanAmount;
    const totalAmountRate = totalPaymentAmount + currentMonthLoanRate + currentMonthInterestRate;
    console.log(totalPaymentAmount, 'payment amount')
    console.log(totalPaymentAmount.toString() + '$', 'mafaka')
    const data = [
      { title: 'dashboards.transactions', icon: "simple-icon-credit-card", value: totalPaymentAmount.toString() + '$' },
      { title: 'dashboards.loans', icon: "iconsminds-basket-coins", value: totalLoanAmount.toString() + '$' },
      // { title: 'dashboards.total-amount', icon: "iconsminds-arrow-refresh", value: totalAmount.toString() + '$' },
      { title: 'dashboards.total-amount-rate', icon: "iconsminds-mail-read", value: totalAmountRate.toFixed(2).toString() + '$' }
    ]
    if (state.data.length === 0) {
      return {
        data,
        chartDataTransactions: {
          ...state.chartDataTransactions,           
          datasets: state.chartDataTransactions.datasets.map(
            el => el.key === key? { ...el, data: payments } : el
          )     
        },
        chartDataLoans: {
          ...state.chartDataLoans,           
          datasets: state.chartDataLoans.datasets.map(
            el => el.key === key? { ...el, data: loans } : el
          )          
        }
      }
    }

    if (!props.loading && totalCurrentPaymentAmount != totalNextPaymentAmount) {
      return {
        data,
        chartDataTransactions: {
          ...state.chartDataTransactions,           
          datasets: state.chartDataTransactions.datasets.map(
            el => el.key === key? { ...el, data: payments } : el
          )     
        },
        chartDataLoans: {
          ...state.chartDataLoans,           
          datasets: state.chartDataLoans.datasets.map(
            el => el.key === key? { ...el, data: loans } : el
          )          
        }
      }
    }

    return null;
  }

  // componentWillReceiveProps(nextProps) {
  //   let key = 1;
  //   const payments = nextProps.chartDataPayments;
  //   const loans = nextProps.chartDataLoans;
  //   const totalNextPaymentAmount = payments.reduce((result,payment)=> result+payment, 0);
  //   const totalCurrentPaymentAmount = this.state.chartDataTransactions.datasets[0].data.reduce((result, payment) => result+payment, 0);
  //   console.log(totalNextPaymentAmount, 'next')
  //   console.log(totalCurrentPaymentAmount, 'current')
  //   if (!nextProps.loading && totalCurrentPaymentAmount != totalNextPaymentAmount) {
  //     this.makeData(nextProps.payments, nextProps.loans);
  //     this.makeChartData(payments, loans);
  //   }
  // }

  makeChartData(chartDataPayments, chartDataLoans) {
    let key = 1
    this.setState(prevState => ({
      chartDataTransactions: {
        ...prevState.chartDataTransactions,           
        datasets: prevState.chartDataTransactions.datasets.map(
          el => el.key === key? { ...el, data: chartDataPayments } : el
        )     
      },
      chartDataLoans: {
        ...prevState.chartDataLoans,           
        datasets: prevState.chartDataLoans.datasets.map(
          el => el.key === key? { ...el, data: chartDataLoans } : el
        )          
      }
    }))
  }

  makeData(payments, loans) {
    const totalPaymentAmount = payments.reduce((result,payment)=> result+payment.amount, 0);
    const currentPaymentAmount = this.state.chartDataTransactions.datasets[0].data.reduce((result, payment) => result+payment, 0);
    const totalLoanAmount = loans.reduce((result,loan)=> result+loan.amount, 0);
    const currentMonthLoanRate = loans.reduce((result, loan) => result + (loan.amount / loan.period), 0);
    const currentMonthInterestRate = loans.reduce((result, loan) => result + (loan.interest / loan.period), 0);
    console.log(loans[0].interest, 'interestRate')
    //const totalAmount = totalPaymentAmount + totalLoanAmount;
    const totalAmountRate = totalPaymentAmount + currentMonthLoanRate + currentMonthInterestRate;
    const data = [
      { title: 'dashboards.transactions', icon: "simple-icon-credit-card", value: totalPaymentAmount.toString() + '$' },
      { title: 'dashboards.loans', icon: "iconsminds-basket-coins", value: totalLoanAmount.toString() + '$' },
      // { title: 'dashboards.total-amount', icon: "iconsminds-arrow-refresh", value: totalAmount.toString() + '$' },
      { title: 'dashboards.total-amount-rate', icon: "iconsminds-mail-read", value: totalAmountRate.toString() + '$' }
    ]
        this.setState({ data });
  }


  render() {

    //return <div>Sta je bre bilo</div>;

    const {loading} = this.props;

    // const totalNextPaymentAmount = chartDataPayments.reduce((result,payment)=> result+payment, 0);
    // const totalCurrentPaymentAmount = this.state.chartDataTransactions.datasets[0].data.reduce((result, payment) => result+payment, 0)
    // console.log(totalNextPaymentAmount, 'totalNextPayment')
    // console.log(totalCurrentPaymentAmount, 'totalCurrentPayment')
    // const shouldRender = totalNextPaymentAmount != totalCurrentPaymentAmount;

//     console.log(this.state.data, 'sta je u dati')
// if (this.state.data.length === 0) return <div className="loading"></div>;
// console.log(loading, 'rerender')
if (loading) {
  return <div className="loading"></div>;
}

    const { messages } = this.props.intl;
    return (
      <Fragment>
        <Row>
          <Colxx lg="12" xl="12" md="12" sm="12">
            <IconCardsCarousel data={this.state.data} />
          </Colxx>
        </Row>
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="charts.bar" />
                </CardTitle>
                <Row>
                  <Colxx xxs="12" lg="6" className="mb-5">
                    <CardSubtitle>
                      <IntlMessages id="dashboards.transactions" />
                    </CardSubtitle>
                    <div className="chart-container">
                      <BarChart shadow data={this.state.chartDataTransactions} barChartOptions={barChartOptions1} />
                    </div>
                  </Colxx>

                  <Colxx xxs="12" lg="6" className="mb-5">
                    <CardSubtitle>
                      <IntlMessages id="dashboards.loans" />
                    </CardSubtitle>
                    <div className="chart-container">
                      <BarChart data={this.state.chartDataLoans} barChartOptions={barChartOptions2} />
                    </div>
                  </Colxx>
                </Row>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
        <Row>
          <Colxx xl="6" lg="12" className="mb-4">
            <Calendar />
          </Colxx>
          <Colxx xl="6" lg="12" className="mb-4">
            <DashboardTransactions />
          </Colxx>
        </Row>       
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { payments, loans, chartDataPayments, chartDataLoans, loading } = state.reporting;
  return { payments, loans, chartDataPayments, chartDataLoans, loading }
}

export default connect(mapStateToProps)(injectIntl(Start));
