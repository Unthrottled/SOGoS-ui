// @ts-ignore
import fs from 'fs';
import {Activity} from "../../SOGoS-Next-Gen/src/types/ActivityTypes";
import {shouldTime} from "../../SOGoS-Next-Gen/src/miscellanous/Projection";
import {constructLinearProjection} from "./LinearProjection";
import {ActivityProjection} from "../../SOGoS-Next-Gen/src/views/history/Projections";

const DATA_STEPS = 60000;
new Promise<Activity[]>(((resolve, reject) => fs.readFile('./data/data.json', (err, data) => {
  if (err) {
    reject(err)
  } else {
    // @ts-ignore
    resolve(JSON.parse(data))
  }
}))).then(activities => {
  const timingData = activities.filter(shouldTime)
    .sort(((a, b) => b.antecedenceTime - a.antecedenceTime));
  return constructLinearProjection(timingData);
}).then(linearProjection => {
  return linearProjection.activityBins.map((projection: ActivityProjection) => {
    const dataPoints = Math.floor((projection.stop - projection.start) / DATA_STEPS) + 1;
    return Array(dataPoints).fill(0)
      .map((_, index) => ({
        timeStamp: projection.start + (DATA_STEPS * index),
        spawn: projection.spawn,
      }));
  }).reduce((accum, a) => accum.concat(a), [])
})
  .then(activitiesOverTime => JSON.stringify(activitiesOverTime, null))
  .then(activitiesOverTime =>
    new Promise(((resolve, reject) =>
      fs.writeFile('./data/projection.json',
        activitiesOverTime,
        (error) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        }))));

