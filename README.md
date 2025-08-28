# AI Translator - 智能翻译插件

<div align="center">

![AI Translator Logo](icons/icon128.png)

**基于智谱AI的智能浏览器翻译插件**

[![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore/detail/)
[![Edge](https://img.shields.io/badge/Edge-0078D4?style=for-the-badge&logo=microsoftedge&logoColor=white)](https://microsoftedge.microsoft.com/addons)
[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0-green.svg)](manifest.json)

</div>

---

## 📖 简介

AI Translator 是一个基于智谱AI GLM模型的智能翻译浏览器插件，支持词汇和句子的翻译，提供详细的翻译结果包括读音、含义解释、词性和用法案例。

### 🎬 演示动图

![插件使用演示](./image/demo.gif)

### 🎯 主要功能

- 🌍 **智能翻译** - 基于智谱AI的强大翻译能力
- 🎯 **划词翻译** - 选中网页文本即可翻译
- 📚 **详细解析** - 提供读音、词性、含义解释和用法案例
- 📝 **历史记录** - 本地存储翻译历史，支持查看和管理
- 🎨 **现代界面** - 简洁美观的用户界面设计
- 🔧 **灵活配置** - 支持API Key和模型选择

---

## 🚀 安装指南

### 方式一：开发者模式安装

1. **下载插件文件**

   ```bash
   git clone https://github.com/Lurking9527/ai-translator.git
   cd ai-translator
   ```
2. **启用开发者模式**

   - Chrome/Edge: 访问 `chrome://extensions/`
   - Firefox: 访问 `about:addons`
3. **加载插件**

   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹
4. **配置API Key**

   - 点击插件图标打开设置
   - 输入智谱AI API Key
   - 选择模型（GLM-4.5 或 GLM-4.5-Air）

### 方式二：应用商店安装

> 🚧 即将发布到Chrome Web Store和Microsoft Edge Add-ons

---

## 🎮 使用方法

### 1. 插件内翻译

1. 点击浏览器工具栏中的插件图标
2. 在输入框中输入要翻译的文本
3. 选择目标语言（中文/英文）
4. 点击"翻译"按钮或按Enter键
5. 查看详细的翻译结果

### 2. 划词翻译

1. 在网页上选中要翻译的文本
2. 点击出现的 🌍 翻译按钮
3. 插件会自动打开并开始翻译
4. 查看翻译结果

### 3. 快捷键支持

- `Enter` - 快速翻译
- `Shift + Enter` - 换行

---

## ⚙️ 配置说明

### API Key 设置

1. 获取智谱AI API Key:

   - 访问 [智谱AI开放平台](https://www.bigmodel.cn/invite?icode=wIVx3VnUIStw9%2FfZRMafhpmwcr074zMJTpgMb8zZZvg%3D)
   - 注册并登录账户
   - 开启实名认证，填写个人信息，领取免费的API使用额度
   - 创建API Key
2. 在插件中配置:

   - 打开插件设置页面
   - 输入API Key
   - 选择模型类型
   - 点击保存

### 模型选择

- **GLM-4.5** - 最新版本，翻译质量最高
- **GLM-4.5-Air** - 轻量版本，响应速度更快

---

## 📋 功能特性

### 🎯 智能翻译

- **自动语言识别** - 智能识别输入文本的语言
- **双向翻译** - 支持中英文互译
- **上下文理解** - 基于AI的深度语义理解

### 📚 详细解析

对于**英文文本**，提供：

- 🗣️ **翻译结果** - 准确的中文翻译
- 🔊 **读音** - 音标或拼音标注
- 📖 **词性** - 名词、动词、形容词等
- 💡 **含义解释** - 详细的含义和用法
- 📝 **用法案例** - 实际使用例句

对于**中文文本**，提供：

- 🔤 **拼音标注** - 完整的拼音和声调
- 📊 **词性分析** - 词汇的语法属性
- 🎯 **含义解释** - 字面意思和引申义
- 📜 **成语典故** - 成语来源和背景故事
- 💡 **使用案例** - 实际应用例句

### 📝 历史记录

- **自动保存** - 翻译结果自动保存到本地
- **快速查看** - 通过历史按钮查看所有记录
- **便捷管理** - 支持清空历史记录
- **时间排序** - 按时间顺序排列翻译记录

### 🎨 界面设计

- **现代化UI** - 采用渐变色彩和现代设计
- **响应式布局** - 适配不同屏幕尺寸
- **直观操作** - 简洁明了的用户界面
- **美观图标** - 专业的SVG图标设计

---

## 🛠️ 技术架构

### 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Chrome Extension API, Service Worker
- **AI服务**: 智谱AI GLM-4.5 API
- **存储**: Chrome Storage API (本地存储)

### 项目结构

```
ai-translator/
├── manifest.json              # 插件配置文件
├── background.js             # 后台服务脚本
├── content.js                # 内容脚本（划词翻译）
├── content.css               # 内容样式
├── popup.html                # 弹窗页面
├── popup.js                  # 弹窗逻辑
├── popup.css                 # 弹窗样式
├── icons/                    # 图标资源
│   ├── icon16.png/svg       # 16x16 图标
│   ├── icon32.png/svg       # 32x32 图标
│   ├── icon48.png/svg       # 48x48 图标
│   └── icon128.png/svg      # 128x128 图标
├── convert_icons.sh         # 图标转换脚本
└── README.md                 # 项目说明文档
```

### API 集成

```javascript
// 翻译API调用示例
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: 'glm-4.5',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 1000
  })
});
```

---

## 🔧 开发指南

### 本地开发

1. **克隆项目**

   ```bash
   git clone https://github.com/Lurking9527/ai-translator.git
   cd ai-translator
   ```
2. **安装依赖**

   ```bash
   # 无需安装依赖，纯前端项目
   ```
3. **加载插件**

   - 在浏览器中启用开发者模式
   - 加载项目文件夹
4. **调试开发**

   - 使用浏览器开发者工具调试
   - 查看控制台日志信息

### 自定义配置

1. **修改API配置**

   ```javascript
   // manifest.json
   "host_permissions": [
     "https://open.bigmodel.cn/*"
   ]
   ```
2. **自定义样式**

   ```css
   /* popup.css */
   .container {
     /* 自定义样式 */
   }
   ```
3. **添加新功能**

   ```javascript
   // popup.js
   class PopupManager {
     // 添加新方法
   }
   ```

---

## 🐛 故障排除

### 常见问题

#### 1. 插件无法加载

**解决方案**：

- 检查浏览器版本是否支持
- 确认插件文件完整性
- 查看浏览器控制台错误信息

#### 2. API Key 配置失败

**解决方案**：

- 确认API Key有效性
- 检查网络连接
- 验证智谱AI账户状态

#### 3. 翻译功能异常

**解决方案**：

- 检查API调用限制
- 确认文本格式正确
- 查看网络请求状态

#### 4. 划词翻译不工作

**解决方案**：

- 刷新页面重试
- 检查插件权限设置
- 确认content script加载正常

### 调试技巧

1. **查看控制台日志**

   ```javascript
   // 打开开发者工具查看详细日志
   console.log('Debug information');
   ```
2. **检查API响应**

   ```javascript
   // 检查网络请求状态
   fetch(apiUrl)
     .then(response => console.log(response))
     .catch(error => console.error(error));
   ```
3. **验证存储数据**

   ```javascript
   // 检查本地存储
   chrome.storage.local.get(['data'], (result) => {
     console.log(result);
   });
   ```

---

### 代码规范

- 使用ES6+语法
- 遵循现有代码风格
- 添加必要的注释
- 确保功能完整测试

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- [智谱AI](https://open.bigmodel.cn/) - 提供强大的AI翻译API
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/) - 浏览器扩展技术支持
- [SVG Icons](https://icons8.com/) - 图标设计灵感

</div>
