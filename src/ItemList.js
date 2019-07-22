import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import orderBy from 'lodash/orderBy';

import Item from './Item';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  link: {
    marginRight: theme.spacing(1),
  },
}));

export default function ItemList({ data, text, onClick, onToggle, onDelete }) {
  const classes = useStyles();
  const items = orderBy(data, 'visitedAt', 'desc');

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table} size="small">
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  <Item item={item} text={text} onClick={onClick} onDelete={onDelete} onToggle={onToggle} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

ItemList.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onToggle: PropTypes.func
};
