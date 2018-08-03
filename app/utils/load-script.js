import { Promise } from 'rsvp';

let nextId = 1;

export function loadScript(url, id) {
  if (!id) {
    id = `loadScript-${  nextId }`;
    nextId++;
  }

  return new Promise(((resolve, reject) => {
    let script     = document.createElement('script');

    script.onload  = resolve;
    script.onerror = reject;
    script.src     = url;
    script.id      = id;
    document.getElementsByTagName('BODY')[0].appendChild(script);
  }));
}
