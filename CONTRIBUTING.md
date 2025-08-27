# 贡献指南

感谢您对 AI Translator 项目的关注！我们欢迎任何形式的贡献。

## 🤝 如何贡献

### 报告问题

如果您发现了bug或有功能建议，请：

1. 检查 [GitHub Issues](https://github.com/Lurking9527/ai-translator/issues) 确认问题是否已被报告
2. 如果是新问题，创建一个新的Issue
3. 使用 Issue 模板提供详细信息
4. 包含重现步骤和预期行为

### 提交代码

#### 准备工作

1. **Fork 项目**
   ```bash
   # Fork 到您的 GitHub 账户
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/Lurking9527/ai-translator.git
   cd ai-translator
   ```

3. **设置上游仓库**
   ```bash
   git remote add upstream https://github.com/original-username/ai-translator.git
   ```

4. **创建开发分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### 开发流程

1. **编写代码**
   - 遵循项目代码风格
   - 添加必要的注释
   - 确保功能完整测试

2. **测试验证**
   ```bash
   # 在浏览器中测试插件功能
   # 确保所有功能正常工作
   # 检查控制台错误
   ```

3. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

4. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 详细描述更改内容
   - 关联相关的 Issue

## 📋 代码规范

### JavaScript 规范

#### 命名约定
```javascript
// 使用有意义的变量名
const userTranslationHistory = []; // ✓
const history = []; // ✗

// 使用驼峰命名法
function translateText() {} // ✓
function Translate_Text() {} // ✗

// 常量使用大写
const API_BASE_URL = 'https://open.bigmodel.cn'; // ✓
const apiBaseUrl = 'https://open.bigmodel.cn'; // ✗
```

#### 函数设计
```javascript
// 函数职责单一
function validateApiKey(apiKey) {
  return apiKey && apiKey.length > 0;
}

// 函数参数清晰
async function translateText(text, targetLanguage, apiKey) {
  // 实现翻译逻辑
}

// 错误处理完善
async function fetchTranslation(prompt, apiKey) {
  try {
    const response = await fetch(/* ... */);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Translation failed:', error);
    throw error;
  }
}
```

#### 异步处理
```javascript
// 使用 async/await
async function saveToStorage(data) {
  try {
    await chrome.storage.local.set(data);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

// 避免回调地狱
function translateAndSave(text, targetLanguage) {
  return translateText(text, targetLanguage)
    .then(result => saveToStorage({ result }))
    .catch(error => console.error('Translation failed:', error));
}
```

### CSS 规范

#### 命名和组织
```css
/* 使用 BEM 命名方法 */
.translation-button {} /* 块 */
.translation-button--primary {} /* 修饰符 */
.translation-button__icon {} /* 元素 */

/* 按功能分组 */
/* Header styles */
.header {}
.header__title {}

/* Button styles */
.button {}
.button--primary {}

/* Form styles */
.form-group {}
.form-input {}
```

#### 响应式设计
```css
/* 使用相对单位 */
.container {
  padding: 1rem;
  font-size: 1rem;
}

/* 媒体查询 */
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
}
```

### HTML 规范

#### 语义化标签
```html
<!-- 使用语义化标签 -->
<header class="header">
  <h1 class="header__title">AI Translator</h1>
</header>

<main class="main-content">
  <section class="translation-section">
    <!-- 内容 -->
  </section>
</main>

<footer class="footer">
  <!-- 页脚内容 -->
</footer>
```

#### 可访问性
```html
<!-- 添加适当的 ARIA 标签 -->
<button aria-label="翻译文本" class="translate-btn">
  <span class="translate-btn__icon">🌍</span>
  <span class="translate-btn__text">翻译</span>
</button>

<!-- 表单标签 -->
<label for="apiKey">API Key:</label>
<input 
  type="password" 
  id="apiKey" 
  name="apiKey"
  aria-required="true"
  placeholder="输入智谱AI API Key"
>
```

## 🧪 测试指南

### 功能测试

#### 翻译功能测试
```javascript
// 测试翻译功能
describe('Translation functionality', () => {
  it('should translate text correctly', async () => {
    const result = await translateText('Hello', 'zh');
    expect(result.translation).toBe('你好');
  });
  
  it('should handle API errors', async () => {
    await expect(translateText('', 'zh')).rejects.toThrow();
  });
});
```

#### UI 组件测试
```javascript
// 测试用户界面
describe('User Interface', () => {
  it('should show loading state', () => {
    const button = document.querySelector('.translate-btn');
    button.click();
    expect(button.textContent).toContain('翻译中...');
  });
});
```

### 浏览器兼容性测试

#### 测试矩阵
- Chrome 88+
- Edge 88+
- Firefox 85+
- Safari 14+

#### 测试工具
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [BrowserStack](https://www.browserstack.com/)
- [Sauce Labs](https://saucelabs.com/)

## 📝 文档规范

### 代码注释
```javascript
/**
 * 翻译文本到目标语言
 * @param {string} text - 要翻译的文本
 * @param {string} targetLanguage - 目标语言代码
 * @param {string} apiKey - API密钥
 * @returns {Promise<Object>} 翻译结果对象
 * @throws {Error} 当翻译失败时抛出错误
 */
async function translateText(text, targetLanguage, apiKey) {
  // 实现...
}
```

### API 文档
```markdown
## 翻译 API

### 端点
```
POST https://open.bigmodel.cn/api/paas/v4/chat/completions
```

### 请求体
```json
{
  "model": "glm-4.5",
  "messages": [
    {
      "role": "user",
      "content": "翻译提示词"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 1000
}
```
```

## 🎨 设计规范

### 颜色系统
```css
/* 主色调 */
:root {
  --primary-color: #667eea;
  --primary-dark: #5a67d8;
  --primary-light: #7c3aed;
  
  /* 辅助色 */
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --error-color: #dc3545;
}
```

### 字体系统
```css
/* 字体层级 */
.text-primary {
  font-size: 1.25rem;
  font-weight: 600;
}

.text-secondary {
  font-size: 1rem;
  font-weight: 400;
}

.text-caption {
  font-size: 0.875rem;
  font-weight: 400;
}
```

## 🔧 开发环境设置

### 必要工具
- **代码编辑器**: VS Code, WebStorm 等
- **浏览器**: Chrome 或 Edge (用于测试)
- **版本控制**: Git
- **Node.js**: 14+ (用于构建工具)

### 推荐插件
- **VS Code 插件**:
  - ESLint
  - Prettier
  - Live Server
  - Chrome Debugger

### 开发流程
```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建项目
npm run build

# 4. 运行测试
npm test
```

## 🚀 发布流程

### 版本管理
- 使用语义化版本 (SemVer)
- 更新 CHANGELOG.md
- 更新 manifest.json 中的版本号

### 发布步骤
1. 更新版本号
2. 更新文档
3. 运行完整测试
4. 创建 Git tag
5. 构建发布包
6. 发布到应用商店

## 📞 沟通交流

### 问题反馈
- 使用 GitHub Issues 报告问题
- 提供详细的重现步骤
- 包含错误日志和截图

### 功能建议
- 在 GitHub Discussions 中讨论
- 详细描述需求和使用场景
- 提供可能的实现方案

### 代码审查
- 尊重他人的代码
- 提供建设性的反馈
- 关注代码质量和安全性

## 📄 许可证

通过贡献代码，您同意您的贡献将在 [MIT License](LICENSE) 下发布。

---

感谢您的贡献！🎉