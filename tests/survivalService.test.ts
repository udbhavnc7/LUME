import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { kaplanMeier } from '../src/services/survivalService';

describe('survival service', () => {
  it('abstains on empty reference set', () => {
    const result = kaplanMeier([]);
    assert.equal(result.status, 'ABSENT');
    assert.equal(result.reason, 'EMPTY_REFERENCE_SET');
    assert.equal(result.method, 'KAPLAN_MEIER');
  });

  it('abstains when n is below minimum', () => {
    const result = kaplanMeier([
      { daysToEventOrCensor: 10, eventObserved: true },
      { daysToEventOrCensor: 20, eventObserved: false },
      { daysToEventOrCensor: 30, eventObserved: true },
      { daysToEventOrCensor: 40, eventObserved: true },
    ]);
    assert.equal(result.status, 'ABSENT');
    assert.equal(result.reason, 'INSUFFICIENT_DATA');
  });

  it('abstains when there are no events', () => {
    const result = kaplanMeier([
      { daysToEventOrCensor: 10, eventObserved: false },
      { daysToEventOrCensor: 20, eventObserved: false },
      { daysToEventOrCensor: 30, eventObserved: false },
      { daysToEventOrCensor: 40, eventObserved: false },
      { daysToEventOrCensor: 50, eventObserved: false },
    ]);
    assert.equal(result.status, 'ABSENT');
    assert.equal(result.reason, 'NO_EVENTS');
    assert.equal(result.n, 5);
  });

  it('computes a KM curve with n and points when data allows', () => {
    const result = kaplanMeier([
      { daysToEventOrCensor: 10, eventObserved: true },
      { daysToEventOrCensor: 15, eventObserved: true },
      { daysToEventOrCensor: 20, eventObserved: true },
      { daysToEventOrCensor: 25, eventObserved: false },
      { daysToEventOrCensor: 30, eventObserved: true },
      { daysToEventOrCensor: 40, eventObserved: false },
      { daysToEventOrCensor: 50, eventObserved: true },
      { daysToEventOrCensor: 60, eventObserved: false },
    ]);
    assert.equal(result.status, 'COMPUTED');
    assert.equal(result.n, 8);
    assert.ok(result.points && result.points.length >= 2);
    assert.equal(result.points![0].day, 0);
    assert.equal(result.points![0].survivalProbability, 1);
    assert.ok(typeof result.confidenceIntervalLow === 'number');
    assert.ok(typeof result.confidenceIntervalHigh === 'number');
  });
});
