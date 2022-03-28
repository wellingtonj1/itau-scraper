const express = require('express');
const router = express.Router();
const moment = require('moment');
const scraperItau = require('../scraper_itau.js');
const scraperReader = require('../scraper_reader.js');
const scraperBalance = require('../balance_scraper.js');
const cardScraper = require('../card_scraper.js');

router.get('/', (req, res) => {
    res.render('home/index');
});

router.get('/scraper-balance-form', (req, res) => {
    res.render('balance/form');
});

router.get('/scraper-form', (req, res) => {
    res.render('scraper/form');
});

router.get('/card-form', (req, res) => {
    res.render('card/form');
});

router.get('/scraper-data', (req, res) => {

    var reqData = req.body.data;
    var accOp = req.query.op;
    var codes = [];

    scraperReader.getFiles().then(files => {
        files.forEach(fileName => {
            var name = fileName.replace(".txt", "");
            codes.push(name);
        });
    });

    if(reqData && reqData.length > 0) {
        console.log("AQI"+reqData);
        reqData = scraperBalance.procBalanceData(reqData);
        res.render('scraper/data', { data: reqData, codes: codes });

    } else if (accOp) {
        
        scraperReader.read(accOp).then(data => {
            res.render('scraper/data', { data: data, codes: codes });
        });

    } else {
        res.render('scraper/data', { data: null, codes: codes });
    }
    
});

router.post('/scraper-balance', (req, res) => {

    var account = req.body.account;
    var password = req.body.password;
    
    scraperBalance.scraper(account, password).then(data => {
        // res.render('/scraper-data?op='+account, {data: data});
        res.redirect('/scraper-data?op=OP'+account);
    }).catch(err => {
        res.send(err);
    });

});

router.post('/card-scraper', (req, res) => {

    var account = req.body.account;
    var password = req.body.password;
    
    cardScraper.scraper(account, password).then(data => {
        // res.render('/scraper-data?op='+account, {data: data});
        res.redirect('/scraper-data?op=OP'+account);
    }).catch(err => {
        res.send(err);
    });

});

router.post('/scraper', (req, res) => {

    var initDate = req.body.initialDate;
    var endDate = req.body.finalDate;
    var account = req.body.account;
    var password = req.body.password;
    
    if (moment(initDate, 'DD-MM-YYYY').isValid()){
        initDate = moment(initDate, 'DD-MM-YYYY');
    } 
    
    if (moment(endDate, 'DD-MM-YYYY').isValid()){
        endDate = moment(endDate, 'DD-MM-YYYY');
    }

    scraperItau.scraper(initDate.format('DD-MM-YYYY'), endDate.format('DD-MM-YYYY'), account, password).then(data => {
        // res.render('/scraper-data?op='+account, {data: data});
        res.redirect('/scraper-data?op=OP'+account);
    }).catch(err => {
        res.send(err);
    });

});

module.exports = router;