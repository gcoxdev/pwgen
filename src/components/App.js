import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Tab, Button, Form, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import {
  faCogs,
  faAlignJustify,
  faRedo
} from '@fortawesome/free-solid-svg-icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  updateUISettings,
  createPassword,
  updatePassword,
  updatePWSettings
} from '../actions';

import TopNav from './TopNav';
import StrengthMeter from './StrengthMeter';
import Settings from './Settings';
import Profiles from './Profiles';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = props => {
  const {
    activePane,
    password,
    updateUISettingsConnect,
    updatePasswordConnect,
    createPasswordConnect
  } = props;
  return (
    <Container>
      <TopNav />
      <Row>
        <Col lg={6}>
          <Form.Group controlId="">
            <Form.Label>Your Password</Form.Label>
            <Form.Control
              as="textarea"
              rows="4"
              value={password}
              onChange={e => updatePasswordConnect(e.target.value)}
            />
          </Form.Group>
          <StrengthMeter strength={40} />
          <Row className="mb-4">
            <Col xs={8}>
              <Button onClick={() => createPasswordConnect()} block>
                <FontAwesomeIcon icon={faRedo} />
                &nbsp;Generate
              </Button>
            </Col>
            <Col xs={4}>
              <CopyToClipboard text={password}>
                <Button variant="secondary" block>
                  <FontAwesomeIcon icon={faCopy} />
                  &nbsp;Copy
                </Button>
              </CopyToClipboard>
            </Col>
          </Row>
        </Col>
        <Col lg={6}>
          <Tab.Container
            id="settings-tabs"
            defaultActiveKey={activePane}
            activeKey={activePane}
          >
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link
                  eventKey="settings"
                  onClick={() =>
                    updateUISettingsConnect('activePane', 'settings')
                  }
                >
                  <FontAwesomeIcon icon={faCogs} />
                  &nbsp;Settings
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="profiles"
                  onClick={() =>
                    updateUISettingsConnect('activePane', 'profiles')
                  }
                >
                  <FontAwesomeIcon icon={faAlignJustify} />
                  &nbsp;Profiles
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="settings" className="mt-4">
                <Settings />
              </Tab.Pane>
              <Tab.Pane eventKey="profiles" className="mt-4">
                <Profiles />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    activePane: state.uiSettings.activePane,
    password: state.passwordSettings.password
  };
};

export default connect(
  mapStateToProps,
  {
    updateUISettingsConnect: updateUISettings,
    updatePWSettingsConnect: updatePWSettings,
    createPasswordConnect: createPassword,
    updateUIPasswordConnect: updatePassword
  }
)(App);
