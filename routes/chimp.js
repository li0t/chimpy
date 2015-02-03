var express = require('express');
var router = express.Router();
var MailChimpAPI = require('mailchimp').MailChimpAPI;

var apiKey = '6a1ca96929b6de5e605fcb9881b73e98-us10';
var listId = 'f6e73f9e97';
var api = false;

function connectToTheChimp() {
    try { 
        api = new MailChimpAPI(apiKey, { version : '2.0' });
        console.log('api initialiced');
    } catch (error) {
        console.log(error.message);
    }
}
connectToTheChimp();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Chimps' });
});



/* Subscribe the Specialist to defined list */
router.get('/lists/subscribe/:email', function(req, res) {
    if(api) {
        api.call('lists', 'subscribe', { 
            id: listId, // Test list ID
            email: {
                email: req.param('email')
            }
        }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] lists/subscribe/:email', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] lists/subscribe/:email', data: data });
            }
        });
    }
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

// Get a single member status at mailchimp
// Can be improoved to get an array of members status
router.get('/lists/member-info/:email', function(req, res) {
    if(api) {
        api.call('lists', 'member-info', { 
            id: listId, // Test list ID
            emails: [
                {
                    email: req.param('email')
                }
            ]
        }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] lists/member-info/:email', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] lists/member-info/:email', data: data });
            }
        });
    }
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

/* Create static segment */
router.get('/lists/static-segment-add/:name', function(req, res) {
    if(api) {
        api.call('lists', 'static-segment-add', { id: listId, name: req.param('name') }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] lists/static-segment-add/:name', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] lists/static-segment-add/:name', data: data });
            }
        });
    }
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

// Add members to static segment
// Members is an array of objects [{ email: 'mail@mail.com' }, ...]
router.get('/lists/static-segment-members-add/:segment/:members', function(req, res) {
    if(api) {
        api.call('lists', 'static-segment-members-add', { 
            id: listId, 
            seg_id: req.param('segment'), // static-segment temp01 id: 1233
            batch: req.param('members')
        }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] lists/static-segment-members-add/:segment/:members', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] lists/static-segment-members-add/:segment/:members', data: data });
            }
        });
    }
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

/* Create campaign with segment */
router.get('/campaigns/create/:segment', function(req, res) {
    if(api) {
        api.call('campaigns', 'create', { 
            type: 'regular',
            options: {
                list_id: listId,
                subject: 'Node.js Integration Tests',
                from_email: 'jtguzman@final.cl',
                from_name: 'Final Test Mailer'
            },
            content: {
                // html: HTML Object,
                text: 'Well hello there.'
            },
            segment_opts: {
                list_id: listId,
                saved_segment_id: req.param('segment') // static-segment temp01 id: 1233
            }
        }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] campaigns/create/:segment', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] campaigns/create/:segment', data: data });
            }
        });
    }
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

/* Send a campaign */
router.get('/campaigns/send/:id', function(req, res) {

    if(api) {
        api.call('campaigns', 'send', { 
            cid: req.param('id') // test campaign id: b723819aa2
        }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] campaigns/send/:id', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] campaigns/send/:id', data: data });
            }
        });
    }
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

// SOME HELPER FUNCTIONS

/* Show all lists */
router.get('/lists/view', function(req, res) {

    if(api) {
        api.call('lists', 'list', { start: 0, limit: 25 }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] list/view', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] list/view', data: data });
            }
        });
    }
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });

});

/* Show all segments of a list */
router.get('/lists/segments/:list', function(req, res) {

    if(api) {
        api.call('lists', 'static-segments', { id: req.param('list') }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] list/segments/:list', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] list/segments/:list', data: data });
            }
        });
    } 
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

/* Test a Segment */
router.get('/lists/campaigns/test/:segment', function(req, res) {

    if(api) {
        api.call('campaigns', 'segment-test', { 
            list_id: listId,
            options: {
                saved_segment_id: req.param('segment')
            }
        }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] /lists/segments/test/:segment', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] /lists/segments/test/:segment', data: data });
            }
        });
    } 
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

/* Show all Campaigns */
router.get('/campaigns/list', function(req, res) {

    if(api) {
        api.call('campaigns', 'list', { start: 0, limit: 25 }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] campaigns/list', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] campaigns/list', data: data });
            }
        });
    } 
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});

/* Campaign content by id */
router.get('/campaigns/content/:id', function(req, res) {
    if(api) {
        api.call('campaigns', 'content', { cid: req.param('id'), start: 0, limit: 25 }, function (error, data) {
            if (error) {
                res.render('chimp', { title: 'Chimping: [GET] campaigns/content/:id', data: error.message });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', { title: 'Chimping: [GET] campaigns/content/:id', data: data });
            }
        });
    }
    res.render('chimp', { title: 'Chimping', data: "Could not stablish connection with the Chimp master" });
});


module.exports = router;
