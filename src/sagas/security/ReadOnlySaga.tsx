import {select, call} from 'redux-saga/effects';

export function* readOnlySaga() {
  const {location: {pathname}}: any = yield select(state  => state.router);
  const userIdentifier = pathname.substring('/user/'.length, pathname.indexOf('/history'))
  yield call(attempToGetReadOnlyToken, userIdentifier);

  console.tron("ah shit, here we go", userIdentifier)
}

export function* attempToGetReadOnlyToken(userIdentifier: string) {

}
