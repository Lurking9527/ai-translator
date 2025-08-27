// 测试文本分类方法
class TextClassifierTest {
  constructor() {
    this.testCases = [
      // 英文单词
      { text: 'hello', expected: true, type: '英文单词' },
      { text: 'beautiful', expected: true, type: '英文单词' },
      { text: 'artificial', expected: true, type: '英文单词' },
      
      // 英文短语
      { text: 'artificial intelligence', expected: true, type: '英文短语' },
      { text: 'hello world', expected: true, type: '英文短语' },
      { text: 'machine learning', expected: true, type: '英文短语' },
      
      // 英文句子
      { text: 'Hello, how are you?', expected: false, type: '英文句子' },
      { text: 'I love learning new languages.', expected: false, type: '英文句子' },
      { text: 'What is your name?', expected: false, type: '英文问句' },
      
      // 中文词语
      { text: '美丽', expected: true, type: '中文词语' },
      { text: '学习', expected: true, type: '中文词语' },
      { text: '人工智能', expected: true, type: '中文短语' },
      
      // 中文成语
      { text: '画龙点睛', expected: true, type: '中文成语' },
      { text: '守株待兔', expected: true, type: '中文成语' },
      
      // 中文短语
      { text: '美丽的', expected: true, type: '中文短语' },
      { text: '是有', expected: true, type: '中文短语' },
      { text: '人工智能的', expected: true, type: '中文短语' },
      
      // 中文句子
      { text: '今天天气很好。', expected: false, type: '中文句子' },
      { text: '我喜欢学习新语言。', expected: false, type: '中文句子' },
      { text: '你好吗？', expected: false, type: '中文问句' },
      { text: '这是一个很长的句子，包含多个分句。', expected: false, type: '中文长句' },
      
      // 边界情况
      { text: 'hello world, how are you?', expected: false, type: '混合句子' },
      { text: 'Hello 世界', expected: true, type: '混合短语' },
      { text: '', expected: false, type: '空文本' },
      { text: '   ', expected: false, type: '空白字符' }
    ];
  }
  
  isChineseText(text) {
    const chineseRegex = /[\u4e00-\u9fff]/g;
    const chineseChars = text.match(chineseRegex);
    const totalChars = text.replace(/\s/g, '').length;
    return chineseChars && chineseChars.length >= totalChars * 0.6;
  }
  
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
  
  runTests() {
    console.log('🧪 开始文本分类测试...\n');
    
    let passed = 0;
    let failed = 0;
    
    this.testCases.forEach((test, index) => {
      const result = this.isWordOrPhrase(test.text);
      const status = result === test.expected ? '✅' : '❌';
      
      if (result === test.expected) {
        passed++;
      } else {
        failed++;
      }
      
      console.log(`${status} 测试 ${index + 1}: ${test.type}`);
      console.log(`   文本: "${test.text}"`);
      console.log(`   期望: ${test.expected ? '单词/词语' : '句子'}`);
      console.log(`   实际: ${result ? '单词/词语' : '句子'}`);
      console.log('');
    });
    
    console.log('📊 测试结果统计:');
    console.log(`   ✅ 通过: ${passed}`);
    console.log(`   ❌ 失败: ${failed}`);
    console.log(`   📈 准确率: ${((passed / this.testCases.length) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
      console.log('🎉 所有测试通过！文本分类逻辑正常。');
    } else {
      console.log('⚠️  存在失败的测试，需要优化分类逻辑。');
    }
  }
}

// 运行测试
const tester = new TextClassifierTest();
tester.runTests();