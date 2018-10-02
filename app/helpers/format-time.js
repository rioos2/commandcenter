import { helper as buildHelper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

export function formatTime([params]) {
  const timeText = params;

  if (timeText) {

    let date = moment(timeText).utcOffset(timeText);

    return new htmlSafe(`<span>${ date.format('MMM DD') } (${ date.fromNow() })<span>`);
  }

  return '';
}

export default buildHelper(formatTime);
