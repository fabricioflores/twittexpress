# twittexpress

[![Build Status](https://travis-ci.org/patovala/twittexpress.svg?branch=master)](https://travis-ci.org/patovala/twittexpress)

Twitter client with Express.JS and Angular.JS generated with [Generator Angular Fullstack](https://github.com/DaftMonk/generator-angular-fullstack)

- We changed the poll service in favor to websockets

### Development

- Fork it
- Work in your repo
- Rebase with patovala repo master
- Create the pull request. Make sure your branch is rebased and travis is passing.

### Rebase with patovala repo master

- Add remote patovala's repo ( you need to add the remote one)
`git remote add upstream https://github.com/patovala/twittexpress.git`
- Fetch all the branches of that remote into remote-tracking branches
`git fetch upstream`
- Rebase your branch against patovala's branch
`git rebase upstream/master`

### Add new route to server
- yo angular-fullstack:endpoint pbshow
