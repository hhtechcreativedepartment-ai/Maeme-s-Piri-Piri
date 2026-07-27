import assert from 'node:assert/strict';
import test from 'node:test';
import { CAREER_CV_MAX_BYTES, isAllowedCvFile } from './careerData.ts';

test('CV validation accepts supported files within the size limit', () => {
  assert.equal(isAllowedCvFile({ name: 'candidate.pdf', size: 1024, type: 'application/pdf' }), true);
  assert.equal(isAllowedCvFile({ name: 'candidate.DOCX', size: 2048, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), true);
});

test('CV validation rejects unsafe extensions, empty files and oversized files', () => {
  assert.equal(isAllowedCvFile({ name: 'candidate.exe', size: 1024, type: 'application/octet-stream' }), false);
  assert.equal(isAllowedCvFile({ name: 'candidate.pdf', size: 0, type: 'application/pdf' }), false);
  assert.equal(isAllowedCvFile({ name: 'candidate.doc', size: CAREER_CV_MAX_BYTES + 1, type: 'application/msword' }), false);
});
