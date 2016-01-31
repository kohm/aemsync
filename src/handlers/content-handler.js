'use strict';

const path = require('path');
const log = require('../log.js');

const RE_DOT = /^.*\/\..*$/;
const RE_CONTENT_PATH = /^.*\/jcr_root(\/[^\/]+){2,}$/;
const RE_SPECIAL = /^.*(\/_jcr_content\/|[^\/]+\.dir|\.content\.xml).*$/;
const RE_ZIP_PATH = /^.*[\/\\](jcr_root[\/\\].*)$/;

class ContentHandler {
  process(pack, localPath) {
    log.info('Changed:', localPath);

    var cleanPath = localPath.replace(/\\/g, '/');

    // Ignore dot-prefixed files and directories except ".content.xml".
    if (cleanPath.match(RE_DOT) && !cleanPath.endsWith('.content.xml')) {
      return;
    }

    // Process items only under 'jcr_root/*/'
    if (!cleanPath.match(RE_CONTENT_PATH)) {
      return;
    }

    // Use parent if item is 'special'.
    if (cleanPath.match(RE_SPECIAL)) {
      this.process(pack, path.dirName(localPath));
      return;
    }

    var zipPath = localPath.replace(RE_ZIP_PATH, '$1');
    pack.update(localPath, zipPath);
  }
}

module.exports.ContentHandler = ContentHandler;
