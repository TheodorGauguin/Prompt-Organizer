function copyToClipboard(text, tooltip) {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  const successful = document.execCommand('copy');
  document.body.removeChild(el);

  // Show the tooltip
  if (successful) {
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    setTimeout(() => {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    }, 1500);
  }
}

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
        copyToClipboard(prompt, tooltip);
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

// Initialize folders
loadFolders();
