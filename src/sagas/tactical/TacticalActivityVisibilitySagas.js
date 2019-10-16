

export function* tacticalActivityHiddenSaga({payload}) {
  console.log(payload, "should hide this");
}

export function* tacticalActivityShownSaga({payload}) {

  console.log(payload, "should show this");

}
