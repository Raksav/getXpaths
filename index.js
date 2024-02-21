/*
@author: raksav86@gmail.com
*/
const { chromium } = require('../playwright');
// import { chromium } from 'playwright';
async function findXpaths () {
    // Setup
    const browser = await chromium.launch({headless:false});
    const context = await browser.newContext();
    const page = await context.newPage();


    await page.goto('https://www.google.com');
    // Define the JavaScript function
    const jsFunction = `
    var xpathsLogged = false;
    document.querySelectorAll('*').forEach(function(node) {
        node.addEventListener('mouseover', function(e) {
            this.style.outline = '3px solid orange';
            e.stopPropagation();
        });
        node.addEventListener('mouseout', function(e) {
            this.style.outline = '';
            e.stopPropagation();
        });
        node.addEventListener('contextmenu', function(e) {
            if (!xpathsLogged) {
                var xpaths = getXPath(this);
                console.log(xpaths);
                xpathsLogged = true;
            }
            e.preventDefault(); // Prevent the context menu from opening
            e.stopPropagation();
        });
    });

    function getXPath(element) {
        var attributes = ['innerText','id', 'name', 'class', 'href', 'placeholder', 'role', 'title','value', 'type'];
        var tagnames = ['input', 'label', 'select', 'combobox', 'tr', 'td', 'th', 'iframe', 'table'];
        var xpaths = [];
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            var attrValue;
            if (attr === 'innerText') {

                try{
                    attrValue = element.innerText;
                    attrValue = attrValue.trim();
                }catch(err){}

                if (attrValue) {

                    if (tagnames.includes(element.tagName.toLowerCase())) {
                        var xp = "//" + element.tagName.toLowerCase() + "[text()='" + attrValue + "']";
                    }else{
                        var xp = "//*[text()='" + attrValue + "']";
                    }

                    if (isXPathUnique(xp,element)) {
                        xpaths.push(xp);
                    }else{
                        xpaths.push(makeXPathUnique(xp,element));
                    }

                }else{

                    try{
                        attrValue = element.innerText;
                        attrValue = attrValue.trim();
                    }catch(err){}

                    if (attrValue) {

                        if (tagnames.includes(element.tagName.toLowerCase())) {
                            var xp = "//" + element.tagName.toLowerCase() + "[text()='" + attrValue + "']";
                        }else{
                            var xp = "//*[text()='" + attrValue + "']";
                        }

                        if (isXPathUnique(xp,element)) {
                            xpaths.push(xp);
                        }else{
                            xpaths.push(makeXPathUnique(xp,element));
                        }

                    }
                }

            } else {
                attrValue = element.getAttribute(attr);
                if (attrValue) {

                    if (tagnames.includes(element.tagName.toLowerCase())) {
                        var xp = "//" + element.tagName.toLowerCase() + "[@" + attr + "='" + attrValue + "']";
                    }else{
                        var xp = "//*[@" + attr + "='" + attrValue + "']";
                    }

                    if (isXPathUnique(xp,element)) {
                        xpaths.push(xp);
                    }else{
                        xpaths.push(makeXPathUnique(xp,element));
                    }

                    var alphaParts = getSubstringBetweenNumbers(attrValue);
                    if(alphaParts != null){
                        if (alphaParts.length > 0) {
                            
                            if (tagnames.includes(element.tagName.toLowerCase())) {
                                var xp = "//" + element.tagName.toLowerCase() + "[contains(@" + attr + ", '" + alphaParts + "')]";
                            }else{
                                var xp = "//*[contains(@" + attr + ", '" + alphaParts + "')]";
                            }

                            if (isXPathUnique(xp,element)) {
                                xpaths.push(xp);
                            }else{
                                xpaths.push(makeXPathUnique(xp,element));
                            }
                        }
                    }
                }
            }
        }

        if (element === document.body) return [element.tagName];

        // var ix = 0;
        // var siblings = element.parentNode.childNodes;
        // for (var i = 0; i < siblings.length; i++) {
        //     var sibling = siblings[i];
        //     if (sibling === element) {
        //         xpaths.push(getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']');
        //     }
        //     if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
        // }
        return xpaths;
    }

    function getStaticPart(attrValue){
        try{
            var attrValueAlphabetsOnly = attrValue.replace(/\d+/g, ';#;');
            var splitValues = attrValueAlphabetsOnly.split(';#;');
            var alphaParts = splitValues.filter(part => /[a-zA-Z]/.test(part))[0].trim();
            return alphaParts;
        }catch(err){
            return null;
        }
    }

    function isXPathUnique(xpath, element) {
        try {
            var matchingElements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        } catch (error) {
            return false;
        }
        return matchingElements.snapshotLength === 1 && matchingElements.snapshotItem(0) === element;
    }

    function makeXPathUnique(xpath, element) {
        try {
            var matchingElements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < matchingElements.snapshotLength; i++) {
                if (matchingElements.snapshotItem(i) === element) {
                    var newXpath = "(" + xpath + ')[' + (i+1) + ']';
                    matchingElements = document.evaluate(newXpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (matchingElements.snapshotLength === 1 && matchingElements.snapshotItem(0) === element) {
                        return newXpath;
                    }
                }
            }
        } catch (error) {
            return null;  // Return null if the element is not found
        }
    }
    
    function getSubstringBetweenNumbers(str) {
        const parts = str.split(/\d+/);
        for(let i = 0; i < parts.length; i++) {
            if(parts[i].trim() !== '') {
                return parts[i];
            }
        }
        return '';
    }
    `;
  
    // Inject the JavaScript function into the webpage every second
    setInterval(async () => {
        // Get all open pages (tabs)
        const pages = await context.pages();
        const tabIndex = 1;
        if(tabIndex < pages.length){
            const newPage = pages[tabIndex];
            await context.addInitScript(jsFunction);
            await newPage.evaluate(jsFunction);
        }else{
            await context.addInitScript(jsFunction);
            await page.evaluate(jsFunction);
        }
    }, 1000); // 1000 milliseconds = 1 second


  // Teardown
//   await context.close();
//   await browser.close();
};
module.exports = { findXpaths: findXpaths };