import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import SurveyDetailApp from "../../../components/applications/SurveyDetailApp";
 
export default class Start extends Component {
    render() {
        return (
              <SurveyDetailApp match={this.props.match} />
            /* <Row>
              <Colxx xxs="12">
                <Breadcrumb heading="menu.start" match={this.props.match} />
                <Separator className="mb-5" />
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="12" className="mb-4">
                { <p><IntlMessages id="menu.start"/></p> }
                <SurveyDetailCard survey={{ title:"Profile", category:"User details", labelColor:"black", label:"User details"}} />
              </Colxx>
            </Row> */
          
        )
    }
}
