import PropTypes from 'prop-types';
import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const StrengthMeter = props => {
  const strengthColor = strength => {
    if (strength >= 75) {
      return 'success';
    }
    if (strength >= 50) {
      return 'warning';
    }
    return 'danger';
  };

  const strengthLabel = strength => {
    if (strength >= 75) {
      return 'Strong';
    }
    if (strength >= 50) {
      return 'Average';
    }
    return 'Weak';
  };

  const { strength } = props;
  return (
    <ProgressBar
      min={0}
      max={100}
      now={strength}
      variant={strengthColor(strength)}
      className="mb-4"
      label={strengthLabel(strength)}
    />
  );
};

StrengthMeter.defaultValues = {
  strength: 0
};

StrengthMeter.propTypes = {
  strength: PropTypes.number.isRequired
};

export default StrengthMeter;
