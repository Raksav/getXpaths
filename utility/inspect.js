/*
@author: raksav86@gmail.com
*/
// const { chromium } = require('playwright');
import { chromium } from 'playwright';
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
        var attributes = ['innerText','id', 'name', 'class', 'href', 'placeholder', 'role', 'title','value'];
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
                    xpaths.push("//" + element.tagName + "[text()='" + attrValue + "']");
                }else{
                    try{
                        attrValue = element.innerText;
                        attrValue = attrValue.trim();
                    }catch(err){}

                    if (attrValue) {
                        xpaths.push("//" + element.tagName + "[text()='" + attrValue + "']");
                    }
                }

            } else {
                attrValue = element.getAttribute(attr);
                if (attrValue) {
                    xpaths.push("//" + element.tagName + "[@" + attr + "='" + attrValue + "']");
                    var alphaParts = getStaticPart(attrValue);
                    if(alphaParts != null){
                        if (alphaParts.length > 0) {
                            xpaths.push("//" + element.tagName + "[contains(@" + attr + ", '" + alphaParts + "')]");
                        }
                    }
                }
            }
        }

        if (element === document.body) return [element.tagName];

        var ix = 0;
        var siblings = element.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            if (sibling === element) {
                xpaths.push(getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']');
            }
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
        }
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
module.exports = findXpaths;