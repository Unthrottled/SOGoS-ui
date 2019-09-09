// @flow
import * as React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import LoggedInLayout from "./LoggedInLayout";


const useStyles = makeStyles(theme => ({
}));
type Props = {};
export const Tits = (props: Props) => {
  const classes = useStyles();
  return (
    <LoggedInLayout>
    </LoggedInLayout>
  );
};