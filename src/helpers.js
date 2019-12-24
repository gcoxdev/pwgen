export function getRandomIntBetween(min, max) {
  const minNum = Math.ceil(min);
  const maxNum = Math.floor(max);
  const randomInt = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  return randomInt;
}

export function getRandomType(types = ['upper', 'lower', 'nums', 'syms']) {
  const lastIndex = types.length - 1;
  const type = types[getRandomIntBetween(0, lastIndex)];
  return type;
}

export function getAvailableCharTypes(settings) {
  const charTypes = [];
  const { hasUppercase, hasLowercase, hasNumbers, hasSymbols } = settings;
  if (hasUppercase) charTypes.push('upper');
  if (hasLowercase) charTypes.push('lower');
  if (hasNumbers) charTypes.push('nums');
  if (hasSymbols) charTypes.push('syms');
  return charTypes;
}

export function getAvailableCharSets(finalPoolSet, availableCharTypes) {
  let allAvailableCharSets = '';
  for (let i = 0; i < availableCharTypes.length; i += 1) {
    allAvailableCharSets += finalPoolSet[availableCharTypes[i]];
  }
  return allAvailableCharSets;
}

export function removeChar(needle, haystack) {
  const reg = new RegExp(needle);
  return haystack.replace(reg, '');
}

export function getASCIICharsInRange(start = 33, end = 126) {
  let s = '';
  for (let i = start; i <= end; i += 1) {
    s += String.fromCharCode(i);
  }
  return s;
}

export function getSymbols() {
  let s = '';
  s += getASCIICharsInRange(33, 47);
  s += getASCIICharsInRange(58, 64);
  s += getASCIICharsInRange(91, 96);
  s += getASCIICharsInRange(123, 126);
  return s;
}

export const upperCharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 26 characters
export const lowerCharSet = 'abcdefghijklmnopqrstuvwxyz'; // 26 characters
export const numsCharSet = '0123456789'; // 10 characters
export const symsCharSet = getSymbols(); // 32 characters
export const totalCharSet =
  upperCharSet + lowerCharSet + numsCharSet + symsCharSet; // 94 characters
export const similarCharSet = 'o0OiIl1L|[](){}/\\'; // 17 characters

export function getRandomChar(charSet) {
  return charSet.charAt(Math.floor(Math.random() * charSet.length));
  // return charSet.charAt(getRandomIntBetween(0, charSet.length));
}

export function getDuplicateCharIndex(str) {
  let i = 0;
  let ch = '';
  let idx = -1;
  const len = str.length;

  for (i = 0; i < len; i += 1) {
    ch = str[i];
    idx = str.indexOf(ch, i + 1);
    if (idx > -1) {
      return idx;
    }
  }
  return idx;
}

export function getRandomChars(charSet, length) {
  let s = '';
  for (let i = 0; i < length; i += 1) {
    s += getRandomChar(charSet);
  }
  return s;
}

export function getUniqueChars(charSet) {
  return charSet
    .split('')
    .filter((item, i, ar) => ar.indexOf(item) === i)
    .join('');
}

export function getFilteredChars(charSet, excludedChars) {
  const excludedCharsArray = excludedChars.split('');
  return charSet
    .split('')
    .filter(item => !excludedCharsArray.includes(item))
    .join('');
}

export function replaceCharsWithType(password, charSet, index, length = 1) {
  const pwArray = password.split('');
  for (let i = index; i < length; i += 1) {
    pwArray[i] = getRandomChar(charSet);
  }
  return pwArray.join('');
}

export function replaceCharsAt(string, index, replacement) {
  return (
    string.substr(0, index) +
    replacement +
    string.substr(index + replacement.length)
  );
}

export function replaceCharsWithChar(password, newChar, index, length = 1) {
  console.log(index);
  const pwArray = password.split('');
  const newPwArray = [...pwArray];
  console.log(pwArray[index]);
  for (let i = index; i < length; i += 1) {
    console.log(pwArray[i]);
    newPwArray[i] = newChar;
    console.log(pwArray[i]);
  }
  return pwArray.join('');
}

export function removeSpaceAndTrim(value) {
  return value
    .split(' ')
    .join('')
    .trim();
}

export function getCharTypeCount(type, state) {
  const { firstCharType, otherCharType, lastCharType } = state;
  let count = 0;
  count += firstCharType === type ? 1 : 0;
  count += otherCharType === type ? 1 : 0;
  count += lastCharType === type ? 1 : 0;
  return count;
}

export function getCharsFromPools(pools, charType, length) {
  if (charType === '') return '';
  // console.log({ pools, charType, length });

  let chars = '';
  for (let i = 0; i < length; i += 1) {
    chars += getRandomChars(pools[charType], 1);
  }

  return chars;
}

export function getCharSetFromCharType(pools, charType) {
  if (charType === '') {
    return pools.all;
  }
  return pools[charType];
}

export function getPoolSets(settings) {
  const {
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
    includeCharacters,
    excludeCharacters,
    similarChars
  } = settings;

  const includePool = getUniqueChars(includeCharacters);
  const excludePool = getUniqueChars(excludeCharacters);
  const similarPool = similarChars ? similarCharSet : '';
  const includeExcludePool = getFilteredChars(
    includePool,
    excludePool + similarPool
  );

  const includeUpperPool = getFilteredChars(
    includeExcludePool,
    lowerCharSet + numsCharSet + symsCharSet
  );
  const includeLowerPool = getFilteredChars(
    includeExcludePool,
    upperCharSet + numsCharSet + symsCharSet
  );
  const includeNumsPool = getFilteredChars(
    includeExcludePool,
    upperCharSet + lowerCharSet + symsCharSet
  );
  const includeSymsPool = getFilteredChars(
    includeExcludePool,
    upperCharSet + lowerCharSet + numsCharSet
  );
  // console.log({ includeExcludePool, includeUpperPool, includeLowerPool, includeNumsPool, includeSymsPool });

  const filteredUpperPool = hasUppercase
    ? getFilteredChars(upperCharSet, excludePool + similarPool)
    : '';
  const filteredLowerPool = hasLowercase
    ? getFilteredChars(lowerCharSet, excludePool + similarPool)
    : '';
  const filteredNumsPool = hasNumbers
    ? getFilteredChars(numsCharSet, excludePool + similarPool)
    : '';
  const filteredSymsPool = hasSymbols
    ? getFilteredChars(symsCharSet, excludePool + similarPool)
    : '';
  // console.log({ filteredUpperPool, filteredLowerPool, filteredNumsPool, filteredSymsPool });

  const totalPool = getUniqueChars(
    includeExcludePool +
      filteredUpperPool +
      filteredLowerPool +
      filteredNumsPool +
      filteredSymsPool
  );

  return {
    includePool,
    excludePool,
    similarPool,
    includeExcludePool,
    includeUpperPool,
    includeLowerPool,
    includeNumsPool,
    includeSymsPool,
    filteredUpperPool,
    filteredLowerPool,
    filteredNumsPool,
    filteredSymsPool,
    totalPool
  };
}

export function getNewUnusedFilteredPools(charPools, str) {
  const newCharPools = charPools;
  const keys = Object.keys(charPools);
  for (let i = 0; i < keys.length; i += 1) {
    newCharPools[keys[i]] = getFilteredChars(charPools[keys[i]], str);
  }
  return newCharPools;
}
