// @flow
import * as React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import LoggedInLayout from "./LoggedInLayout";

const pickOne = [
  'https://acari.io/misc/9eccbbaf0461ecb3c044d582017dd6ee.jpg',
  'https://static1.e621.net/data/a3/be/a3beb6fd045222a7088e8c886b916ddb.png',
  'https://acari.io/misc/0ee2189a1b290267840e5cb90ff4a1d8.jpg',
];

const useStyles = makeStyles(theme => ({
  sharkTits: {
    background: `url(${pickOne[Math.floor(Math.random() * (pickOne.length))]}) no-repeat center`,
    height: '100%'
  }
}));
type Props = {};
export const Tits = (props: Props) => {
  const classes = useStyles();
  return (
    <LoggedInLayout>
      <div className={classes.sharkTits}></div>
    </LoggedInLayout>
  );
};