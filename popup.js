class PopupManager {
  constructor() {
    try {
      console.log('=== PopupManager Initializing ===');
      this.currentView = 'main';
      this.isVisible = true;
      this.hasSelectedTextJustFilled = false;
      
      // 逐步初始化，每一步都进行错误检查
      this.initializeElements();
      console.log('✅ Elements initialized');
      
      this.attachEventListeners();
      console.log('✅ Event listeners attached');
      
      this.loadSettings();
      console.log('✅ Settings loaded');
      
      this.loadHistory();
      console.log('✅ History loaded');
      
      this.setupWindowHandling();
      console.log('✅ Window handling setup');
      
      console.log('✅ PopupManager initialized successfully');
      
      // 延迟检查选中的文本和恢复状态
      setTimeout(() => {
        try {
          this.checkSelectedText();
          this.restorePopupState();
        } catch (error) {
          console.warn('⚠️ Error in delayed initialization:', error);
        }
      }, 50);
      
    } catch (error) {
      console.error('❌ Error in PopupManager constructor:', error);
      throw error;
    }
  }

  initializeElements() {
    try {
      console.log('🔍 Looking up DOM elements...');
      
      // 主要视图
      this.mainView = document.getElementById('mainView');
      this.settingsView = document.getElementById('settingsView');
      this.historyView = document.getElementById('historyView');
      
      // 翻译相关元素
      this.inputText = document.getElementById('inputText');
      this.targetLang = document.getElementById('targetLang');
      this.translateBtn = document.getElementById('translateBtn');
      this.resultSection = document.getElementById('resultSection');
      this.translationResult = document.getElementById('translationResult');
      
      // 按钮元素
      this.settingsBtn = document.getElementById('settingsBtn');
      this.historyBtn = document.getElementById('historyBtn');
      this.copyBtn = document.getElementById('copyBtn');
      
      // 设置相关元素
      this.apiKey = document.getElementById('apiKey');
      this.model = document.getElementById('model');
      this.saveSettings = document.getElementById('saveSettings');
      this.cancelSettings = document.getElementById('cancelSettings');
      
      // 历史记录相关元素
      this.clearHistory = document.getElementById('clearHistory');
      this.historyList = document.getElementById('historyList');
      
      // 验证关键元素是否存在
      const criticalElements = ['inputText', 'translateBtn', 'resultSection', 'translationResult'];
      const missingElements = criticalElements.filter(element => !this[element]);
      
      if (missingElements.length > 0) {
        throw new Error(`Missing critical elements: ${missingElements.join(', ')}`);
      }
      
      console.log('✅ All DOM elements found successfully');
      
    } catch (error) {
      console.error('❌ Error initializing elements:', error);
      throw error;
    }
  }

  attachEventListeners() {
    try {
      console.log('🔗 Attaching event listeners...');
      
      // 翻译按钮
      if (this.translateBtn) {
        this.translateBtn.addEventListener('click', () => this.translate());
        console.log('✅ Translate button listener attached');
      }
      
      // 导航按钮
      if (this.settingsBtn) {
        this.settingsBtn.addEventListener('click', () => this.showView('settings'));
        console.log('✅ Settings button listener attached');
      }
      
      if (this.historyBtn) {
        this.historyBtn.addEventListener('click', () => this.showView('history'));
        console.log('✅ History button listener attached');
      }
      
      if (this.copyBtn) {
        this.copyBtn.addEventListener('click', () => this.copyResult());
        console.log('✅ Copy button listener attached');
      }
      
      // 设置相关按钮
      if (this.saveSettings) {
        this.saveSettings.addEventListener('click', () => this.saveSettingsData());
        console.log('✅ Save settings button listener attached');
      }
      
      if (this.cancelSettings) {
        this.cancelSettings.addEventListener('click', () => this.showView('main'));
        console.log('✅ Cancel settings button listener attached');
      }
      
      if (this.clearHistory) {
        this.clearHistory.addEventListener('click', () => this.clearHistoryData());
        console.log('✅ Clear history button listener attached');
      }
      
      // 输入框事件
      if (this.inputText) {
        this.inputText.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.translate();
          }
        });

        this.inputText.addEventListener('input', () => {
          if (this.inputText.value.trim()) {
            this.translateBtn.style.opacity = '1';
          } else {
            this.translateBtn.style.opacity = '0.6';
          }
          
          // 用户输入时保存状态
          this.savePopupState();
        });
        console.log('✅ Input text listeners attached');
      }
      
      // 语言选择变化
      if (this.targetLang) {
        this.targetLang.addEventListener('change', () => {
          this.savePopupState();
        });
        console.log('✅ Language selector listener attached');
      }
      
      console.log('✅ All event listeners attached successfully');
      
    } catch (error) {
      console.error('❌ Error attaching event listeners:', error);
      throw error;
    }
  }

  setupWindowHandling() {
    // 立即检查选中的文本，然后恢复状态
    this.checkSelectedText();
    this.restorePopupState();
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkSelectedText();
        this.restorePopupState();
      }
    });

    // 监听窗口获得焦点
    window.addEventListener('focus', () => {
      this.checkSelectedText();
      this.restorePopupState();
    });
  }

  savePopupState() {
    try {
      const state = {
        currentView: this.currentView,
        inputText: this.inputText.value,
        targetLang: this.targetLang.value,
        resultVisible: this.resultSection.style.display !== 'none',
        resultContent: this.translationResult.innerHTML,
        timestamp: Date.now()
      };
      chrome.storage.local.set({ popupState: state });
      console.log('Popup state saved:', state);
    } catch (error) {
      console.error('Error saving popup state:', error);
    }
  }

  async restorePopupState() {
    try {
      const state = await chrome.storage.local.get(['popupState']);
      console.log('🔄 Restoring popup state:', state);
      console.log('🏷️ Has selected text just filled:', this.hasSelectedTextJustFilled);
      
      if (state.popupState) {
        const { currentView, inputText, targetLang, resultVisible, resultContent, timestamp } = state.popupState;
        
        // 只恢复最近30秒内的状态，避免恢复过旧的状态
        if (timestamp && Date.now() - timestamp < 30000) {
          console.log('✅ Restoring recent state');
          
          this.currentView = currentView;
          
          // 如果没有刚刚填充的选中文本，才恢复输入框内容
          if (!this.hasSelectedTextJustFilled) {
            this.inputText.value = inputText || '';
            console.log('📝 Restored input text from state:', inputText);
          } else {
            console.log('⏭️ Skipping input text restore due to selected text fill');
          }
          
          // 总是恢复语言设置，默认为中文
          this.targetLang.value = targetLang || 'zh';
          console.log('📝 Restored target language:', this.targetLang.value);
          
          if (resultVisible && resultContent) {
            this.resultSection.style.display = 'block';
            this.translationResult.innerHTML = resultContent;
          }
          
          this.showView(currentView);
          
          if (this.inputText.value.trim()) {
            this.translateBtn.style.opacity = '1';
          } else {
            this.translateBtn.style.opacity = '0.6';
          }
        } else {
          console.log('⏰ State too old, not restoring');
        }
      }
      
      // 重置标记
      this.hasSelectedTextJustFilled = false;
      
    } catch (error) {
      console.error('❌ Error restoring popup state:', error);
    }
  }

  showView(view) {
    this.currentView = view;
    this.mainView.style.display = view === 'main' ? 'block' : 'none';
    this.settingsView.style.display = view === 'settings' ? 'block' : 'none';
    this.historyView.style.display = view === 'history' ? 'block' : 'none';
    
    if (view === 'history') {
      this.loadHistory();
    }
  }

  async loadSettings() {
    const result = await chrome.storage.sync.get(['apiKey', 'model']);
    this.apiKey.value = result.apiKey || '';
    this.model.value = result.model || 'glm-4.5';
    
    if (!result.apiKey) {
      this.translateBtn.style.opacity = '0.6';
      this.translateBtn.title = '请先配置API Key';
    }
  }

  async saveSettingsData() {
    const apiKey = this.apiKey.value.trim();
    const model = this.model.value;
    
    if (!apiKey) {
      this.showError('请输入API Key');
      return;
    }
    
    await chrome.storage.sync.set({ apiKey, model });
    this.translateBtn.style.opacity = '1';
    this.translateBtn.title = '';
    this.showSuccess('设置已保存');
    this.showView('main');
  }

  async translate() {
    const text = this.inputText.value.trim();
    if (!text) {
      this.showError('请输入要翻译的文本');
      return;
    }
    
    const settings = await chrome.storage.sync.get(['apiKey', 'model']);
    if (!settings.apiKey) {
      this.showError('请先在设置中配置API Key');
      this.showView('settings');
      return;
    }
    
    this.showLoading();
    
    try {
      const targetLanguage = this.targetLang.value === 'en' ? '英语' : '中文';
      const isChineseText = this.isChineseText(text);
      const isChineseTarget = targetLanguage === '中文';
      
      // 判断文本类型：true表示单词/词语/成语，false表示句子
      const isWordPhrase = this.isWordOrPhrase(text);
      
      // 调试信息
      console.log('🔍 Text Analysis Debug:', {
        originalText: text,
        isChineseText,
        isWordPhrase,
        textLength: text.length,
        wordCount: text.split(/\s+/).length,
        chineseCharCount: (text.match(/[\u4e00-\u9fff]/g) || []).length
      });
      
      let prompt;
      
      if (isWordPhrase) {
        // 单词/词语/成语的详细翻译
        if (isChineseText && isChineseTarget) {
          const sectionTitle = text.length <= 4 ? '字义解释' : '成语/典故解释';
          const sectionContent = text.length <= 4 ? '解释每个字的含义' : '如果是成语或典故，请解释其来源、出处和故事背景；如果不是，请写"无"';
          
          prompt = `
请为以下中文${text.length <= 4 ? '字词' : '成语/短语'}提供详细的语言解释和分析：

原文：${text}

请严格按照以下格式返回结果，不要省略任何部分：

1. 拼音标注：[为每个中文字符提供完整的拼音标注，包含声调]
2. 词性分析：[分析每个词汇的词性，如名词、动词、形容词等]
3. 含义解释：[提供详细的含义解释，包括字面意思和引申义]
4. ${sectionTitle}：[${sectionContent}]
5. 最佳使用案例：[提供2个具体的实际使用例句]

请确保每个部分都有内容，格式严格按照上述要求。
`;
        } else {
          prompt = `
请翻译以下${this.isChineseText(text) ? '中文' : '英文'}${text.includes(' ') ? '短语' : '单词'}，并提供详细的语言信息：

原文：${text}
目标语言：${targetLanguage}

请按照以下格式返回翻译结果：
1. 翻译结果：[翻译后的文本]
2. 读音：[${this.isChineseText(text) ? '拼音' : '音标'}]
3. 词性：[标注词性，如名词、动词、形容词等]
4. 含义解释：[详细的含义解释]
5. 最佳使用案例：[提供2个最佳的实际用例]

请确保信息准确、全面，且每个部分都有内容，并选择最具代表性的2个使用案例。
`;
        }
      } else {
        // 句子的简化翻译
        prompt = `
请将以下${this.isChineseText(text) ? '中文' : '英文'}句子翻译成${targetLanguage}。

原文：${text}

要求：
1. 直接提供翻译结果，不要添加任何格式标记、编号或解释
2. 保持原文的语气和风格
3. 确保翻译准确、自然、流畅
4. 不要添加"翻译结果："等前缀
5. 不要包含读音、词性、解释等额外信息

请直接输出翻译后的文本：
`;
      }
      
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          thinking: {
            type: "disabled"
          },
          model: settings.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: isWordPhrase ? 1000 : 3000
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const result = data.choices[0].message.content;
      
      this.displayResult(result, isChineseText && isChineseTarget, !isWordPhrase);
      await this.saveToHistory(text, result);
      
      // 翻译完成后保存状态
      this.savePopupState();
      
    } catch (error) {
      console.error('Translation error:', error);
      this.showError('翻译失败，请检查网络连接和API Key');
    } finally {
      this.hideLoading();
    }
  }

  isChineseText(text) {
    const chineseRegex = /[\u4e00-\u9fff]/g;
    const chineseChars = text.match(chineseRegex);
    const totalChars = text.replace(/\s/g, '').length;
    return chineseChars && chineseChars.length >= totalChars * 0.6;
  }

  // 判断文本类型：true表示单词/词语/成语，false表示句子
  isWordOrPhrase(text) {
    const trimmed = text.trim();
    
    // 空文本返回false
    if (!trimmed) return false;
    
    // 判断是否包含句子结束符号
    const sentenceEnders = /[.!?。！？；;:：]/;
    if (sentenceEnders.test(trimmed)) {
      return false;
    }
    
    // 判断是否包含问句结构
    const questionPatterns = [
      /^(what|when|where|who|why|how|which|whose|is|are|was|were|do|does|did|can|could|will|would|should|may|might|must|have|has|had)\s/i,
      /^(吗|呢|吧|啊|呀|么|哪|怎么|什么|何时|何地|谁|为什么|如何|哪能)/
    ];
    if (questionPatterns.some(pattern => pattern.test(trimmed))) {
      return false;
    }
    
    // 英文文本判断
    if (!this.isChineseText(trimmed)) {
      const words = trimmed.split(/\s+/);
      
      // 如果是单个单词，返回true
      if (words.length === 1) {
        return true;
      }
      
      // 如果是短语（2-5个单词），检查长度和结构
      if (words.length <= 5 && trimmed.length < 60) {
        // 检查是否为常见短语结构
        const phrasePatterns = [
          /\b(of|in|on|at|for|with|by|to|from|about|as|into|like|through|after|over|between|against|during|before|above|below|up|down|off|out|around|past|since|until|upon|across|towards|upon)\b/i,
          /\b(and|or|but|yet|so|for|nor)\b/i
        ];
        
        // 如果包含连词或介词，可能是短语
        if (phrasePatterns.some(pattern => pattern.test(trimmed))) {
          return true;
        }
        
        // 短复合词也认为是短语
        if (trimmed.includes('-')) {
          return true;
        }
        
        // 常见技术术语短语
        const techPhrases = [
          /artificial intelligence/i,
          /machine learning/i,
          /deep learning/i,
          /natural language processing/i,
          /computer vision/i,
          /data science/i,
          /software engineering/i,
          /user experience/i,
          /user interface/i,
          /operating system/i
        ];
        
        if (techPhrases.some(pattern => pattern.test(trimmed))) {
          return true;
        }
        
        // 简单的名词组合也认为是短语
        const simpleNounPhrase = /^[a-zA-Z\s]+$/;
        if (simpleNounPhrase.test(trimmed) && words.length <= 3) {
          return true;
        }
      }
      
      // 其他情况认为是句子
      return false;
    }
    
    // 中文文本判断
    if (this.isChineseText(trimmed)) {
      // 移除标点符号
      const cleanText = trimmed.replace(/[，。！？；：""''（）【】《》、]/g, '');
      
      // 中文字符数量
      const chineseCharCount = (cleanText.match(/[\u4e00-\u9fff]/g) || []).length;
      
      // 如果字符数在1-8之间，认为是词语或成语
      if (chineseCharCount >= 1 && chineseCharCount <= 8) {
        return true;
      }
      
      // 如果字符数在9-15之间，检查是否为常见短语结构
      if (chineseCharCount <= 15) {
        // 检查是否为短语特征
        const phrasePatterns = [
          /的.+$/,  // 的字结构
          /^是.+/,   // 是字结构
          /^有.+/,   // 有字结构
          /在.+$/,   // 在字结构
          /把.+/,   // 把字结构
          /被.+/,   // 被字结构
          /得.+$/,   // 得字结构
          /地.+$/    // 地字结构
        ];
        
        if (phrasePatterns.some(pattern => pattern.test(cleanText))) {
          return true;
        }
        
        // 检查是否为常见复合词
        const compoundPatterns = [
          /人工智能/,
          /机器学习/,
          /深度学习/,
          /大数据/,
          /云计算/,
          /物联网/,
          /区块链/,
          /虚拟现实/,
          /增强现实/,
          /自动驾驶/
        ];
        
        if (compoundPatterns.some(pattern => pattern.test(cleanText))) {
          return true;
        }
      }
    }
    
    // 默认认为是句子
    return false;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  displayResult(result, isChineseAnalysis = false, isSentence = false) {
    this.resultSection.style.display = 'block';
    
    // 如果是句子，直接显示翻译结果
    if (isSentence) {
      this.translationResult.innerHTML = `
        <div class="translation-item sentence-text">
          <div class="translation-text">${this.escapeHtml(result)}</div>
        </div>
      `;
      return;
    }
    
    const parsedResult = isChineseAnalysis ? 
      this.parseChineseAnalysisResult(result) : 
      this.parseTranslationResult(result);
    
    if (isChineseAnalysis) {
      this.translationResult.innerHTML = `
        <div class="translation-item">
          <strong>拼音标注：</strong>
          <span class="pronunciation">${parsedResult.pinyin}</span>
        </div>
        ${parsedResult.partOfSpeech ? `
          <div class="translation-item">
            <strong>词性分析：</strong>
            ${parsedResult.partOfSpeech}
          </div>
        ` : ''}
        ${parsedResult.meaning ? `
          <div class="translation-item">
            <strong>含义解释：</strong>
            ${parsedResult.meaning}
          </div>
        ` : ''}
        ${parsedResult.idiom ? `
          <div class="translation-item">
            <strong>成语/典故解释：</strong>
            ${parsedResult.idiom}
          </div>
        ` : ''}
        ${parsedResult.examples && parsedResult.examples.length > 0 ? `
          <div class="translation-item">
            <strong>最佳使用案例：</strong>
            <div class="usage-examples">
              <ul>
                ${parsedResult.examples.map(example => `<li>${example}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
      `;
    } else {
      this.translationResult.innerHTML = `
        <div class="translation-item">
          <strong>翻译结果：</strong>
          ${parsedResult.translation}
        </div>
        ${parsedResult.pronunciation ? `
          <div class="translation-item">
            <strong>读音：</strong>
            <span class="pronunciation">${parsedResult.pronunciation}</span>
          </div>
        ` : ''}
        ${parsedResult.partOfSpeech ? `
          <div class="translation-item">
            <strong>词性：</strong>
            ${parsedResult.partOfSpeech}
          </div>
        ` : ''}
        ${parsedResult.meaning ? `
          <div class="translation-item">
            <strong>含义解释：</strong>
            ${parsedResult.meaning}
          </div>
        ` : ''}
        ${parsedResult.examples && parsedResult.examples.length > 0 ? `
          <div class="translation-item">
            <strong>用法案例：</strong>
            <div class="usage-examples">
              <ul>
                ${parsedResult.examples.map(example => `<li>${example}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
      `;
    }
  }

  parseChineseAnalysisResult(result) {
    const lines = result.split('\n');
    const parsed = {
      pinyin: '',
      partOfSpeech: '',
      meaning: '',
      idiom: '',
      examples: []
    };
    
    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      if (trimmed.startsWith('1. 拼音标注：')) {
        parsed.pinyin = trimmed.replace('1. 拼音标注：', '').trim();
        currentSection = 'pinyin';
      } else if (trimmed.startsWith('2. 词性分析：')) {
        parsed.partOfSpeech = trimmed.replace('2. 词性分析：', '').trim();
        currentSection = 'partOfSpeech';
      } else if (trimmed.startsWith('3. 含义解释：')) {
        parsed.meaning = trimmed.replace('3. 含义解释：', '').trim();
        currentSection = 'meaning';
      } else if (trimmed.startsWith('4. 成语/典故解释：')) {
        parsed.idiom = trimmed.replace('4. 成语/典故解释：', '').trim();
        currentSection = 'idiom';
      } else if (trimmed.startsWith('5. 最佳使用案例：')) {
        currentSection = 'examples';
      } else if (currentSection === 'examples') {
        if (trimmed.match(/^\d+\./) || trimmed.match(/^例句\d+[:：]/) || trimmed.match(/^\d+[:：]/)) {
          const example = trimmed.replace(/^\d+\.\s*/, '').replace(/^例句\d+[:：]\s*/, '').replace(/^\d+[:：]\s*/, '');
          if (example) {
            parsed.examples.push(example);
          }
        } else if (parsed.examples.length > 0 && !trimmed.startsWith('5. 最佳使用案例：')) {
          parsed.examples[parsed.examples.length - 1] += ' ' + trimmed;
        }
      } else if (currentSection === 'meaning' && !trimmed.startsWith('3. 含义解释：') && !trimmed.match(/^\d+\./)) {
        parsed.meaning += ' ' + trimmed;
      } else if (currentSection === 'idiom' && !trimmed.startsWith('4. 成语/典故解释：') && !trimmed.match(/^\d+\./)) {
        if (trimmed !== '无') {
          parsed.idiom += ' ' + trimmed;
        }
      } else if (currentSection === 'partOfSpeech' && !trimmed.startsWith('2. 词性分析：') && !trimmed.match(/^\d+\./)) {
        parsed.partOfSpeech += ' ' + trimmed;
      } else if (currentSection === 'pinyin' && !trimmed.startsWith('1. 拼音标注：') && !trimmed.match(/^\d+\./)) {
        parsed.pinyin += ' ' + trimmed;
      }
    }
    
    return parsed;
  }

  parseTranslationResult(result) {
    const lines = result.split('\n');
    const parsed = {
      translation: '',
      pronunciation: '',
      partOfSpeech: '',
      meaning: '',
      idiom: '',
      examples: []
    };
    
    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      if (trimmed.startsWith('1. 翻译结果：')) {
        parsed.translation = trimmed.replace('1. 翻译结果：', '').trim();
        currentSection = 'translation';
      } else if (trimmed.startsWith('1. 拼音标注：')) {
        parsed.pronunciation = trimmed.replace('1. 拼音标注：', '').trim();
        currentSection = 'pinyin';
      } else if (trimmed.startsWith('2. 词性分析：')) {
        parsed.partOfSpeech = trimmed.replace('2. 词性分析：', '').trim();
        currentSection = 'partOfSpeech';
      } else if (trimmed.startsWith('2. 读音：')) {
        parsed.pronunciation = trimmed.replace('2. 读音：', '').trim();
        currentSection = 'pronunciation';
      } else if (trimmed.startsWith('3. 词性：')) {
        parsed.partOfSpeech = trimmed.replace('3. 词性：', '').trim();
        currentSection = 'partOfSpeech';
      } else if (trimmed.startsWith('3. 含义解释：')) {
        parsed.meaning = trimmed.replace('3. 含义解释：', '').trim();
        currentSection = 'meaning';
      } else if (trimmed.startsWith('4. 含义解释：')) {
        parsed.meaning = trimmed.replace('4. 含义解释：', '').trim();
        currentSection = 'meaning';
      } else if (trimmed.startsWith('4. 成语/典故解释：')) {
        parsed.idiom = trimmed.replace('4. 成语/典故解释：', '').trim();
        currentSection = 'idiom';
      } else if (trimmed.startsWith('5. 最佳使用案例：')) {
        currentSection = 'examples';
      } else if (currentSection === 'examples') {
        if (trimmed.match(/^\d+\./) || trimmed.match(/^例句\d+[:：]/) || trimmed.match(/^\d+[:：]/)) {
          const example = trimmed.replace(/^\d+\.\s*/, '').replace(/^例句\d+[:：]\s*/, '').replace(/^\d+[:：]\s*/, '');
          if (example) {
            parsed.examples.push(example);
          }
        } else if (parsed.examples.length > 0 && !trimmed.startsWith('5. 最佳使用案例：')) {
          parsed.examples[parsed.examples.length - 1] += ' ' + trimmed;
        }
      } else if (currentSection === 'meaning' && !trimmed.startsWith('3. 含义解释：') && !trimmed.startsWith('4. 含义解释：') && !trimmed.match(/^\d+\./)) {
        parsed.meaning += ' ' + trimmed;
      } else if (currentSection === 'idiom' && !trimmed.startsWith('4. 成语/典故解释：') && !trimmed.match(/^\d+\./)) {
        if (trimmed !== '无') {
          parsed.idiom += ' ' + trimmed;
        }
      } else if (currentSection === 'partOfSpeech' && !trimmed.startsWith('2. 词性分析：') && !trimmed.startsWith('3. 词性：') && !trimmed.match(/^\d+\./)) {
        parsed.partOfSpeech += ' ' + trimmed;
      } else if (currentSection === 'pinyin' && !trimmed.startsWith('1. 拼音标注：') && !trimmed.startsWith('2. 读音：') && !trimmed.match(/^\d+\./)) {
        parsed.pronunciation += ' ' + trimmed;
      }
    }
    
    return parsed;
  }

  async saveToHistory(original, translation) {
    const history = await chrome.storage.local.get(['translationHistory']);
    const newHistory = history.translationHistory || [];
    
    newHistory.unshift({
      original,
      translation,
      timestamp: new Date().toISOString(),
      targetLang: this.targetLang.value
    });
    
    if (newHistory.length > 50) {
      newHistory.splice(50);
    }
    
    await chrome.storage.local.set({ translationHistory: newHistory });
  }

  keepPopupAlive() {
    if (this.isVisible) {
      chrome.action.openPopup();
    }
  }

  async checkSelectedText() {
    try {
      console.log('=== Checking for selected text and translation results ===');
      
      // 首先检查是否有翻译结果
      const translationData = await chrome.storage.local.get(['inputText', 'translatedText', 'targetLanguage', 'timestamp']);
      console.log('📦 Translation data from storage:', translationData);
      
      if (translationData.inputText && translationData.translatedText && translationData.timestamp) {
        const timeDiff = Date.now() - translationData.timestamp;
        console.log('⏰ Translation time difference:', timeDiff, 'ms');
        
        // 只处理最近60秒内的翻译结果
        if (timeDiff < 60000) {
          console.log('✅ Found recent translation result, displaying directly');
          
          // 原文放入输入框，翻译结果显示在结果区域
          this.inputText.value = translationData.inputText;
          this.targetLang.value = translationData.targetLanguage || 'zh';
          this.translateBtn.style.opacity = '1';
          
          // 显示翻译结果
          this.displayDirectTranslationResult(translationData.inputText, translationData.translatedText, translationData.targetLanguage);
          
          // 清除翻译结果数据
          await chrome.storage.local.remove(['inputText', 'translatedText', 'targetLanguage', 'timestamp']);
          
          return;
        } else {
          console.log('⏰ Translation result is too old, clearing');
          await chrome.storage.local.remove(['inputText', 'translatedText', 'targetLanguage', 'timestamp']);
        }
      }
      
      // 如果没有翻译结果，检查是否有选中的文本
      const selectedData = await chrome.storage.local.get(['selectedTextForTranslation', 'selectedTextTimestamp']);
      console.log('📦 Selected data from storage:', selectedData);
      
      if (selectedData.selectedTextForTranslation && selectedData.selectedTextTimestamp) {
        const timeDiff = Date.now() - selectedData.selectedTextTimestamp;
        console.log('⏰ Selected text time difference:', timeDiff, 'ms');
        
        // 只处理最近30秒内选中的文本
        if (timeDiff < 30000) {
          console.log('✅ Found selected text to fill:', selectedData.selectedTextForTranslation);
          
          // 使用更直接的方法 - 立即设置值
          const textToFill = selectedData.selectedTextForTranslation;
          
          // 清除存储中的数据
          await chrome.storage.local.remove(['selectedTextForTranslation', 'selectedTextTimestamp']);
          
          // 设置标记，防止状态恢复覆盖选中的文本
          this.hasSelectedTextJustFilled = true;
          
          // 使用requestAnimationFrame确保DOM已准备好
          requestAnimationFrame(() => {
            console.log('🎯 Filling text in requestAnimationFrame');
            this.fillTextAndAutoTranslate(textToFill);
          });
          
        } else {
          console.log('⏰ Selected text is too old:', timeDiff, 'ms');
          await chrome.storage.local.remove(['selectedTextForTranslation', 'selectedTextTimestamp']);
        }
      } else {
        console.log('❌ No selected text or translation result found in storage');
      }
    } catch (error) {
      console.error('❌ Error checking selected text:', error);
    }
  }

  displayDirectTranslationResult(original, translation, targetLanguage) {
    try {
      console.log('🎯 Displaying direct translation result');
      console.log('Original:', original);
      console.log('Translation:', translation);
      console.log('Target language:', targetLanguage);
      
      // 判断文本类型
      const isWordPhrase = this.isWordOrPhrase(original);
      
      // 显示在结果区域
      this.resultSection.style.display = 'block';
      
      // 如果是句子，直接显示翻译结果
      if (!isWordPhrase) {
        this.translationResult.innerHTML = `
          <div class="translation-item sentence-text">
            <div class="translation-text">${this.escapeHtml(translation)}</div>
          </div>
        `;
      } else {
        // 解析翻译结果
        const parsedResult = this.parseTranslationResult(translation);
        
        // 构建结果显示HTML（不显示原文，因为原文已经在输入框中）
        let resultHTML = '';
        
        if (targetLanguage === 'zh') {
          // 中文分析结果
          if (parsedResult.pinyin) {
            resultHTML += `
              <div class="translation-item">
                <strong>拼音标注：</strong>
                <span class="pronunciation">${parsedResult.pinyin}</span>
              </div>
            `;
          }
          
          if (parsedResult.partOfSpeech) {
            resultHTML += `
              <div class="translation-item">
                <strong>词性分析：</strong>
                ${parsedResult.partOfSpeech}
              </div>
            `;
          }
          
          if (parsedResult.meaning) {
            resultHTML += `
              <div class="translation-item">
                <strong>含义解释：</strong>
                ${parsedResult.meaning}
              </div>
            `;
          }
          
          if (parsedResult.idiom) {
            resultHTML += `
              <div class="translation-item">
                <strong>成语/典故解释：</strong>
                ${parsedResult.idiom}
              </div>
            `;
          }
          
          if (parsedResult.examples && parsedResult.examples.length > 0) {
            resultHTML += `
              <div class="translation-item">
                <strong>最佳使用案例：</strong>
                <div class="usage-examples">
                  <ul>
                    ${parsedResult.examples.map(example => `<li>${example}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `;
          }
        } else {
          // 翻译结果
          if (parsedResult.translation) {
            resultHTML += `
              <div class="translation-item">
                <strong>翻译结果：</strong>
                ${parsedResult.translation}
              </div>
            `;
          }
          
          if (parsedResult.pronunciation) {
            resultHTML += `
              <div class="translation-item">
                <strong>读音：</strong>
                <span class="pronunciation">${parsedResult.pronunciation}</span>
              </div>
            `;
          }
          
          if (parsedResult.partOfSpeech) {
            resultHTML += `
              <div class="translation-item">
                <strong>词性：</strong>
                ${parsedResult.partOfSpeech}
              </div>
            `;
          }
          
          if (parsedResult.meaning) {
            resultHTML += `
              <div class="translation-item">
                <strong>含义解释：</strong>
                ${parsedResult.meaning}
              </div>
            `;
          }
          
          if (parsedResult.examples && parsedResult.examples.length > 0) {
            resultHTML += `
              <div class="translation-item">
                <strong>用法案例：</strong>
                <div class="usage-examples">
                  <ul>
                    ${parsedResult.examples.map(example => `<li>${example}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `;
          }
        }
        
        this.translationResult.innerHTML = resultHTML;
      }
      
      // 设置按钮状态
      this.translateBtn.style.opacity = '1';
      
      // 显示成功提示
      this.showSuccess('翻译完成！');
      
      console.log('✅ Direct translation result displayed successfully');
      
    } catch (error) {
      console.error('❌ Error displaying direct translation result:', error);
    }
  }

  fillTextAndAutoTranslate(text) {
    try {
      console.log('🎯 Auto translate attempt');
      console.log('Text to translate:', text);
      
      // 获取DOM元素
      const inputElement = document.getElementById('inputText');
      const translateBtn = document.getElementById('translateBtn');
      
      console.log('DOM input element exists:', !!inputElement);
      console.log('DOM translate button exists:', !!translateBtn);
      
      if (inputElement && translateBtn) {
        // 直接设置值
        inputElement.value = text;
        
        console.log('✅ Text filled successfully');
        console.log('📝 Final inputElement.value:', inputElement.value);
        
        // 设置按钮状态
        translateBtn.style.opacity = '1';
        translateBtn.disabled = false;
        
        // 聚焦和选中文本
        inputElement.focus();
        inputElement.select();
        
        // 显示成功提示
        this.showSuccess('文本已自动填充，正在翻译...');
        
        // 延迟一下确保文本填充完成，然后自动翻译
        setTimeout(() => {
          console.log('🚀 Auto translating...');
          this.translate();
        }, 500);
        
        // 最终验证
        setTimeout(() => {
          console.log('🔍 FINAL VERIFICATION:');
          console.log('🔍 inputElement.value:', inputElement.value);
          console.log('🔍 inputElement.textContent:', inputElement.textContent);
          console.log('🔍 inputElement.innerHTML:', inputElement.innerHTML);
          console.log('🔍 getAttribute("value"):', inputElement.getAttribute('value'));
        }, 100);
        
      } else {
        console.error('❌ Required elements not found in DOM');
      }
      
    } catch (error) {
      console.error('❌ Error in fillTextAndAutoTranslate:', error);
    }
  }

  fillTextDirectly(text) {
    try {
      console.log('🎯 Direct text fill attempt');
      console.log('Text to fill:', text);
      
      // 获取DOM元素
      const inputElement = document.getElementById('inputText');
      console.log('DOM input element exists:', !!inputElement);
      
      if (inputElement) {
        // 直接设置值
        inputElement.value = text;
        
        console.log('✅ Text filled successfully');
        console.log('📝 Final inputElement.value:', inputElement.value);
        
        // 设置按钮状态
        const translateBtn = document.getElementById('translateBtn');
        if (translateBtn) {
          translateBtn.style.opacity = '1';
        }
        
        // 聚焦和选中文本
        inputElement.focus();
        inputElement.select();
        
        // 显示成功提示
        this.showSuccess('文本已自动填充');
        
        // 最终验证
        setTimeout(() => {
          console.log('🔍 FINAL VERIFICATION:');
          console.log('🔍 inputElement.value:', inputElement.value);
          console.log('🔍 inputElement.textContent:', inputElement.textContent);
          console.log('🔍 inputElement.innerHTML:', inputElement.innerHTML);
          console.log('🔍 getAttribute("value"):', inputElement.getAttribute('value'));
        }, 100);
        
      } else {
        console.error('❌ Input element not found in DOM');
      }
      
    } catch (error) {
      console.error('❌ Error in fillTextDirectly:', error);
    }
  }

  async loadHistory() {
    const history = await chrome.storage.local.get(['translationHistory']);
    const historyData = history.translationHistory || [];
    
    this.historyList.innerHTML = '';
    
    if (historyData.length === 0) {
      this.historyList.innerHTML = '<div class="loading">暂无翻译历史</div>';
      return;
    }
    
    historyData.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="original">${item.original}</div>
        <div class="translation">${item.translation}</div>
        <div class="timestamp">${new Date(item.timestamp).toLocaleString()}</div>
      `;
      
      historyItem.addEventListener('click', () => {
        this.inputText.value = item.original;
        this.targetLang.value = item.targetLang;
        this.showView('main');
        this.savePopupState();
      });
      
      this.historyList.appendChild(historyItem);
    });
  }

  async clearHistoryData() {
    if (confirm('确定要清空所有历史记录吗？')) {
      await chrome.storage.local.remove(['translationHistory']);
      this.loadHistory();
      this.showSuccess('历史记录已清空');
    }
  }

  copyResult() {
    const resultText = this.translationResult.textContent;
    navigator.clipboard.writeText(resultText).then(() => {
      this.showSuccess('已复制到剪贴板');
    });
  }

  showLoading() {
    this.translateBtn.innerHTML = '<span class="loading-spinner"></span> 翻译中...';
    this.translateBtn.disabled = true;
  }

  hideLoading() {
    this.translateBtn.textContent = '翻译';
    this.translateBtn.disabled = false;
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'error';
    successDiv.style.background = '#d4edda';
    successDiv.style.color = '#155724';
    successDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 2000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('🚀 DOM Content Loaded, initializing popup...');
    new PopupManager();
    console.log('✅ PopupManager initialized successfully');
  } catch (error) {
    console.error('❌ Fatal error initializing popup:', error);
    // 显示错误信息给用户
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial;">
        <h2>插件初始化失败</h2>
        <p>错误信息: ${error.message}</p>
        <p>请检查控制台获取详细信息。</p>
      </div>
    `;
  }
});