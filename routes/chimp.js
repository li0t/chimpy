var express = require('express');
var router = express.Router();
var MailChimpAPI = require('mailchimp').MailChimpAPI;

var apiKey = '8d56a3fcb63047a2712ac8980775370a-us10';
var listId = '5538be0180';
var api = false;

function connectToTheChimp() {
    try {
        api = new MailChimpAPI(apiKey, {
            version: '2.0'
        });
        console.log('api initialiced');
    } catch (error) {
        console.log(error.message);
    }
}
connectToTheChimp();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Chimps'
    });
});



/* Subscribe the Specialist to defined list */
router.post('/lists/:id/subscribe', function (req, res) {
    if (api) {
        api.call('lists', 'subscribe', {
            id: req.params.id, // Test list ID
            email: {
                email: req.body.email
            }
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/:id/subscribe',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/:id/subscribe',
                    data: 'User subscribed successfully! Look for the confirmation email \n' + data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

// Get a single member status at mailchimp
// Can be improoved to get an array of members status
router.get('/lists/:id/:email', function (req, res) {
    if (api) {
        api.call('lists', 'member-info', {
            id: req.params.id, // Test list ID
            emails: [
                {
                    email: req.params.email
                }
            ]
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/member-info/:email',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/member-info/:email',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

/* Create static segment */
router.get('/lists/static-segment-add/:name', function (req, res) {
    if (api) {
        api.call('lists', 'static-segment-add', {
            id: listId,
            name: req.param('name')
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/static-segment-add/:name',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/static-segment-add/:name',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

// Add members to static segment
// Members is an array of objects [{ email: 'mail@mail.com' }, ...]
router.get('/lists/static-segment-members-add/:segment/:members', function (req, res) {
    if (api) {
        api.call('lists', 'static-segment-members-add', {
            id: listId,
            seg_id: req.param('segment'), // static-segment temp01 id: 1233
            batch: req.param('members')
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/static-segment-members-add/:segment/:members',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/static-segment-members-add/:segment/:members',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

/* Create campaign with segment */
router.get('/campaigns/create/:segment', function (req, res) {
    if (api) {
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
                res.render('chimp', {
                    title: 'Chimping: [GET] campaigns/create/:segment',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] campaigns/create/:segment',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

/* Send a campaign */
router.get('/campaigns/send/:id', function (req, res) {

    if (api) {
        api.call('campaigns', 'send', {
            cid: req.param('id') // test campaign id: b723819aa2
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] campaigns/send/:id',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] campaigns/send/:id',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

// SOME HELPER FUNCTIONS

/* Show all lists */
router.get('/lists', function (req, res) {

    if (api) {
        api.call('lists', 'list', {
            start: 0,
            limit: 25
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] lists',
                    data: error.message
                });
            } else {
                res.render('lists', {
                    title: 'Chimping: [GET] lists',
                    lists: data.data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }

});

/* Show one list members */
router.get('/lists/:id', function (req, res) {

    if (api) {
        api.call('lists', 'list', {
            id: req.params.id
        }, function (error, list) {

            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] lists/:id',
                    data: error.message
                });
            } else {
                api.call('lists', 'members', {
                    id: req.params.id, // Test list ID
                }, function (error, members) {
                    if (error) {
                        res.render('chimp', {
                            title: 'Chimping: [GET] lists/:id',
                            data: error.message
                        });
                    } else {
                        res.render('members', {
                            title: 'Chimping: [GET] lists/:id',
                            list: list.data[0],
                            members: members.data
                        });
                    }
                });
            }
        });

    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }

});

/* Show all segments of a list */
router.get('/lists/segments/:list', function (req, res) {

    if (api) {
        api.call('lists', 'static-segments', {
            id: req.param('list')
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] list/segments/:list',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] list/segments/:list',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

/* Test a Segment */
router.get('/lists/campaigns/test/:segment', function (req, res) {

    if (api) {
        api.call('campaigns', 'segment-test', {
            list_id: listId,
            options: {
                saved_segment_id: req.param('segment')
            }
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] /lists/segments/test/:segment',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] /lists/segments/test/:segment',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

/* Show all Campaigns */
router.get('/campaigns/list', function (req, res) {

    if (api) {
        api.call('campaigns', 'list', {
            start: 0,
            limit: 25
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] campaigns/list',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] campaigns/list',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});

/* Campaign content by id */
router.get('/campaigns/content/:id', function (req, res) {
    if (api) {
        api.call('campaigns', 'content', {
            cid: req.param('id'),
            start: 0,
            limit: 25
        }, function (error, data) {
            if (error) {
                res.render('chimp', {
                    title: 'Chimping: [GET] campaigns/content/:id',
                    data: error.message
                });
            } else {
                data = JSON.stringify(data);
                res.render('chimp', {
                    title: 'Chimping: [GET] campaigns/content/:id',
                    data: data
                });
            }
        });
    } else {
        res.render('chimp', {
            title: 'Chimping',
            data: "Could not stablish connection with the Chimp master"
        });
    }
});


module.exports = router;