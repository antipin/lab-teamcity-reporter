# Lab TeamCity reporter

[![npm](https://img.shields.io/npm/v/lab-teamcity-reporter.svg)](https://www.npmjs.com/package/lab-teamcity-reporter)
[![Build status](https://img.shields.io/travis/antipin/lab-teamcity-reporter/master.svg)](https://travis-ci.org/antipin/lab-teamcity-reporter)
[![David](https://img.shields.io/david/antipin/lab-teamcity-reporter.svg)]()
[![David](https://img.shields.io/david/dev/antipin/lab-teamcity-reporter.svg)]()

[lab](https://github.com/hapijs/lab) and [TeamCity](https://www.jetbrains.com/teamcity/) are [hapi](https://github.com/hapijs/hapi) together.

![lab and TeamCity](http://antip.in/f/lab_plus_teamcity.png)

## Install

```npm install --save-dev lab-teamcity-reporter```

## Usage

```lab --reporter lab-teamcity-reporter```

## Output example

### Build log

![Build log](http://antip.in/f/lvmh6.png)

### Build overview

![Build overview](http://antip.in/f/b01l2.png)

## Caveats

If your lab test runner fails with error ```Error: Cannot find module 'lab-teamcity-reporter'``` you can try to use full path to the reporter:

```lab --reporter ./node_modules/lab-teamcity-reporter/src/teamcity.js```
