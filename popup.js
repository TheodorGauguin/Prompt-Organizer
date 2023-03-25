// Save button event listener
document.getElementById('save-button').addEventListener('click', () => {
  const promptInput = document.getElementById('prompt-input').value;
  const folderInput = document.getElementById('folder-input').value;
  if (promptInput && folderInput) {
    chrome.storage.sync.get(folderInput, (result) => {
      const prompts = result[folderInput] || [];
      prompts.push(promptInput);
      chrome.storage.sync.set({ [folderInput]: prompts }, () => {
        loadFolders();
      });
    });
  }
});

// Load folders
function loadFolders() {
  chrome.storage.sync.get(null, (folders) => {
    const folderSelect = document.getElementById('folder-select');
    folderSelect.innerHTML = '';
    for (const folder in folders) {
      const option = document.createElement('option');
      option.value = folder;
      option.innerText = folder;
      folderSelect.appendChild(option);
    }
    loadFolderContent();
  });
}

// Load prompts when folder is selected
document.getElementById('folder-select').addEventListener('change', (e) => {
  loadFolderContent();
});

function loadFolderContent() {
  let folderSelect = document.getElementById('folder-select');
  const folder = folderSelect.value;
  chrome.storage.sync.get(folder, (result) => {
    const promptList = document.getElementById('prompt-list');
    promptList.innerHTML = '';
    const prompts = result[folder] || [];
    prompts.forEach((prompt) => {
      const li = document.createElement('li');

      const wrapper = document.createElement('div');
      wrapper.innerText = prompt;
      wrapper.classList.add('tooltip');
      li.appendChild(wrapper);

      // Add tooltip element
      const tooltip = document.createElement('span');
      tooltip.classList.add('tooltiptext');
      tooltip.innerText = 'Copied!';
      wrapper.appendChild(tooltip);

      li.addEventListener('click', () => {
        insertTextToInput(prompt);
      });
      
      promptList.appendChild(li);
    });
  });
}

// Delete all button event listener
document.getElementById('delete-all-button').addEventListener('click', () => {
  chrome.storage.sync.clear(() => {
    loadFolders();
    document.getElementById('prompt-list').innerHTML = '';
  });
});

function getActiveElementDetails(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'getActiveElementDetails' }, (response) => {
      callback(response);
    });
  });
}

function insertTextToInput(text, activeElementInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'insertText', text: text, ...activeElementInfo });
  });
}

// Call getActiveElementDetails when the popup is opened
getActiveElementDetails((activeElementInfo) => {
  // Update the click event listener in the loadFolderContent function to use the new insertTextToInput function with activeElementInfo
  const liElements = document.querySelectorAll('#prompt-list li');
  liElements.forEach((li) => {
    li.addEventListener('click', () => {
      insertTextToInput(li.textContent, activeElementInfo);
    });
  });
});

// Initialize folders
loadFolders();

