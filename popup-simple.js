// 简化版本的popup.js用于调试
console.log('🚀 Simplified popup.js loading...');

class SimplePopupManager {
  constructor() {
    console.log('🔧 SimplePopupManager initializing...');
    this.initializeElements();
    this.attachEventListeners();
    console.log('✅ SimplePopupManager initialized');
  }

  initializeElements() {
    console.log('📋 Initializing elements...');
    this.inputText = document.getElementById('inputText');
    this.translateBtn = document.getElementById('translateBtn');
    this.resultSection = document.getElementById('resultSection');
    this.translationResult = document.getElementById('translationResult');
    
    console.log('📝 Elements found:', {
      inputText: !!this.inputText,
      translateBtn: !!this.translateBtn,
      resultSection: !!this.resultSection,
      translationResult: !!this.translationResult
    });
  }

  attachEventListeners() {
    console.log('🔗 Attaching event listeners...');
    if (this.translateBtn) {
      this.translateBtn.addEventListener('click', () => this.simpleTranslate());
      console.log('✅ Translate button listener attached');
    }
  }

  simpleTranslate() {
    console.log('🌍 Simple translate called');
    const text = this.inputText ? this.inputText.value : '';
    console.log('📝 Text to translate:', text);
    
    if (!text.trim()) {
      this.showResult('请输入要翻译的文本');
      return;
    }

    // 简单的文本分类测试
    const isWord = this.isWordOrPhrase(text);
    console.log('📊 Text classification result:', isWord);
    
    if (isWord) {
      this.showResult('这是单词/词语模式 - 会显示详细翻译信息');
    } else {
      this.showResult('这是句子模式 - 会直接显示翻译结果');
    }
  }

  isWordOrPhrase(text) {
    const trimmed = text.trim();
    if (!trimmed) return false;
    
    // 简化的判断逻辑
    const sentenceEnders = /[.!?。！？；;:：]/;
    if (sentenceEnders.test(trimmed)) return false;
    
    const words = trimmed.split(/\s+/);
    if (words.length > 5) return false;
    
    if (trimmed.length > 50) return false;
    
    return true;
  }

  showResult(message) {
    console.log('📯 Showing result:', message);
    if (this.resultSection) {
      this.resultSection.style.display = 'block';
    }
    if (this.translationResult) {
      this.translationResult.innerHTML = `
        <div class="translation-item">
          <div class="translation-text">${message}</div>
        </div>
      `;
    }
  }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded, creating SimplePopupManager...');
  try {
    new SimplePopupManager();
    console.log('🎉 SimplePopupManager created successfully');
  } catch (error) {
    console.error('❌ Error creating SimplePopupManager:', error);
  }
});

console.log('📦 Simplified popup.js loaded');