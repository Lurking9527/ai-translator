#!/bin/bash

# 图标转换脚本
# 将SVG文件转换为PNG格式

echo "开始转换图标文件..."

# 检查是否安装了ImageMagick
if ! command -v convert &> /dev/null; then
    echo "错误：未找到ImageMagick的convert命令"
    echo "请先安装ImageMagick："
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Windows: 从 https://imagemagick.org 下载安装"
    exit 1
fi

# 转换所有新的SVG文件为PNG
echo "转换16px图标..."
convert icon16_new.svg icon16.png

echo "转换32px图标..."
convert icon32_new.svg icon32.png

echo "转换48px图标..."
convert icon48_new.svg icon48.png

echo "转换128px图标..."
convert icon128_new.svg icon128.png

echo "转换完成！"
echo ""
echo "转换后的文件："
ls -la *.png
echo ""
echo "如果需要使用备用设计，可以手动转换："
echo "  convert icon128_modern.svg icon128_modern.png"
echo "  convert icon128_text.svg icon128_text.png"