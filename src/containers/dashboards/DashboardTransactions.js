import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Card, CardBody, CardTitle, CustomInput } from "reactstrap";
import Pagination from "../../components/DatatablePagination";
import IntlMessages from "../../helpers/IntlMessages";
import { connect } from 'react-redux';


class DashboardTransactions extends Component {
  constructor() {
    super();
    this.state = {
      selectAll: false,
      data: [],
      checked: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSingleCheckboxChange = this.handleSingleCheckboxChange.bind(
      this
    );
  }

  handleChange = () => {
    var selectAll = !this.state.selectAll;
    this.setState({ selectAll: selectAll });
    var checkedCopy = [];
    this.state.data.forEach(function (e, index) {
      checkedCopy.push(selectAll);
    });
    this.setState({
      checked: checkedCopy
    }, () => {
      console.log(this.state.checked);
    });
  };

  handleSingleCheckboxChange = index => {
    console.log(index);
    var checkedCopy = this.state.checked;
    checkedCopy[index] = !this.state.checked[index];
    if (checkedCopy[index] === false) {
      this.setState({ selectAll: false });
    }
    this.setState({
      checked: checkedCopy
    }, () => {
      console.log(this.state.checked);
    });
  };

  isCurrentMonth(x) {
    const month = new Date().getMonth() + 1;
    return x.month === month;
}

  componentDidMount() {
    const paymentData = this.props.payments;
    const loanData = this.props.loans;
    let paymentList = paymentData.filter(this.isCurrentMonth);
    let loanList = loanData.filter(this.isCurrentMonth);
    const tableData = [...paymentList, ...loanList];
    const dataEdited = tableData.slice(0, 12);
    var checkedCopy = [];
    var selectAll = this.state.selectAll;
    dataEdited.forEach(function (e, index) {
      checkedCopy.push(selectAll);
    });
    this.setState({
      data: dataEdited,
      checked: checkedCopy,
      selectAll: selectAll
    });
  }

  render() {
    return (
      <Card className="h-100">
        <CardBody>
          <CardTitle>
            <IntlMessages id={"dashboards.current-month-transactions"} />
          </CardTitle>
            <ReactTable
              data={this.state.data}
              defaultPageSize={6}
              showPageJump={false}
              showPageSizeOptions={false}
              PaginationComponent={Pagination}
              columns={[
                {
                  sortable: false,
                  Header: (
                    <CustomInput
                      type="checkbox"
                      id="checkAll"
                      label="All"
                      onChange={this.handleChange}
                      checked={this.state.selectAll}
                    />
                  ),
                  Cell: row => (
                    <CustomInput
                      type="checkbox"
                      id={"check"+row.index}
                      label=""
                      checked={this.state.checked[row.index]}
                      onChange={() => this.handleSingleCheckboxChange(row.index)}
                    />
                  ),
                  filterable: false
                },
                {
                  Header: "Bank account number",
                  accessor: "bankAccountNumber",
                  Cell: props => <p className="text-muted">{props.value}</p>
                },
                {
                  Header: "Amount",
                  accessor: "amount",
                  Cell: props => <p className="text-muted">{props.value.toString() + '$'}</p>
                },
                {
                    Header: "Status",
                    accessor: "status",
                    Cell: props => <p className="text-muted">{props.value}</p>
                  },
                
                
              ]}
            />
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
    const { payments, loans } = state.reporting;
    return {payments, loans};
}

export default connect(mapStateToProps)(DashboardTransactions);