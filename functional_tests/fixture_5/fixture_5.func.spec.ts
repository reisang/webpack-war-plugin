import 'mocha';
import * as chai from 'chai';
const expect = chai.expect;
import { exec, cd } from 'shelljs';
import * as AdmZip from 'adm-zip';
import { resolve } from 'path';

describe('Fixture 5: specifying a different archive name', function () {
  let webpackOutput: string;
  let archiveEntries: string[];

  before('Run webpack build', function () {
    cd(resolve(__dirname));
    const { code, stderr, stdout } = exec('npm run build');

    if (code != 0) return expect.fail(stderr, '', 'Webpack build failed');

    webpackOutput = stdout;
  });

  before('Get archive entries', function () {
    const zip = new AdmZip(resolve(__dirname, 'dist', 'archive.war'));

    archiveEntries = zip.getEntries().map(entry => entry.entryName);
  });

  describe('Webpack output', function () {
    it('Should output "WAR Archive"', function () {
      expect(webpackOutput).to.contain('WAR Archive');
    });

    it('Should output the correct archive information line', function () {
      expect(webpackOutput).to.contain('archive.war');
      expect(webpackOutput).to.contain('[written]');
      expect(webpackOutput).to.match(/[\s\S]archive\.war\t\d+\.?\d* (B|KB|MB)[\s\S]/);
    });
  });

  describe('Archive content', function () {
    it('Should create a archive which contains the correct elements', function () {
      expect(archiveEntries).to.include.members(['file1.js']);
    });
  });
});
