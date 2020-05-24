import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { ThemeColors } from '../../../helpers/ThemeColors'
import QuickPost from "../../../containers/dashboards/QuickPost";


class Support extends Component {
  colors = ThemeColors()
  constructor() {
    super();
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx md="12" className="mb-4">
            <QuickPost/>
          </Colxx>
        </Row>    
      </Fragment>
    );
  }
}


export default injectIntl(Support);
