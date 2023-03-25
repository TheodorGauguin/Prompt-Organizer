chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'storeActiveElementDetails') {
    chrome.tabs.executeScript(
      {
        code: `
          (function() {
            const el = document.activeElement;
            const details = {
              id: el.id,
              name: el.name,
              tagName: el.tagName,
              selectionStart: el.selectionStart,
              selectionEnd: el.selectionEnd
            };
            details;
          })();`
      },
      (results) => {
        sendResponse(results[0]);
      }
    );
    return true;
  } else if (request.type === 'insertText') {
    const { id, name, tagName, text, selectionStart, selectionEnd } = request;
    chrome.tabs.executeScript({
      code: `
        (function() {
          const id = ${JSON.stringify(id)};
          const name = ${JSON.stringify(name)};
          const tagName = ${JSON.stringify(tagName)};
          const text = ${JSON.stringify(text)};
          const selectionStart = ${JSON.stringify(selectionStart)};
          const selectionEnd = ${JSON.stringify(selectionEnd)};

          let element = null;
          if (id) {
            element = document.getElementById(id);
          } else if (name) {
            element = document.querySelector(\`\${tagName}[name="\${name}"]\`);
          }

          if (element) {
            const value = element.value;
            element.value = value.substring(0, selectionStart) + text + value.substring(selectionEnd);
            element.selectionStart = element.selectionEnd = selectionStart + text.length;
          }
        })();`
    });
  }
});
