const csv = require('csv-parser');
const fs = require('fs');
const results = [];
const path = require('path');

const readCsv = (path) => new Promise((resolve, reject) => {
  const out = [];
  fs.createReadStream(path)
    .pipe(csv()).on('data', (data) => {out.push(data)})
    .on('end', () => {resolve(out)})
})

const generatePlan = (totalWeight, workouts, out=[]) => {
  const weightInPlan = out.reduce((acc, obj={weight: 0}) =>  (acc + Number(obj.weight || 0)), 0);
  if (weightInPlan >= totalWeight) return out;

  let inPlanNames =[]
  if (out.length) inPlanNames = out.map(c => c.workout)

  const availableWorkouts = workouts.filter(c => !inPlanNames.includes(c.workout)
                                                 && Number(c.weight) <= (totalWeight - weightInPlan))

  if (!availableWorkouts.length) return out;

  out.push(availableWorkouts[Math.floor(Math.random() * availableWorkouts.length)])

  return generatePlan(totalWeight, workouts, out);
}

const main = async () => {
  const upper = await readCsv(path.resolve('data/upper_extremity.csv'));
  const lower = await readCsv(path.resolve('data/lower_extremity.csv'));
  const total = await readCsv(path.resolve('data/total_body.csv'));
  const warm = await readCsv(path.resolve('data/warm_up.csv'));
  const core = await readCsv(path.resolve('data/core.csv'));


  const upperPlan = generatePlan(2, upper);
  const lowerPlan = generatePlan(2, lower);
  const totalPlan = generatePlan(2, total);
  const warmPlan = generatePlan(3, warm);
  const corePlan = generatePlan(1, core);

  console.log('warmup', warmPlan.map(c => c.workout))
  console.log('upper', upperPlan.map(c => c.workout))
  console.log('lower', lowerPlan.map(c => c.workout))
  console.log('total', totalPlan.map(c => c.workout))
  console.log('core', corePlan.map(c => c.workout))
}

  main();
