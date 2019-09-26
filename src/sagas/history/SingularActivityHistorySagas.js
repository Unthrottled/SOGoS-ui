import {call} from "@redux-saga/core/effects";


export function* apiBeforeCapstoneSaga({payload}){
  console.log("before api capstone saga", payload);

}
export function* apiAfterCapstoneSaga({payload}){
  console.log("after api capstone saga", payload);
}

export function* currentActivityHistorySaga({payload}) {
  yield call(console.log, payload);
}
