import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import filter from 'lodash/filter';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  link: {
    marginRight: theme.spacing(1),
  },
  span: {
    fontSize: '80%',
    fontStyle: 'italic',
    color: 'gray',
  }
}));

function ExampleTable({ examples, onToggle }) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableBody>
          {examples.map(example => (
            <TableRow key={example.id}>
              <TableCell>
                <input type="checkbox" checked={example.checked} onChange={() => {
                  onToggle(example.id);
                }} />
              </TableCell>
              <TableCell component="th" scope="row">
                {example.front}
              </TableCell>
              <TableCell>
                {example.back}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default function Item({ item, text, onClick, onDelete, onToggle }) {
  const classes = useStyles();
  let examples;
  if (text) {
    const regex = RegExp(text);
    examples = filter(Object.values(item.examples), example => regex.test(example.front) || regex.test(example.back));
  } else if (item.edit) {
    examples = Object.values(item.examples);
  } else {
    examples = filter(Object.values(item.examples), 'checked');
  }

  return (
    <div className={classes.root}>
      <div>
        <Link className={classes.link} href={item.link} target="_blank">
          {item.title}
        </Link>
        <Link className={classes.link} component="button" onClick={() => {
          onClick(item.id);
        }}>edit/done</Link>
        <Link className={classes.link} component="button" onClick={() => {
          onDelete(item.id);
        }}>delete</Link>
        <span className={classes.span}>{moment(item.createdAt).fromNow()}</span>
      </div>
      <ExampleTable examples={examples} onToggle={onToggle(item.id)} />
    </div>
  );
}

Item.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onToggle: PropTypes.func,
};
