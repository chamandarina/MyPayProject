import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Card, CardBody, CardTitle, CustomInput } from "reactstrap";
import Pagination from "../../../components/DatatablePagination";
import IntlMessages from "../../../helpers/IntlMessages";
import { connect } from 'react-redux';

import data from "../../../data/products";


class Loans extends Component {
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

  componentDidMount() {
    const loanData = this.props.loans;
    const dataEdited = loanData.slice(0, 12);
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
            <IntlMessages id={"dashboards.loans"} />
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
                    Header: "Date",
                    accessor: "date",
                    Cell: props => <p className="text-muted">{props.value}</p>
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
                  Header: "Period",
                  accessor: "period",
                  Cell: props => <p className="text-muted">{props.value}</p>
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
    const { loans } = state.reporting;
    return {loans};
}

export default connect(mapStateToProps)(Loans);