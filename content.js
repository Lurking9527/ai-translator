class ContentTranslator {
  constructor() {
    console.log('ContentTranslator initialized');
    this.initializeElements();
    this.attachEventListeners();
  }

  initializeElements() {
    this.translateButton = null;
    console.log('ContentTranslator elements initialized');
  }

  attachEventListeners() {
    console.log('Attaching event listeners');
    
    // 使用 mouseup 事件来检测文本选择
    document.addEventListener('mouseup', (e) => {
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        console.log('Text selected:', selectedText);
        
        if (selectedText && selectedText.length > 0) {
          this.showTranslateButton(e.pageX, e.pageY, selectedText);
        } else {
          this.hideTranslateButton();
        }
      }, 100);
    });

    // 点击其他地方时隐藏翻译按钮
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.translate-btn')) {
        this.hideTranslateButton();
      }
    });
    
    console.log('Event listeners attached');
  }

  showTranslateButton(x, y, text) {
    console.log('Showing translate button at:', x, y, 'with text:', text);
    this.hideTranslateButton();
    
    try {
      const button = document.createElement('div');
      button.className = 'translate-btn';
      button.innerHTML = '🌍 翻译';
      button.style.position = 'absolute';
      button.style.left = x + 'px';
      button.style.top = (y + 10) + 'px';
      button.style.zIndex = '10000';
      button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '6px';
      button.style.padding = '8px 16px';
      button.style.cursor = 'pointer';
      button.style.fontSize = '14px';
      button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      button.style.transition = 'transform 0.2s';
      
      // 添加点击事件
      button.addEventListener('click', (e) => {
        console.log('Translate button clicked!');
        e.preventDefault();
        e.stopPropagation();
        
        // 检查按钮是否已经处于"点击插件图标"状态
        if (button.innerHTML.includes('点击插件图标')) {
          // 直接尝试打开插件
          this.tryOpenPluginDirectly();
        } else {
          // 正常流程
          this.openPluginWithSelectedText(text);
        }
      });
      
      // 添加鼠标悬停效果
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-1px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
      
      // 确保按钮可以被点击
      button.style.pointerEvents = 'auto';
      
      document.body.appendChild(button);
      this.translateButton = button;
      
      console.log('Translate button created and added to DOM');
      
    } catch (error) {
      console.error('Error creating translate button:', error);
    }
  }

  hideTranslateButton() {
    console.log('Hiding translate button');
    if (this.translateButton) {
      this.translateButton.remove();
      this.translateButton = null;
      console.log('Translate button removed');
    }
  }

  // translateSelectedText 方法已移除，现在通过插件来处理翻译
  // 保留方法名以避免潜在的调用错误，但现在不做任何操作
  async translateSelectedText(text, x, y) {
    console.log('translateSelectedText called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译功能现在通过插件处理
  }

  // showFloatingPanel 方法已移除，现在通过插件来显示翻译结果
  showFloatingPanel(x, y, content) {
    console.log('showFloatingPanel called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译结果显示现在通过插件处理
  }

  // updateFloatingPanel 方法已移除，现在通过插件来显示翻译结果
  updateFloatingPanel(content) {
    console.log('updateFloatingPanel called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译结果显示现在通过插件处理
  }

  // hideFloatingPanel 方法已移除，现在通过插件来显示翻译结果
  hideFloatingPanel() {
    console.log('hideFloatingPanel called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译结果显示现在通过插件处理
  }

  // hideTranslationResultPanel 方法已移除，现在通过插件来显示翻译结果
  hideTranslationResultPanel() {
    console.log('hideTranslationResultPanel called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译结果显示现在通过插件处理
  }

  async openPluginWithSelectedText(text) {
    try {
      console.log('=== openPluginWithSelectedText called ===');
      console.log('Text to translate:', text);
      
      // 测试 chrome.storage 是否可用
      if (typeof chrome === 'undefined' || !chrome.storage) {
        throw new Error('Chrome storage API not available');
      }
      
      // 给用户反馈
      if (this.translateButton) {
        this.translateButton.innerHTML = '🔄 打开插件...';
        this.translateButton.style.background = '#ffc107';
        console.log('✓ Button feedback updated to opening plugin');
      }
      
      // 保存选中的文本到 storage
      await chrome.storage.local.set({
        selectedTextForTranslation: text,
        selectedTextTimestamp: Date.now()
      });
      console.log('✓ Selected text saved to storage');
      
      // 尝试打开插件
      let popupOpened = false;
      
      // 方法1: 使用 chrome.action.openPopup()
      if (chrome.action && chrome.action.openPopup) {
        try {
          chrome.action.openPopup();
          popupOpened = true;
          console.log('✓ Plugin opened via chrome.action.openPopup()');
        } catch (error) {
          console.warn('chrome.action.openPopup() failed:', error);
        }
      }
      
      // 方法2: 通过 background script 打开
      if (!popupOpened) {
        try {
          await chrome.runtime.sendMessage({ action: 'openPopup' });
          popupOpened = true;
          console.log('✓ Plugin opened via background script');
        } catch (error) {
          console.warn('background script openPopup failed:', error);
        }
      }
      
      // 方法3: 延迟重试 chrome.action.openPopup()
      if (!popupOpened) {
        try {
          await new Promise((resolve) => {
            setTimeout(() => {
              if (chrome.action && chrome.action.openPopup) {
                try {
                  chrome.action.openPopup();
                  popupOpened = true;
                  console.log('✓ Plugin opened via delayed chrome.action.openPopup()');
                } catch (error) {
                  console.warn('delayed chrome.action.openPopup() failed:', error);
                }
              }
              resolve();
            }, 200);
          });
        } catch (error) {
          console.warn('delayed attempt failed:', error);
        }
      }
      
      if (popupOpened) {
        // 给用户成功反馈
        if (this.translateButton) {
          this.translateButton.innerHTML = '✅ 已打开插件';
          this.translateButton.style.background = '#28a745';
          console.log('✓ Button feedback updated to plugin opened');
        }
        
        // 显示通知
        this.showNotification('正在翻译选中的文本...');
      } else {
        throw new Error('浏览器限制了自动打开功能，请手动点击插件图标');
      }
      
      // 3秒后隐藏按钮
      setTimeout(() => {
        this.hideTranslateButton();
      }, 3000);
      
    } catch (error) {
      console.error('✗ Error in openPluginWithSelectedText:', error);
      
      // 给用户错误反馈
      if (this.translateButton) {
        this.translateButton.innerHTML = '🔔 点击插件图标';
        this.translateButton.style.background = '#6c757d';
        console.log('✓ Button feedback updated to manual open');
        
        // 添加闪烁动画来吸引用户注意
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
          if (this.translateButton) {
            this.translateButton.style.background = blinkCount % 2 === 0 ? '#ffc107' : '#6c757d';
            blinkCount++;
            
            // 闪烁5次后停止
            if (blinkCount >= 10) {
              clearInterval(blinkInterval);
              if (this.translateButton) {
                this.translateButton.style.background = '#6c757d';
              }
            }
          } else {
            clearInterval(blinkInterval);
          }
        }, 500);
      }
      
      // 显示详细错误信息和手动操作提示
      this.showNotification('🔔 请点击浏览器右上角的插件图标，选中的文本会自动填充并翻译');
      
      // 10秒后隐藏按钮，给用户更多时间
      setTimeout(() => {
        this.hideTranslateButton();
      }, 10000);
    }
  }

  async tryOpenPluginDirectly() {
    try {
      console.log('=== Trying to open plugin directly ===');
      
      if (this.translateButton) {
        this.translateButton.innerHTML = '🔄 正在打开...';
        this.translateButton.style.background = '#ffc107';
      }
      
      // 尝试打开插件
      let popupOpened = false;
      
      // 方法1: 使用 chrome.action.openPopup()
      if (chrome.action && chrome.action.openPopup) {
        try {
          chrome.action.openPopup();
          popupOpened = true;
          console.log('✓ Plugin opened via chrome.action.openPopup()');
        } catch (error) {
          console.warn('chrome.action.openPopup() failed:', error);
        }
      }
      
      // 方法2: 通过 background script 打开
      if (!popupOpened) {
        try {
          await chrome.runtime.sendMessage({ action: 'openPopup' });
          popupOpened = true;
          console.log('✓ Plugin opened via background script');
        } catch (error) {
          console.warn('background script openPopup failed:', error);
        }
      }
      
      if (popupOpened) {
        if (this.translateButton) {
          this.translateButton.innerHTML = '✅ 已打开插件';
          this.translateButton.style.background = '#28a745';
        }
        this.showNotification('插件已打开，请进行翻译');
        
        // 3秒后隐藏按钮
        setTimeout(() => {
          this.hideTranslateButton();
        }, 3000);
      } else {
        if (this.translateButton) {
          this.translateButton.innerHTML = '🔔 手动打开';
          this.translateButton.style.background = '#dc3545';
        }
        this.showNotification('无法自动打开，请手动点击插件图标');
      }
      
    } catch (error) {
      console.error('✗ Error in tryOpenPluginDirectly:', error);
      this.showNotification('打开失败，请手动点击插件图标');
    }
  }

  // translateTextDirectly 方法已移除，现在通过插件来处理翻译
  async translateTextDirectly(text) {
    console.log('translateTextDirectly called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译功能现在通过插件处理
  }

  isChineseText(text) {
    const chineseRegex = /[\u4e00-\u9fff]/g;
    const chineseChars = text.match(chineseRegex);
    const totalChars = text.replace(/\s/g, '').length;
    return chineseChars && chineseChars.length >= totalChars * 0.6;
  }

  // showTranslationResult 方法已移除，现在通过插件来显示翻译结果
  showTranslationResult(original, translation, targetLanguage) {
    console.log('showTranslationResult called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译结果显示现在通过插件处理
  }

  // showSimpleTranslationResult 方法已移除，现在通过插件来显示翻译结果
  showSimpleTranslationResult(translation, targetLanguage) {
    console.log('showSimpleTranslationResult called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译结果显示现在通过插件处理
  }

  // parseTranslationResult 方法已移除，现在通过插件来处理翻译结果解析
  parseTranslationResult(result) {
    console.log('parseTranslationResult called but no longer implemented - using plugin instead');
    // 此方法已弃用，翻译结果解析现在通过插件处理
    return {
      translation: '',
      pronunciation: '',
      partOfSpeech: '',
      meaning: '',
      idiom: '',
      examples: []
    };
  }

  showNotification(message) {
    console.log('Showing notification:', message);
    
    try {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
        word-wrap: break-word;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      console.log('Notification added to DOM');
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
          console.log('Notification removed');
        }
      }, 6000);
      
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
}

function initializeContentTranslator() {
  console.log('=== Initializing Content Translator ===');
  console.log('Document readyState:', document.readyState);
  console.log('Chrome available:', typeof chrome !== 'undefined');
  console.log('Chrome storage available:', typeof chrome !== 'undefined' && chrome.storage);
  
  try {
    new ContentTranslator();
    console.log('✓ ContentTranslator created successfully');
  } catch (error) {
    console.error('✗ Error creating ContentTranslator:', error);
  }
}

if (document.readyState === 'loading') {
  console.log('Document still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', initializeContentTranslator);
} else {
  console.log('Document already loaded, initializing immediately');
  initializeContentTranslator();
}