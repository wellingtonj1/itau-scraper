'use strict';

const moment = require('moment');
const puppeteer = require('puppeteer');
const path = require('path');
const downloadPath = path.resolve('./scraper_files');
const fs = require('fs');
var accData = [];
var retryTimes = 5; 
const helper = require('./helper.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Realiza Scrapping dos saldos das contas do operador informado
 * @param {*} coOp 
 * @param {*} password 
 * @returns 
 */
async function scraper(user, password) {

    var user = "";
    var password = "";

    const browser = await puppeteer.launch({
        headless: false,
    });

    try {
        //newPage() instância uma nova 'aba' no nosso browser
        const page = await browser.newPage();
        
        //É preciso definir um UserAgent e um Viewport para que o browser sempre abrar em modo desktop e não no modo mobile
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        await page.setViewport({
            width: 1366,
            height: 768
        });

        /*********Primeira Tela **************************************** */
        console.log("Atualizando cartões... Acessando https://meu.userede.com.br/login'...");
        await page.goto('https://meu.userede.com.br/login');

        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath 
        });

        /* o comando waitForSelector é usado para
            para aguardar até o elemento estar disponível
            na DOM.
            A syntax para os seletores segue o padrão HTML DOM querySelectors
            Você pode ver mais exemplos aqui: https://www.w3schools.com/jsref/met_document_queryselector.asp
        */
        await page.waitForSelector("input[name='user']");
        console.log("Página Carregada!")

        // insere nome de usuário e senha
        await page.click("input[name='user']");
        await page.type("input[name='user']", user);

        await page.click("input[name='password']");
        await page.type("input[name='password']", password);
        
        await page.click("button#btn-login");
        await page.waitForTimeout(7000);
        
        await page.click("joyride-step a.rede-xlink");
        
        console.log("Logado!");

        await page.waitForTimeout(1500);
        
        await page.click("a#menu-vendas");

        console.log("clicou em menu vendas!");
        
        await page.waitForTimeout(5000);
        await page.click("a#menu-relatório-de-vendas");
        
        console.log("clicou em relatório de vendas!");

        await page.waitForTimeout(3000);

        await page.click("joyride-step a.rede-xlink");

        console.log("Clicou em fechar o outro anuncio.");

        // await page.waitForTimeout(5000);

        // await page.click("span#btnFecharTutorial");

        // console.log("Clicou em fechar tutorial");
        
        await page.waitForTimeout(1000);
        
        await page.click(".sales-daily-filter .arrow");
        
        console.log("Clicou no arrow de datas");

        await page.waitForTimeout(1000);
        //*[@id="lastDatePicker"]//div/div[2]/div[2]
        var teste = ( await page.$$('#lastDatePicker tbody tr')).length; 
        
        console.log(teste);
        // .$$('span range-datepicker-cell').shadowRoot.querySelector('.mright'));
        var qtdEmpresas = (await page.$$('#tabela-contas-disponiveis tbody tr')).length;
    //     await page.click('#collapseTypeAccess li[data-select-form="codigo-operador"]');

    //     console.log("Inseriu o código");

    //     const btnLoginSubmit = '#btnLoginSubmit';
    //     await page.waitForSelector(btnLoginSubmit);

    //     console.log("Acessando tela de senha...");

    //     //Use o método click() para efetuar o click no botão
    //     await page.click(btnLoginSubmit);

    //     /*********Segunda Tela **************************************** */

    //     // Insira aqui sua senha em formato de array
    //     const senha = password.split("");

    //     const elementTeclas = ".teclas a"

    //     /* Aqui o waitForSelector recebe o seletor '.teclas a'
    //     * isso é feito para aguardar a renderização do teclado
    //     * númerico
    //     */
    //     await page.waitForSelector(elementTeclas);
    //     console.log("Área de senha Carregada!")


    //     /* Aqui usamos método evaluate para executar um script no contexto da página em execução, 
    //     * pois precisamos encontrar uma forma de ler todos os botões do teclado e estrutra de uma forma que possamos
    //     * clicar em cada botão do teclado como se fosse um ser humano.
    //     * O método evaluate recebe dois parâmetros, o primeiro uma função e segundo
    //     * um seletor. A função do parâmetro recebe o seletor como parãmetro
    //     */
    //     const teclas = await page.evaluate(data => {
    //         // colocamos o elemento com todos os botões em buttons, convertido em Array
    //         const buttons = Array.from(document.querySelectorAll(data));
    //         // retornamos um map() para percorrer cada tecla capturada e retornamos no map um padrão
    //         return buttons.map(tecla => {
    //             // em tecla.textContent estão os números. Ex 2 ou 5
    //             // em tecla.rel está uma forma da gente saber em qual tecla clicar. Ex. tecla_A
    //             const teclaPattern = tecla.textContent + " = " + tecla.rel;
    //             return teclaPattern;
    //         });
    //     }, elementTeclas);

    //     // console.log("Traduziu teclas: " + teclas);
        
    //     //Aqui usamos o waitFor para aguardar o teclado ficar totalmente renderizado para poder clicar nos botões
    //     await page.waitForTimeout(4000);
    //     console.log("Inserindo a senha...");
        
    //     /* Aqui a mágina acontece
    //     * percorremos cada dígito da nossa senha, e procuramos no array que lêmos anteriormente das teclas.
    //     * Ao encontrar a tecla, através do seletor '[rel=\"${teclaSelector}\"]' realizamos o click.
    //     * Usamos um setTimeout para não travar o teclado virtual do Itaú.
    // */
    //     let teclaSelector = "";
    //     let time = 900;
    //     await senha.map((digito, index) => {
    //         setTimeout(async () => {

    //             teclaSelector = teclas.filter((el) => {
    //                 return el.includes(digito);
    //             })[0].split('= ')[1];

    //             // console.log("Digitou " + teclaSelector)
    //             await page.click(`[rel=\"${teclaSelector}\"]`)

    //         }, time * index)
    //     })

    //     // await para esperar terminar de digitar o teclado 
    //     await page.waitForTimeout(5000);
    //     console.log("Acessando...");
    //     //Click no botão Acessar
    //     page.click("#acessar"); 

    //     console.log('Seleciona token básico');
    //     await page.waitForTimeout(9000);
    //     await page.waitForSelector('#tipoVisao');
    //     await page.click('#rdBasico');
    //     await page.click('#rdBasico');

    //     console.log('Clica em continuar');
    //     await page.waitForTimeout(3000);
    //     await page.waitForSelector('#btn-continuar');
    //     await page.click('#btn-continuar');

    //     await page.waitForTimeout(10000);
    //     await page.click('.perfil-usuario-ni');
        
    //     await page.waitForTimeout(3000);

    //     var qtdEmpresas = (await page.$$('#tabela-contas-disponiveis tbody tr')).length;

    //     const accScraping = async (index) => {

    //         try {

    //             for (; index < qtdEmpresas+1; index++) { 

    //                 await page.waitForTimeout(1000);
    //                 await page.click('#tabela-contas-disponiveis tbody tr:nth-child('+ (index) +')');
    //                 var accName = await page.$eval('#tabela-contas-disponiveis tbody tr:nth-child('+ (index) +') td:nth-child(2)', el => el.textContent);
    //                 var accAgency = await page.$eval('#tabela-contas-disponiveis tbody tr:nth-child('+ (index) +') td:nth-child(3)', el => el.textContent);
    //                 var accNumber = await page.$eval('#tabela-contas-disponiveis tbody tr:nth-child('+ (index) +') td:nth-child(4)', el => el.textContent);
    //                 var accCnpj = await page.$eval('#tabela-contas-disponiveis tbody tr:nth-child('+ (index) +') td:nth-child(5)', el => el.textContent);
    //                 await page.waitForTimeout(5000);
    //                 await page.waitForSelector('button[target="ultimos-lancamentos"]');
    //                 await page.click('button[target="ultimos-lancamentos"]');
                    
    //                 await page.waitForTimeout(3000);

    //                 var accValue = await page.$eval('.left.margem-esquerda10.margem-cima40 p:nth-child(2)', el => el.textContent);
    //                 var accAvailabledValue = await page.$eval('.left.margem-esquerda10.margem-cima40 p:nth-child(4)', el => el.textContent);
                    
    //                 accValue = accValue.replace(/(\r\n|\n|\t|\r)/gm,"");
    //                 accAvailabledValue = accAvailabledValue.replace(/(\r\n|\n|\t|\r)/gm,"");

    //                 var nowTime = moment().format('DD/MM/YYYY HH:mm:ss');
                    
    //                 var text = {
    //                     "conta": accNumber.trim(), 
    //                     "agencia": accAgency.trim(), 
    //                     "cpnj":accCnpj.trim(),
    //                     "nome":accName.trim(),
    //                     "saldo":accValue.trim(), 
    //                     "saldo_disponivel":accAvailabledValue.trim(),
    //                     "hora_atualizacao": nowTime
    //                 };
                    
    //                 accData.push(text);

    //                 console.log(accData[index-1]);
    //                 console.log("-------------------------------------------------------");
                    
    //                 // ENTRA EM OUTRA CONTA
    //                 await page.click('.perfil-usuario-ni');
                
    //             }

    //             console.log('Scrap do saldo Concluido.');

    //         } catch (error) {
                
    //             if(retryTimes > 0){
    //                 retryTimes--;
    //                 await page.click('.perfil-usuario-ni');
    //                 console.error(error + '\n Voltando no index = ' + index);
    //                 accScraping(index);
    //             } else {
    //                 console.error(error + '\n Mesmo após repetir ' + retryTimes + '. Não foi possivel continuar.');
    //             }

    //         }
            
    //     };

    //     await accScraping(1);
        
    //     /*
    //         Fim da execução.
    //         Você pode continuar daqui pra frente
    //     */
    //     console.log("acesso efetuado com sucesso!");
    //     console.log("fim");
    //     // await browser.close();
    //     // return accData;

    // try {

    //     if(accData && accData.length > 0){

    //         fs.writeFile(downloadPath+"/OP"+coOp+".txt", JSON.stringify(accData), function(erro) {

    //             if(erro) {
    //                 throw erro;
    //             }
            
    //             console.log("Arquivo salvo");
    //         });

    //         saveCsv(accData, coOp);

    //     }

    //     console.log("Fim da execução");
    
    // } catch (error) {

    //     console.log(error);
    //     console.log("Erro ao salvar os arquivos de texto!");
    // }

    // return JSON.stringify(accData);

    } catch (error) {
        // Caso haja algum erro o programa é reiniciado para realizar uma nova tentativa
        console.log(error);
        console.log("Erro ao acessar o site. Verifique se os dados de acesso estão corretos!");
        // await browser.close();
        return 'Erro ao acessar o site. Verifique se os dados de acesso estão corretos!';
    }

    return 'Ok';

};

module.exports = {scraper};