import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTools,
  faPenSquare,
  faInfoCircle,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

import {
  getUniqueChars,
  removeSpaceAndTrim,
  getPoolSets,
  getAvailableCharTypes
} from '../helpers';
import { updatePWSettings, createPassword, resetPWSettings, updateUISettings } from '../actions';
import { passwordSettings as defaultPasswordSettings } from '../reducers/defaultSettings';

class Settings extends Component {
  state = {
    advancedHidden: true
  };

  minCharTypeMap = {
    upper: 'minUpper',
    lower: 'minLower',
    nums: 'minNums',
    syms: 'minSyms'
  };

  componentDidMount() {
    this.updateCharSets();
  }

  componentDidUpdate(prevProps) {
    this.updateCharSets();
    this.updateUniqueChars(prevProps);
  }

  getTypeMin = type => {
    const { passwordSettings } = this.props;
    const minType = this.minCharTypeMap[type];
    const minTypeMin = `${minType}Min`;
    const minTypeCount = passwordSettings[minType];
    const minTypeMinCount = passwordSettings[minTypeMin];

    // console.log({ minTypeCount, minTypeMinCount });
    if (minTypeMinCount < minTypeCount) {
      return minTypeMinCount;
    }
    return minTypeCount;
  };

  getTypeMax = type => {
    const { passwordSettings } = this.props;
    const { passwordLength, totalMinChars } = passwordSettings;
    const charTypeMin = this.minCharTypeMap[type];
    const minTypeCount = passwordSettings[charTypeMin];
    return passwordLength - totalMinChars + minTypeCount;
  };

  onNumberChange = (valueAsNumber, valueAsString, input) => {
    const { updatePWSettingsConnect, createPasswordConnect } = this.props;
    updatePWSettingsConnect(input.name, valueAsNumber);
    createPasswordConnect();
  };

  getUpdatedCharTypeCount = (name, value) => {
    const minCounts = { upper: 0, lower: 0, nums: 0, syms: 0 };
    const { passwordSettings } = this.props;
    const { firstCharType, otherCharType, lastCharType } = passwordSettings;

    if (name === 'firstCharType') {
      if (value !== '') minCounts[value] += 1;
      if (otherCharType !== '') minCounts[otherCharType] += 1;
      if (lastCharType !== '') minCounts[lastCharType] += 1;
    } else if (name === 'otherCharType') {
      if (value !== '') minCounts[value] += 1;
      if (firstCharType !== '') minCounts[firstCharType] += 1;
      if (lastCharType !== '') minCounts[lastCharType] += 1;
    } else if (name === 'lastCharType') {
      if (value !== '') minCounts[value] += 1;
      if (firstCharType !== '') minCounts[firstCharType] += 1;
      if (otherCharType !== '') minCounts[otherCharType] += 1;
    }

    return minCounts;
  };

  getHighestMinType = () => {
    const { passwordSettings } = this.props;
    const keys = Object.keys(this.minCharTypeMap);
    let max = 0;
    let maxType = '';

    for (let i = 0; i < keys.length; i += 1) {
      if (passwordSettings[this.minCharTypeMap[keys[i]]] > max) {
        max = passwordSettings[this.minCharTypeMap[keys[i]]];
        maxType = keys[i];
      }
    }
    return maxType;
  };

  onCharTypeChange = e => {
    const { name, value } = e.target;
    const { passwordSettings, updatePWSettingsConnect } = this.props;
    const { totalMinChars, passwordLength } = passwordSettings;

    /*
        - get char type counts
        - if min < char type count, increase min, update mintotal
        --- if total mins > passwordlength, decrease min of highest, update mintotal
    */

    const minCounts = this.getUpdatedCharTypeCount(name, value);
    const charTypeCount = minCounts[value]; // upper: 3
    const minType = this.minCharTypeMap[value]; // minUpper
    const minTypeCount = passwordSettings[minType]; // minUpper: 2

    if (charTypeCount > minTypeCount) {
      updatePWSettingsConnect(minType, charTypeCount); // minUpper: 3
      if (totalMinChars === passwordLength) {
        // 6 === 6
        const highestMinType = this.minCharTypeMap[this.getHighestMinType()]; // minNums
        updatePWSettingsConnect(
          highestMinType,
          passwordSettings[highestMinType] - 1
        ); // minNums: 4 -> 3
      } else {
        updatePWSettingsConnect('totalMinChars', totalMinChars + 1);
      }
    }

    // Update min type min
    const minCountsKeys = Object.keys(minCounts);
    for (let i = 0; i < minCountsKeys.length; i += 1) {
      const minTypeMin = `${this.minCharTypeMap[minCountsKeys[i]]}Min`;
      const minTypeMinCount = minCounts[minCountsKeys[i]];
      // console.log('minTypeMin: ' + minTypeMin)
      updatePWSettingsConnect(minTypeMin, minTypeMinCount);
    }

    this.onUpdateSettings(e);
  };

  onUpdateSettings = (e, callback = null) => {
    const { target } = e;
    const { updatePWSettingsConnect, createPasswordConnect } = this.props;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    value = callback ? callback(value) : value;
    const { name } = target;
    updatePWSettingsConnect(name, value);
    createPasswordConnect();
  };

  onCharsetCheck = e => {
    if (!this.isLastChecked(e.target.name)) {
      this.resetDependentCharsetSettings(e.target.name);
      this.onUpdateSettings(e);
    }
  };

  onCharTypeLengthChange = (valueAsNumber, valueAsString, input) => {
    const { passwordSettings, updatePWSettingsConnect } = this.props;
    const {
      passwordLength,
      minUpper,
      minLower,
      minNums,
      minSyms
    } = passwordSettings;
    const storeMinTotal = minUpper + minLower + minNums + minSyms;
    const storeInputValue = passwordSettings[input.name];
    const storeVsCurrentDiff = valueAsNumber - storeInputValue;
    const newMinTotal = storeMinTotal + storeVsCurrentDiff;

    if (newMinTotal <= passwordLength) {
      updatePWSettingsConnect('totalMinChars', newMinTotal);
      this.onNumberChange(valueAsNumber, valueAsString, input);
    }
  };

  getTotalCharTypeChecked() {
    const { passwordSettings } = this.props;
    const {
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      charSetPools
    } = passwordSettings;
    let totalChecked = 0;
    totalChecked +=
      hasUppercase || charSetPools.includeUpperPool.length > 0 ? 1 : 0;
    totalChecked +=
      hasLowercase || charSetPools.includeLowerPool.length > 0 ? 1 : 0;
    totalChecked +=
      hasNumbers || charSetPools.includeNumsPool.length > 0 ? 1 : 0;
    totalChecked +=
      hasSymbols || charSetPools.includeSymsPool.length > 0 ? 1 : 0;
    return totalChecked;
  }

  resetSetting = key => {
    const { updatePWSettingsConnect } = this.props;
    updatePWSettingsConnect(key, defaultPasswordSettings[key]);
  };

  resetDependentCharsetFields = (firstLastOtherChoice, minCharType) => {
    const { passwordSettings, updatePWSettingsConnect } = this.props;
    if (passwordSettings.firstCharType === firstLastOtherChoice)
      this.resetSetting('firstCharType');
    if (passwordSettings.lastCharType === firstLastOtherChoice)
      this.resetSetting('lastCharType');
    if (passwordSettings.otherCharType === firstLastOtherChoice)
      this.resetSetting('otherCharType');
    this.resetSetting(minCharType);
    updatePWSettingsConnect(
      'totalMinChars',
      passwordSettings.totalMinChars - passwordSettings[minCharType]
    );
  };

  resetDependentCharsetSettings = charSetField => {
    switch (charSetField) {
      case 'hasUppercase':
        this.resetDependentCharsetFields('upper', 'minUpper');
        break;
      case 'hasLowercase':
        this.resetDependentCharsetFields('lower', 'minLower');
        break;
      case 'hasNumbers':
        this.resetDependentCharsetFields('nums', 'minNums');
        break;
      case 'hasSymbols':
        this.resetDependentCharsetFields('syms', 'minSyms');
        break;
      default:
    }
  };

  updateCharSets = () => {
    const { passwordSettings, updatePWSettingsConnect } = this.props;
    const { totalCharSetCount } = passwordSettings;
    const pools = getPoolSets(passwordSettings);
    const newTotalCharSetCount = pools.totalPool.length;
    if (totalCharSetCount !== newTotalCharSetCount) {
      updatePWSettingsConnect('charSetPools', pools);
      updatePWSettingsConnect('totalCharSetCount', newTotalCharSetCount);
    }
  };

  updateUniqueChars = prevProps => {
    const { passwordSettings, updatePWSettingsConnect } = this.props;
    const prevPasswordLength = prevProps.passwordSettings.passwordLength;
    const prevTotalCharSetCount = prevProps.passwordSettings.totalCharSetCount;
    const { passwordLength, totalCharSetCount } = passwordSettings;

    if (
      prevPasswordLength !== passwordLength ||
      (totalCharSetCount !== prevTotalCharSetCount &&
        totalCharSetCount < passwordLength)
    ) {
      updatePWSettingsConnect('uniqueChars', false);
    }
  };

  getMaxCharType = (type, max, min) => {
    const { passwordSettings } = this.props;
    const {
      passwordLength,
      minUpper,
      maxUpper,
      minLower,
      maxLower,
      minNums,
      maxNums,
      minSyms,
      maxSyms
    } = passwordSettings;
    const totalMinMaxDiff =
      maxUpper -
      minUpper +
      maxLower -
      minLower +
      maxNums -
      minNums +
      maxSyms -
      minSyms;
    // console.log(totalMinMaxDiff);
    return passwordLength - totalMinMaxDiff + max - min;
  };

  handleResetSettings = e => {
    console.log('reset settings');
    const { resetPWSettingsConnect } = this.props;
    resetPWSettingsConnect();
  };

  handleAdvanceSettingsClick = e => {
    this.setState(prevState => ({
      advancedHidden: !prevState.advancedHidden
    })
  }

  isLastChecked(name) {
    const { passwordSettings } = this.props;
    const {
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols
    } = passwordSettings;
    switch (name) {
      case 'hasUppercase':
        return !hasLowercase && !hasNumbers && !hasSymbols;
      case 'hasLowercase':
        return !hasUppercase && !hasNumbers && !hasSymbols;
      case 'hasNumbers':
        return !hasLowercase && !hasUppercase && !hasSymbols;
      case 'hasSymbols':
        return !hasLowercase && !hasNumbers && !hasUppercase;
      default:
        return false;
    }
  }

  renderCharTypeOptions() {
    const { passwordSettings } = this.props;
    const {
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      charSetPools
    } = passwordSettings;
    return (
      <>
        <option value="">&nbsp;</option>
        {hasUppercase || charSetPools.includeUpperPool.length > 0 ? (
          <option value="upper">UPPERCASE</option>
        ) : null}
        {hasLowercase || charSetPools.includeLowerPool.length > 0 ? (
          <option value="lower">lowercase</option>
        ) : null}
        {hasNumbers || charSetPools.includeNumsPool.length > 0 ? (
          <option value="nums">1234567890</option>
        ) : null}
        {hasSymbols || charSetPools.includeSymsPool.length > 0 ? (
          <option value="syms">$`/^^|&gt;()!_&amp;</option>
        ) : null}
      </>
    );
  }

  render() {
    const { passwordSettings } = this.props;
    const { uiSettings } = this.props;
    const { advancedHidden } = this.state;
    const {
      passwordLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      includeCharacters,
      excludeCharacters,
      alwaysIncludeCharacters,
      mostConsecutive,
      similarChars,
      uniqueChars,
      firstCharType,
      lastCharType,
      otherCharType,
      totalMinChars,
      totalCharSetCount,
      charSetPools,
      minUpper,
      minLower,
      minNums,
      minSyms,
      minUpperMin,
      minLowerMin,
      minNumsMin,
      minSymsMin
    } = passwordSettings;
    const { advancedSettings } = uiSettings;
    const availableTypes = getAvailableCharTypes(passwordSettings);
    const availableTypesCount = availableTypes.length;
    return (
      <div>
        <Row>
          <Col>
            <Form.Group controlId="basic-length">
              <Form.Label>Password Length</Form.Label>
              <Form.Control
                as={NumericInput}
                strict
                mobile
                name="passwordLength"
                placeholder="Default is 12"
                min={6}
                value={passwordLength}
                onChange={this.onNumberChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Check
              custom
              inline
              name="hasUppercase"
              type="checkbox"
              id="basic-uppercase"
              label="UPPERCASE"
              checked={hasUppercase}
              onChange={this.onCharsetCheck}
            />
            <Form.Check
              custom
              inline
              name="hasLowercase"
              type="checkbox"
              id="basic-lowercase"
              label="lowercase"
              checked={hasLowercase}
              onChange={this.onCharsetCheck}
            />
            <Form.Check
              custom
              inline
              name="hasNumbers"
              type="checkbox"
              id="basic-numbers"
              label="1234567890"
              checked={hasNumbers}
              onChange={this.onCharsetCheck}
            />
            <Form.Check
              custom
              inline
              name="hasSymbols"
              type="checkbox"
              id="basic-symbols"
              label="$`/^^|>()!_&amp;"
              checked={hasSymbols}
              onChange={this.onCharsetCheck}
            />
          </Col>
        </Row>
        <Row className="my-4">
          <Col xs={8}>
            <Button
              variant="outline-secondary"
              onClick={this.handleAdvanceSettingsClick)
            }
            block
          >
              <FontAwesomeIcon icon={faTools} />
            &nbsp;Advanced Settings
            </Button>
          </Col>
        <Col xs={4}>
          <Button
            variant="outline-danger"
            onClick={this.handleResetSettings}
            block
          >
            <FontAwesomeIcon icon={faSyncAlt} />
            &nbsp;Reset
            </Button>
        </Col>
        </Row>
      <Row className={advancedHidden ? 'd-none' : ''}>
        <Col>
          <Row>
            <Col>
              <Form.Group controlId="profile-name">
                <Form.Label>Profile Name</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Profile name"
                    aria-label="Profile name"
                    aria-describedby="basic-addon2"
                  />
                  <InputGroup.Append>
                    <Button
                      variant="outline-warning"
                      onClick={() => console.log('update or add')}
                    >
                      <FontAwesomeIcon icon={faPenSquare} />
                      &nbsp;Update
                      </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group controlId="advanced-include">
                <Form.Label>
                  Include Characters&nbsp;
                    <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="tooltip-right-include-chars">
                        Type all characters you want to include sequentially.
                        There is no delimeter. Excluded characters will take
                        precedence over included characters.
                        </Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  name="includeCharacters"
                  type="text"
                  placeholder=""
                  value={includeCharacters}
                  onChange={e =>
                    this.onUpdateSettings(e, value =>
                      getUniqueChars(removeSpaceAndTrim(value))
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="advanced-exclude">
                <Form.Label>
                  Exclude Characters&nbsp;
                    <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="tooltip-right-exclude-chars">
                        Type all characters you want to exclude sequentially.
                        There is no delimeter. Excluded characters will take
                        precedence over included characters.
                        </Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  name="excludeCharacters"
                  type="text"
                  placeholder=""
                  value={excludeCharacters}
                  onChange={e =>
                    this.onUpdateSettings(e, value =>
                      getUniqueChars(removeSpaceAndTrim(value))
                    )
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group controlId="advanced-most-consecutive">
                <Form.Label>Most Consecutive Identical Characters</Form.Label>
                <Form.Control
                  as={NumericInput}
                  strict
                  mobile
                  name="mostConsecutive"
                  min={0}
                  max={passwordLength}
                  value={mostConsecutive}
                  onChange={this.onNumberChange}
                />
              </Form.Group>
            </Col>
            <Col className="py-3" sm={6}>
              <Form.Check custom type="checkbox" id="advanced-similar">
                <Form.Check.Input
                  name="similarChars"
                  type="checkbox"
                  checked={similarChars}
                  onChange={this.onUpdateSettings}
                />
                <Form.Check.Label>
                  Exclude Similar Characters&nbsp;
                    <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-right-advanced-similar">
                        o, 0, O, i, I, l, 1, L, |, /, \, (, ), &#123;, &#125;,
                          <br />
                        Will take precedence over included characters.
                        </Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </OverlayTrigger>
                </Form.Check.Label>
              </Form.Check>
              <Form.Check
                custom
                name="uniqueChars"
                type="checkbox"
                id="advanced-unique"
                label="Only Unique Characters"
                disabled={totalCharSetCount < passwordLength}
                checked={uniqueChars}
                onChange={this.onUpdateSettings}
              />
            </Col>
          </Row>
          {this.getTotalCharTypeChecked() > 1 ? (
            <Row>
              <Col sm={4}>
                <Form.Group controlId="advanced-first-char-type">
                  <Form.Label>First Character Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="firstCharType"
                    value={firstCharType}
                    onChange={this.onCharTypeChange}
                  >
                    {this.renderCharTypeOptions()}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="advanced-other-char-type">
                  <Form.Label>Other Character Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="otherCharType"
                    value={otherCharType}
                    onChange={this.onCharTypeChange}
                  >
                    {this.renderCharTypeOptions()}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="advanced-last-char-type">
                  <Form.Label>Last Character Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="lastCharType"
                    value={lastCharType}
                    onChange={this.onCharTypeChange}
                  >
                    {this.renderCharTypeOptions()}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          ) : null}
          <Row>
            {(hasUppercase && availableTypesCount > 1) ||
              charSetPools.includeUpperPool.length > 0 ? (
                <Col sm={6}>
                  <Form.Group controlId="advanced-uppercase-min">
                    <Form.Label>Min. UPPERCASE</Form.Label>
                    <Form.Control
                      as={NumericInput}
                      strict
                      mobile
                      name="minUpper"
                      min={this.getTypeMin('upper')}
                      max={this.getTypeMax('upper')}
                      value={minUpper}
                      onChange={this.onCharTypeLengthChange}
                    />
                  </Form.Group>
                </Col>
              ) : null}
            {(hasLowercase && availableTypesCount > 1) ||
              charSetPools.includeLowerPool.length > 0 ? (
                <Col sm={6}>
                  <Form.Group controlId="advanced-lowercase-min">
                    <Form.Label>Min. lowercase</Form.Label>
                    <Form.Control
                      as={NumericInput}
                      strict
                      mobile
                      name="minLower"
                      min={this.getTypeMin('lower')}
                      max={this.getTypeMax('lower')}
                      value={minLower}
                      onChange={this.onCharTypeLengthChange}
                    />
                  </Form.Group>
                </Col>
              ) : null}
            {(hasNumbers && availableTypesCount > 1) ||
              charSetPools.includeNumsPool.length > 0 ? (
                <Col sm={6}>
                  <Form.Group controlId="advanced-numbers-min">
                    <Form.Label>Min. 1234567890</Form.Label>
                    <Form.Control
                      as={NumericInput}
                      strict
                      mobile
                      name="minNums"
                      min={this.getTypeMin('nums')}
                      max={this.getTypeMax('nums')}
                      value={minNums}
                      onChange={this.onCharTypeLengthChange}
                    />
                  </Form.Group>
                </Col>
              ) : null}
            {(hasSymbols && availableTypesCount > 1) ||
              charSetPools.includeSymsPool.length > 0 ? (
                <Col sm={6}>
                  <Form.Group controlId="advanced-symbols-min">
                    <Form.Label>Min. $`/^^|&gt;()!_&amp;</Form.Label>
                    <Form.Control
                      as={NumericInput}
                      strict
                      mobile
                      name="minSyms"
                      min={this.getTypeMin('syms')}
                      max={this.getTypeMax('syms')}
                      value={minSyms}
                      onChange={this.onCharTypeLengthChange}
                    />
                  </Form.Group>
                </Col>
              ) : null}
          </Row>
        </Col>
      </Row>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    passwordSettings: state.passwordSettings,
    uiSettings: state.uiSettings
  };
};

export default connect(
  mapStateToProps,
  {
    updatePWSettingsConnect: updatePWSettings,
    createPasswordConnect: createPassword,
    resetPWSettingsConnect: resetPWSettings,
    updateUISettingsConnect: updateUISettings
  }
)(Settings);
