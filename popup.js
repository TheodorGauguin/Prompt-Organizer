// Save button event listener
document.getElementById('save-button').addEventListener('click', () => {
  const promptInput = document.getElementById('prompt-input').value;
  const folderInput = document.getElementById('folder-input').value;
  if (promptInput && folderInput) {
    chrome.storage.sync.set({ [folderInput]: promptInput });
  }
});