chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Translator extension installed');
  
  chrome.storage.sync.set({
    model: 'glm-4.5'
  });
  
  chrome.contextMenus.create({
    id: 'translateSelection',
    title: '翻译选中的文本',
    contexts: ['selection']
  });
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup') {
    port.onDisconnect.addListener(() => {
      console.log('Popup disconnected');
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translateSelection') {
    chrome.storage.local.set({
      textToTranslate: info.selectionText
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    chrome.storage.sync.get(['apiKey', 'model'], async (result) => {
      if (!result.apiKey) {
        sendResponse({ error: 'API Key not configured' });
        return;
      }
      
      try {
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.apiKey}`
          },
          body: JSON.stringify({
            thinking: {
              type: "disabled"
            },
            model: result.model,
            messages: [
              {
                role: 'user',
                content: request.prompt
              }
            ],
            temperature: 0.3,
            max_tokens: request.isSentence ? 3000 : 1000
          })
        });
        
        const data = await response.json();
        sendResponse({ result: data.choices[0].message.content });
      } catch (error) {
        sendResponse({ error: error.message });
      }
    });
    
    return true;
  }
  
  if (request.action === 'openPopup') {
    try {
      // 尝试通过不同的方式打开 popup
      if (chrome.action && chrome.action.openPopup) {
        chrome.action.openPopup();
        sendResponse({ success: true });
      } else {
        // 如果 chrome.action.openPopup 不可用，返回错误
        sendResponse({ error: 'chrome.action.openPopup not available' });
      }
    } catch (error) {
      sendResponse({ error: error.message });
    }
    return true;
  }
});