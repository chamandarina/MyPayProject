import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  FormGroup,
  Label,
  Button,
  Form,
  Input
} from "reactstrap";
import Select from "react-select";
import { NotificationManager } from "../../components/common/react-notifications";

import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";

export default class QuickPost extends Component {
  constructor(props) {
    super(props);
      this.formRef = React.createRef();
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit = event => {
    let cName = "filled";
    // this.clearForm()
    // event.preventDefault()
    NotificationManager.primary(
      "Your message has been sent succefully!",
      "Support Notification",
      3000,
      null,
      null,
      cName
    );
    this.formReset();
 
 }

 formReset() {
  this.formRef.current.reset()
  }

  render() {
    return (
      <Card>
        <CardBody>
          <CardTitle>
            <IntlMessages id="dashboards.support" />
          </CardTitle>
          <Form className="dashboard-quick-post" innerRef={this.formRef}>
            <FormGroup row>
              <Label sm="3">
                <IntlMessages id="dashboards.title" />
              </Label>
              <Colxx sm="9">
                <Input type="text" name="title" />
              </Colxx>
            </FormGroup>

            <FormGroup row>
              <Label sm="3">
                <IntlMessages id="dashboards.content" />
              </Label>
              <Colxx sm="9">
                <Input type="textarea" name="message" rows="12" />
              </Colxx>
            </FormGroup>

            <Button className="float-right" color="primary" onClick={this.handleFormSubmit}>
              <IntlMessages id="dashboards.send" />
            </Button>
            
          </Form>
        </CardBody>
      </Card>
    );
  }
}
