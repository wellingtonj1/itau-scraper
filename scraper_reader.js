const fs = require('fs').promises;
const path = require('path');
const helper = require('./helper.js');

/**
 * Function to read json stored in a TXT file
 * @returns {Promise}
 */
async function read(pathName) {

    var dataPath = path.resolve('./scraper_files')+"/"+pathName+'.txt';
    var accData = null;

    return (async() =>  {

        try {
            
            var data = await fs.readFile(dataPath, 'utf8');
            
            if (data) {
            
                accData = JSON.parse(data);
                var totalBalance = 0.0;
                var balanceAllowed = 0.0;
    
                accData.forEach(element => {
                    var balance = helper.stringToFloat(element.saldo);
                    var aBalance = helper.stringToFloat(element.saldo_disponivel);
    
                    totalBalance += balance;
                    balanceAllowed += aBalance;
                    
                });
    
                totalBalance = parseFloat(totalBalance).toFixed(2);
                balanceAllowed = parseFloat(balanceAllowed).toFixed(2);
    
                totalBalance = helper.number_format(totalBalance, 2, ',', '.');
                balanceAllowed = helper.number_format(balanceAllowed, 2, ',', '.');
    
                accData['total_balance'] = totalBalance;
                accData['balance_allowed'] = balanceAllowed;
                accData['op'] = pathName;
            }
            
            return accData;
            
        } catch(e) {
            console.error(e);
        }
    })();

}

async function getFiles() {
    
    var dir = path.resolve('./scraper_files');
    var validArq = [];

    return (async() =>  {
            
        var arquivos = await fs.readdir(dir);

        arquivos.forEach(arq => {
            if (arq.search('.txt') > 0) {
                validArq.push(arq);
            }
        });

        return validArq;
    
    })();

}

module.exports = { read, getFiles };