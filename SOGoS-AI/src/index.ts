// @ts-ignore
import fs from 'fs';
import {Activity} from "../../SOGoS-UI/src/types/ActivityTypes";
import {shouldTime} from "../../SOGoS-UI/src/miscellanous/Projection";
import {constructLinearProjection} from "./LinearProjection";
import {ActivityProjection} from "../../SOGoS-UI/src/views/history/Projections";
import {StringDictionary} from "../../SOGoS-UI/src/types/BaseTypes";
import reduceRight = require('lodash/reduceRight');

const DATA_STEPS = 60000;
new Promise<Activity[]>(((resolve, reject) => fs.readFile('./data/data.json', (err, data) => {
  if (err) {
    reject(err)
  } else {
    // @ts-ignore
    resolve(JSON.parse(data))
  }
})))
  .then(activities => {
    const idToActivity = reduceRight(activities, (accum: StringDictionary<Activity>, activity)=> {
      accum[activity.content.uuid] = activity;
      return accum;
    }, {});
    return Object.values(idToActivity);
  })
  .then(activities => {
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

