var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var mkdirp = require('mkdirp');
var moment = require('moment-timezone');
var nopt = require('nopt');
var request = require('request');

var baseUrl = 'https://api.meetup.com/';
var eventAttendancePathTemplate = '/:urlname/events/:id/attendance?key=:key';
var pastEventsPathTemplate = '/:urlname/events?status=past';

var key = process.env.KEY;
var urlname = 'ember-montevideo';
var templateFile = path.join(__dirname, 'README.md.template');
var tz = 'America/Montevideo';
var locale = 'es';

function pastEventsUrlFor(urlname) {
  return pastEventsPathTemplate
    .replace(':urlname', urlname);
}

function eventAttendanceUrlFor(urlname, id, key) {
  return eventAttendancePathTemplate
    .replace(':urlname', urlname)
    .replace(':id', id)
    .replace(':key', key);
}

function optionsFor(uri) {
  return {
    baseUrl: baseUrl,
    json: true,
    uri: uri,
  };
}

function formatError(error) {
  return error.code + ': ' + error.message;
}

function errorFrom(data) {
  let message = data.errors
    .map(formatError)
    .join(', ');
  return new Error(message);
}

function callbackFor(callback) {
  return function(error, response, data) {
    if (error) throw error;
    if (data.errors) throw errorFrom(data);
    callback(data);
  };
}

function requestFor(uri, callback) {
  request(optionsFor(uri), callbackFor(callback));
}

function pastEventsFor(urlname, callback) {
  requestFor(pastEventsUrlFor(urlname), callback);
}

function eventAttendanceFor(urlname, id, key, callback) {
  requestFor(eventAttendanceUrlFor(urlname, id, key), callback);
}

function nameFrom(event) {
  if (event.name === 'Meetup mensual') {
    let name = _.capitalize(
        moment.tz(event.time, tz).format('MMMM Y'));
    return name;
  }
  return event.name;
}

function formatAttendeeItem(attendee) {
  return '* ' + attendee.member.name;
}

function attendeeListFrom(attendees) {
  return attendees
    .map(formatAttendeeItem)
    .sort()
    .join("\n");
}

function valuesFrom(event, attendees) {
  return {
    name: nameFrom(event),
    date: moment.tz(event.time, tz).format('D [de] MMMM [de] Y'),
    from: moment.tz(event.time, tz).format('H:mm'),
    to: moment.tz(event.time + event.duration, tz).format('H:mm'),
    attendees: attendeeListFrom(attendees),
    count: attendees.length,
    venue: event.venue.name,
  };
}

function pathFor(t) {
  return path.join(t.format('YYYY-MM'), 'README.md');
}

function writeFile(t, content) {
  var p = pathFor(t);
  var dirname = path.dirname(p);
  console.error(p);
  mkdirp.sync(dirname);
  fs.writeFileSync(p, content);
}

var knownOpts = {
  'month': String,
  'write': Boolean,
};
var shortHands = {
  'm': '--month',
  'w': '--write',
};
var parsed = nopt(knownOpts, shortHands);
var template = _.template(fs.readFileSync(templateFile));
var m = moment.tz(tz);

if (parsed.month) {
  m = moment.tz(parsed.month, 'YYYY-MM', tz);
}
moment.locale(locale);

pastEventsFor(urlname, function(events) {
  events.forEach(function(event) {
    var t = moment.tz(event.time, tz);
    if (!t.isSame(m, 'month')) {
      return;
    }
    eventAttendanceFor(urlname, event.id, key, function(attendees) {
      var values = valuesFrom(event, attendees, tz);
      var content = template(values);
      if (parsed.write) {
        writeFile(t, content);
      } else {
        process.stdout.write(content);
      }
    });
  });
});
