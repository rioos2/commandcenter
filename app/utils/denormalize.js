import C from 'nilavu/utils/constants';
function denormalizeName(str) {
  return str.replace(new RegExp(`[${  C.SETTING.DOT_CHAR  }]`, 'g'), '.').toLowerCase();
}

export { denormalizeName };

