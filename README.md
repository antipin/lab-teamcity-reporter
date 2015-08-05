# Lab TeamCity reporter

[Lab](https://github.com/hapijs/lab) reporter for [TeamCity](https://www.jetbrains.com/teamcity/)

## Install

```npm install --save-dev lab-teamcity-reporter```

## Usage

```lab --reporter lab-teamcity-reporter```

## Output example

![Output example](http://antip.in/f/ycan6.png)

##Caveats

If your lab test runner fails with error ```Error: Cannot find module 'lab-teamcity-reporter'``` you can try to use full path to the reporter:

```lab --reporter ./node_modules/lab-teamcity-reporter/src/teamcity.js```