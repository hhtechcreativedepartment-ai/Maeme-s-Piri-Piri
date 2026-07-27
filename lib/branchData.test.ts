import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatUpcomingBranchStatus,
  getUpcomingBranches,
  type UpcomingBranch,
} from './branchData.ts';

const currentDate = new Date('2026-07-27T00:00:00Z');

const branches: UpcomingBranch[] = [
  { branchId: 'undated', branchName: 'Undated', townOrCity: 'London', status: 'opening-soon' },
  { branchId: 'later', branchName: 'Later', townOrCity: 'London', status: 'planned', plannedOpeningDate: '2026-10-15' },
  { branchId: 'earlier', branchName: 'Earlier', townOrCity: 'London', status: 'upcoming', plannedOpeningDate: '2026-08-01' },
  { branchId: 'cancelled', branchName: 'Cancelled', townOrCity: 'London', status: 'cancelled' },
  { branchId: 'archived', branchName: 'Archived', townOrCity: 'London', status: 'archived' },
];

test('getUpcomingBranches excludes inactive records and sorts confirmed future dates first', () => {
  assert.deepEqual(
    getUpcomingBranches(branches, currentDate).map((branch) => branch.branchId),
    ['earlier', 'later', 'undated'],
  );
});

test('formatUpcomingBranchStatus formats verified future dates by month and year', () => {
  assert.equal(formatUpcomingBranchStatus(branches[2], currentDate), 'Opening August 2026');
});

test('formatUpcomingBranchStatus does not publish expired or unconfirmed dates', () => {
  assert.equal(formatUpcomingBranchStatus(branches[0], currentDate), 'Opening Soon');
  assert.equal(
    formatUpcomingBranchStatus({ ...branches[0], plannedOpeningDate: '2026-06-01' }, currentDate),
    'Opening Soon',
  );
});

test('formatUpcomingBranchStatus preserves a supplied opening label without inventing a date', () => {
  assert.equal(
    formatUpcomingBranchStatus({ ...branches[0], openingDisplay: 'After 3 Months' }, currentDate),
    'After 3 Months',
  );
});
