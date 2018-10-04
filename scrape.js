const _ = require('lodash'),
    Promise = require('bluebird'),
    cheerio = require('cheerio'),
    request = require('request'),
    winston = require('winston');
    httpntlm = require('httpntlm');
    config = require('./config');

winston.level = 'debug';

module.exports = {
    scrapeEvents: function() {
        return getEvents()
            .then((urls) => {
                 return Promise.map(urls,
                    (url) => getAttendees(url)
                        .then((attendees) => {
                            winston.debug('Attendees: %s', attendees.names);

                            return attendees;
                        })
                        .catch(() => {
                            winston.debug('Cannot retrieve %s', url);
                        })
                        , {concurrency: 1})
                    });
            }
    };

    /**
     * Get the urls of all the events
     * @param url Home page
     * @returns {promise}
     */
    function getEvents(url) {
        return new Promise((resolve, reject) => {
            httpntlm.get({
                url: config.url,
                username: config.username,
                password: config.password,
                domain: config.domain
            }, function (err, response){

                if(err) return err;

                var html = response.body;
                var $ = cheerio.load(html);

                $('table tr').eq(0).remove();
                $('table tr').eq(0).remove();
                $('table tr').eq(-1).remove();

                const urls = [];

                $('table tr').each( function(i, elem) {
                    $(this).find('td').first().find('CodeBlock').remove(); 
                    const name =  $(this).find('td').first().text().trim().replace(/\s\s+/g, ',');
                    const date = $(this).find('td').eq(1).text().trim();
                    const attended = $(this).find('td').eq(4).find('a').text().trim();
                    const url_short = $(this).find('td').eq(5).find('a').eq(1).attr('href');
                    const url = 'https://masonweb.wm.edu' + url_short;
                    urls.push(url);
                });

                resolve(urls);
            });
        });
    }

    /**
     * Get the event page and extract the details
     * @param url URL of the event
     * @returns {promise}
     */
    function getAttendees(url) {
        return new Promise((resolve, reject) => {

            httpntlm.get({
                url: url,
                username: config.username,
                password: config.password,
                domain: config.domain
            }, function (err, response){

                if(err) return err;

                var html = response.body;
                var $ = cheerio.load(html);

                $('table tr').eq(0).remove();
                $('table tr').eq(0).remove();
              
                const event_name = $('h2 i').text();
                const date = $('table tr').find('td').eq(6).text().trim();

                const names = [];
                const emails = [];
                $('table tr').each(function(i, elem) {
                    var student_id = $(this).find('td').eq(2).text().trim().replace(/\s\s+/g, ',');
                    var email = $(this).find('td').eq(4).text().trim().replace(/\s\s+/g, ',');
                    if (student_id.startsWith('930')){
                        names.push(student_id);
                    }
                    if (email != ""){
                        emails.push(email);
                    }
                }); 
                const attend_count = names.length;

                resolve({names,emails,event_name,date});
            });
        });
    }




