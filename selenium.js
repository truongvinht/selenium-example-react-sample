const UserProfile = require('./src/page/userProfile');
require("chromedriver");

const WEBSITE = process.env.URL;

const test = new UserProfile(WEBSITE);
//test.checkTitleIn('chrome');
test.createEntry('chrome');
