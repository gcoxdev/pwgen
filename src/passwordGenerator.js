import {
  getPoolSets,
  getAvailableCharTypes,
  getCharSetFromCharType,
  getAvailableCharSets,
  getRandomChar,
  getNewUnusedFilteredPools,
  getRandomChars
} from './helpers';

export default settings => {
  const {
    passwordLength,
    firstCharType,
    otherCharType,
    lastCharType,
    uniqueChars
  } = settings;
  const charPools = getPoolSets(settings);
  let password = '';
  password = '';
  console.log({ ...charPools });
  const finalPoolSet = {
    upper: charPools.filteredUpperPool,
    lower: charPools.filteredLowerPool,
    nums: charPools.filteredNumsPool,
    syms: charPools.filteredSymsPool
  };
  const availableCharTypes = getAvailableCharTypes(settings);
  const allAvailableCharSets = getAvailableCharSets(
    finalPoolSet,
    availableCharTypes
  );
  finalPoolSet.all = allAvailableCharSets;
  console.log(finalPoolSet);
  const firstCharSet = getCharSetFromCharType(finalPoolSet, firstCharType);
  const lastCharSet = getCharSetFromCharType(finalPoolSet, lastCharType);
  const otherCharSet = getCharSetFromCharType(finalPoolSet, otherCharType);
  console.log({ firstCharSet, lastCharSet, otherCharSet });

  if (uniqueChars) {
    password = 'unique';
  } else {
    const firstChar = getRandomChar(firstCharSet);
    const lastChar = getRandomChar(lastCharSet);
    const otherChars = getRandomChars(otherCharSet, passwordLength - 2);
    password = firstChar + otherChars + lastChar;
  }

  /* const pools = {
    upper: {
      all: upperCharSet,
      include: charPools.includeUpperPool,
      filtered: charPools.filteredUpperPool
    },
    lower: {
      all: lowerCharSet,
      include: charPools.includeLowerPool,
      filtered: charPools.filteredLowerPool
    },
    nums: {
      all: numsCharSet,
      include: charPools.includeNumsPool,
      filtered: charPools.filteredNumsPool
    },
    syms: {
      all: symsCharSet,
      include: charPools.includeSymsPool,
      filtered: charPools.filteredSymsPool
    }
  }; */

  /* const filteredPools = {
    upper: charPools.filteredUpperPool,
    lower: charPools.filteredLowerPool,
    nums: charPools.filteredNumsPool,
    syms: charPools.filteredSymsPool
  };

  const firstChar = getCharsFromPools(filteredPools, firstCharType, 1);
  const lastChar = getCharsFromPools(filteredPools, lastCharType, 1);
  const otherChars = getCharsFromPools(
    filteredPools,
    otherCharType,
    passwordLength - 2
  );
  console.log({ firstChar, lastChar, otherChars });

  const { totalPool } = charPools;
  console.log({ totalPool });
  let password = getRandomChars(totalPool, passwordLength);
  if (firstChar !== '') {
    password = replaceCharsAt(password, 0, firstChar);
  }
  if (lastChar !== '') {
    password = replaceCharsAt(password, passwordLength - 1, lastChar);
  }
  if (otherChars !== '') {
    password = replaceCharsAt(password, 1, otherChars);
  }

  console.log(`old pw: ${password}`);
  console.log(`dup idx: ${getDuplicateCharIndex(password)}`);

  if (uniqueChars) {
    let dupIdx = getDuplicateCharIndex(password);
    let replacement;
    let newUnusedFilteredPools;
    let newUnusedChars;
    let loopCount = 0;
    while (dupIdx > -1 && loopCount < 20) {
      newUnusedFilteredPools = getNewUnusedFilteredPools(charPools, password);
      console.log('newUnusedFilteredPools', newUnusedFilteredPools);
      if (dupIdx === password.length - 1 && lastChar !== '') {
        newUnusedChars = getCharsFromPools(newUnusedFilteredPools, lastChar, 1);
      } else if (otherChars !== '') {
        newUnusedChars = getCharsFromPools(
          newUnusedFilteredPools,
          otherChars,
          1
        );
      } else {
        const availableTypes = [];
        if (hasUppercase) availableTypes.push('upper');
        if (hasLowercase) availableTypes.push('lower');
        if (hasNumbers) availableTypes.push('nums');
        if (hasSymbols) availableTypes.push('syms');
        newUnusedChars = getCharsFromPools(
          newUnusedFilteredPools,
          getRandomType(availableTypes),
          1
        );
      }
      console.log(`newunusedchars: ${newUnusedChars}`);
      console.log(`dup char: ${password[dupIdx]}`);
      replacement = getRandomChar(newUnusedChars);
      console.log(`replacement: ${replacement}`);
      password = replaceCharsAt(password, dupIdx, replacement);
      console.log(`new pw: ${password}`);
      loopCount += 1;
      dupIdx = getDuplicateCharIndex(password);
    }
  } */

  /* if (uniqueChars) {
    let newUnusedFilteredPools;
    if (firstChar !== '') {
      newUnusedFilteredPools = getNewUnusedFilteredPools(
        filteredPools,
        password
      );
      firstChar = getCharsFromPools(newUnusedFilteredPools, firstCharType, 1);
      password = replaceCharsAt(password, 0, firstChar);
    }
    if (lastChar !== '') {
      newUnusedFilteredPools = getNewUnusedFilteredPools(
        filteredPools,
        password
      );
      lastChar = getCharsFromPools(newUnusedFilteredPools, lastCharType, 1);
      password = replaceCharsAt(password, passwordLength - 1, lastChar);
    }
    if (otherChars !== '') {
      newUnusedFilteredPools = getNewUnusedFilteredPools(
        filteredPools,
        password
      );
      otherChars = getCharsFromPools(
        newUnusedFilteredPools,
        otherCharType,
        passwordLength - 2
      );
      password = replaceCharsAt(password, 1, otherChars);
    }
  } */

  return password;
};
