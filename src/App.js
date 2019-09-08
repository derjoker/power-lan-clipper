import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import flatten from 'lodash/flatten';
import pickBy from 'lodash/pickBy';
import stringify from 'csv-stringify';

import SearchField from './SearchField';
import ItemList from './ItemList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      text: ''
    };
    this.onClick = this.onClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillMount() {
    chrome.storage.local.get(null, items => {
      console.log(items);
      this.setState({ items });
    });
  }

  onClick(id) {
    const { items } = this.state;
    const item = items[id];
    item.edit = item.edit ? false : true;
    this.setState({ items });
  }

  onDelete(id) {
    chrome.storage.local.remove(id);
    const { items } = this.state;
    delete items[id];
    this.setState({ items });
  }

  onToggle(itemId) {
    const self = this;
    return function (exampleId) {
      const { items } = self.state;
      const item = items[itemId];
      const example = item.examples[exampleId];
      example.checked = example.checked ? false : true;
      self.setState({ items });
      const newItem = Object.assign({}, item);
      delete newItem.display;
      delete newItem.edit;
      chrome.storage.local.set(
        { [itemId]: newItem },
        () => {
          chrome.storage.local.get(itemId, result => {
            console.log(result[itemId].examples[exampleId]);
          });
        }
      );
    }
  }

  render() {
    const { items, text } = this.state;
    const regex = RegExp(text);
    const filtered = text
      ? pickBy(items, item => regex.test(item.text))
      : items;
    console.log(filtered);

    return (
      <div>
        <div>
          <SearchField onChange={event => {
            this.setState({
              text: event.target.value
            });
          }} />
          <IconButton
            color="primary"
            onClick={() => {
              const selected = flatten(
                Object.values(items).map(item =>
                  Object.values(item.examples).filter(
                    example => example.checked && !example.exported
                  ).map(example => [example.front, example.back])
                )
              );
              console.log(selected);
              stringify(selected, (_, output) => {
                console.log(output);
                const blob = new Blob([output], { type: "text/csv;charset=utf-8" })
                chrome.downloads.download({
                  'url': URL.createObjectURL(blob),
                  'filename': 'power-lan.csv'
                })

                // exported
                Object.values(items).forEach(item => {
                  Object.values(item.examples).forEach(example => {
                    if (example.checked) {
                      example.exported = true;
                    }
                  });
                });
                console.log(items);
                chrome.storage.local.set(items);
              })
            }}
          >
            <CloudDownloadIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => {
              console.log('clear');
              chrome.storage.local.clear();
              this.setState({ items: {} });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
        <ItemList data={Object.values(filtered)} text={text} onClick={this.onClick} onDelete={this.onDelete} onToggle={this.onToggle} />
      </div>
    );
  }
}

export default App;
