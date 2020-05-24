import React, { Component, Fragment } from 'react';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { injectIntl } from 'react-intl';
import { Row, Card, CardBody, CardTitle,
  Input,
  FormGroup,
  Label,
  CustomInput,
  Button,
  FormText,
  Form } from 'reactstrap';
import { connect } from 'react-redux';

import IntlMessages from "../../../helpers/IntlMessages";
import { ThemeColors } from '../../../helpers/ThemeColors'


class Account extends Component {
  colors = ThemeColors()
  constructor() {
    super();
  }

  render() {
    return (
      <Fragment>
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="forms.account" />
                </CardTitle>
                <Form>
                  <FormGroup>
                    <Label for="firstName">
                      <IntlMessages id="forms.first-name" />
                    </Label>
                    <Input
                      type="text"
                      name="firstName"
                      disabled={true}
                      value={this.props.customer.firstName}
                      id="firstName"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="lastName">
                      <IntlMessages id="forms.last-name" />
                    </Label>
                    <Input
                      type="text"
                      name="lastName"
                      disabled={true}
                      value={this.props.customer.lastName}
                      id="lastName"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="phoneNumber">
                      <IntlMessages id="forms.phone-number" />
                    </Label>
                    <Input
                      type="text"
                      name="phoneNumber"
                      disabled={true}
                      value={this.props.customer.phoneNumber}
                      id="phoneNumber"
                    />
                  </FormGroup>

                  
                </Form>
              </CardBody>
            </Card>
          </Colxx>
        </Row> 
      </Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  const { customer } = state.reporting;
  return { customer }
}

export default connect(mapStateToProps)(injectIntl(Account));

