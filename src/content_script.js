import $ from 'jquery';
import apiConstructor from 'node-object-hash';
import fromPairs from 'lodash/fromPairs';

const hash = apiConstructor().hash;

console.log('Power Lan Clipper');

if (window.location.search === '') {
  const title = $('title')
    .text()
    .split(' - ')[0];
  const { origin, pathname } = window.location;
  const link = origin + pathname;
  const createdAt = Date.now();

  // example
  const e1 = $('.lemma-example')
    .toArray()
    .map(element => extract(element));

  // more example
  const e2 = $('.example .tab-inner-content .additional-entry')
    .toArray()
    .map(element => extract(element));

  const examples = fromPairs(e1.concat(e2));

  const text = Object.values(examples)
    .map(example => example.front + ', ' + example.back)
    .join('; ');
  // console.log(text);

  const id = hash(examples);
  chrome.storage.local.get([id], item => {
    if (!item.id) {
      chrome.storage.local.set({
        [id]: { id, title, link, createdAt, examples, text }
      });
    }
  });
}

function extract(element) {
  const clone = $.clone(element);
  $('.full', clone).remove();
  $('.ind-pieces', clone).remove();
  const en = $('.col1 .trans-line', clone);
  const de = $('.col2', clone);
  const front = en.text().trim();
  const back = de.text().trim();
  const id = hash({ front, back });

  return [id, { id, front, back }];
}

// chrome.storage.local.get(null, items => {
//   console.log(items);
// });
