import React from 'react';
import { connect } from 'react-redux';
import {
  InputGroup,
  FormControl,
  ListGroup,
  ButtonGroup,
  Button,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faArrowUp,
  faArrowDown,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  faEdit,
  faTrashAlt,
  faPlusSquare,
  faClone
} from '@fortawesome/free-regular-svg-icons';

import {
  updateUISettings,
  createPassword,
  resetUISettings,
  resetPWSettings
} from '../actions';

class ProfileSettings extends React.Component {
  handleNewClick = e => {
    const { props } = this;
    props.resetUISettingsConnect();
    props.resetPWSettingsConnect();
    console.log('new');
  };

  render() {
    return (
      <div>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="profiles-search">
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Search"
            aria-label="Search"
            aria-describedby="profiles-search"
          />
        </InputGroup>
        <ListGroup defaultActiveKey="" className="mb-3">
          <ListGroup.Item>
            <a
              href="/"
              onClick={e => {
                e.preventDefault();
                console.log('clicked');
              }}
            >
              Profile 1
            </a>
            <ButtonGroup
              aria-label="Action buttons"
              className="float-right"
              size="sm"
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-profile-up">Move up</Tooltip>}
              >
                <Button
                  variant="secondary"
                  onClick={e => {
                    e.preventDefault();
                    console.log('up');
                  }}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-profile-down">Move down</Tooltip>}
              >
                <Button
                  variant="secondary"
                  onClick={e => {
                    e.preventDefault();
                    console.log('down');
                  }}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-profile-duplicate">Duplicate</Tooltip>
                }
              >
                <Button
                  variant="info"
                  onClick={e => {
                    e.preventDefault();
                    console.log('duplicate');
                  }}
                >
                  <FontAwesomeIcon icon={faClone} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-profile-edit">Edit</Tooltip>}
              >
                <Button
                  variant="primary"
                  onClick={e => {
                    e.preventDefault();
                    console.log('edit');
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-profile-delete">Delete</Tooltip>}
              >
                <Button
                  variant="danger"
                  onClick={e => {
                    e.preventDefault();
                    console.log('delete');
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </ListGroup.Item>
        </ListGroup>
        <Button variant="primary" onClick={this.handleNewClick}>
          <FontAwesomeIcon icon={faPlusSquare} />
          &nbsp;New
        </Button>
        <Button
          variant="danger"
          className="float-right"
          onClick={() => console.log('reset to default')}
        >
          <FontAwesomeIcon icon={faSyncAlt} />
          &nbsp;Reset to Default
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    uiSettings: state.uiSettings,
    passwordSettings: state.passwordSettings
  };
};

export default connect(
  mapStateToProps,
  {
    updateUISettingsConnect: updateUISettings,
    createPasswordConnect: createPassword,
    resetPWSettingsConnect: resetPWSettings,
    resetUISettingsConnect: resetUISettings
  }
)(ProfileSettings);
