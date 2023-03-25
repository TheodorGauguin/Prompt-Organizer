chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getActiveElementDetails') {
    const el = document.activeElement;
    const details = {
      id: el.id,
      name: el.name,
      tagName: el.tagName,
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd
    };
    sendResponse(details);
  } else if (request.type === 'insertText') {
    const { id, name, tagName, text, selectionStart, selectionEnd } = request;
    let element = null;
    if (id) {
      element = document.getElementById(id);
    } else if (name) {
      element = document.querySelector(`${tagName}[name="${name}"]`);
    }

    if (element) {
      const value = element.value;
      element.value = value.substring(0, selectionStart) + text + value.substring(selectionEnd);
      element.selectionStart = element.selectionEnd = selectionStart + text.length;
    }
  }
});
