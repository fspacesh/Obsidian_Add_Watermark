# Obsidian Image Watermark Plugin

Add custom watermarks to images in Obsidian notes to protect your intellectual property.

## Features

### Basic Features
- **Image Watermarking**: Add text watermarks to selected images with customizable position, transparency, and size
- **Batch Processing**: Support batch watermarking for single or multiple image files
- **File Management**: Generated watermarked images are automatically saved with `_watermark` suffix, without overwriting original files

### Highlight Features
- **Watermark Templates**: Provides preset watermark templates, supports customization and saving personal frequently-used watermark styles for easy reuse
- **Real-time Preview**: Preview watermark effects before applying
- **Drag-and-Drop Position Adjustment**: Supports adjusting watermark position via drag-and-drop

## Installation

### Method 1: Install through Obsidian Community Plugin Market (Pending Review)
1. Open Settings in Obsidian
2. Click on the "Community Plugins" tab
3. Enable "Safe Mode" toggle
4. Click the "Browse Community Plugins" button
5. Search for "Image Watermark" and install

### Method 2: Manual Installation
1. Download the latest version of the plugin release package (zip file)
2. Extract to your Obsidian vault's `.obsidian/plugins/` directory
3. Ensure the extracted folder name is `obsidian-image-watermark`
4. Restart Obsidian
5. Enable the plugin in "Community Plugins" settings

## Usage

### Adding Watermark to Single Image
1. Right-click on an image file in the file explorer
2. Select the "Add Watermark" option
3. Set watermark parameters in the popup window
4. Click the "Apply Watermark" button

### Adding Watermark to Multiple Images
1. Open the watermark tool via ribbon icon or command palette
2. Click the "Select Image Files" button to select multiple images
3. Set watermark parameters
4. Click the "Apply Watermark" button

### Using Watermark Templates
1. Create and save watermark templates in plugin settings
2. When adding watermarks, select a saved template from the dropdown list
3. Apply watermark

## Configuration Options

The plugin provides the following configuration options (in settings):
- **Default Watermark Text**: Default watermark text used when not specified
- **Default Transparency**: Default watermark transparency (0-100)
- **Default Font Size**: Default watermark font size (pixels)
- **Default Position**: Default watermark position (Top Left, Top Right, Bottom Left, Bottom Right, Center)
- **Watermark Templates**: Manage commonly used watermark templates

## Interface Description

The plugin provides a clean settings panel with a functional selection area on the left and a preview and parameter adjustment area on the right:
- **Left Panel**: Contains image selection, watermark template selection, and watermark parameter settings
- **Right Panel**: Real-time preview of watermark effects, supporting drag-and-drop position adjustment

## Technical Details

- This plugin uses HTML Canvas API to process images and add watermarks
- Generated watermarked images are saved in the same directory as the original images with the filename format `original_filename_watermark.extension`
- Supported image formats: JPG, PNG, GIF

## Notes
- Please ensure you have copyright or usage rights for the images. This plugin is only for protecting your intellectual property
- Processing large images may consume significant system resources, please be patient
- If you encounter issues during use, try restarting Obsidian or contact the plugin developer

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Commit your changes with a clear message
5. Push to your branch
6. Create a pull request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This plugin is open-sourced under the MIT License. See the [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0
- Initial version release
- Support for text watermark addition
- Support for customizing watermark position, transparency, and size
- Support for watermark template functionality
- Support for batch image processing

## Feedback and Suggestions

If you have any questions, suggestions, or feature requests, please submit an issue or pull request in the GitHub repository.

Hope this plugin helps you better protect your image intellectual property!



# Obsidian 图片水印插件

为 Obsidian 笔记中的图片添加自定义水印，保护您的知识产权。

## 功能特点

### 基础功能
- **图片水印**：支持为选中的图片添加文字水印，可自定义水印位置、透明度和大小
- **批量处理**：支持对单个或多个图片文件进行批量水印添加操作
- **文件管理**：生成的带水印图片自动保存为原文件名_watermark格式，不覆盖原文件

### 亮点功能
- **水印模板**：提供预设水印模板，支持自定义并保存个人常用水印样式，方便重复使用
- **实时预览**：在应用水印前可预览效果
- **拖拽式位置调整**：支持通过拖拽方式调整水印位置

## 安装方法

### 方法一：通过 Obsidian 社区插件市场安装（待审核）
1. 在 Obsidian 中打开设置
2. 点击 "第三方插件" 选项卡
3. 开启 "安全模式" 开关
4. 点击 "浏览社区插件" 按钮
5. 搜索 "图片水印" 并安装

### 方法二：手动安装
1. 下载最新版本的插件发布包（zip 文件）
2. 解压到您的 Obsidian 笔记库的 `.obsidian/plugins/` 目录下
3. 确保解压后的文件夹名称为 `obsidian-image-watermark`
4. 重启 Obsidian
5. 在设置中的 "第三方插件" 中启用该插件

## 使用方法

### 添加水印到单个图片
1. 在文件浏览器中右键点击图片文件
2. 选择 "添加水印" 选项
3. 在弹出的窗口中设置水印参数
4. 点击 "应用水印" 按钮

### 添加水印到多个图片
1. 通过功能区图标或命令面板打开水印工具
2. 点击 "选择图片文件" 按钮选择多个图片
3. 设置水印参数
4. 点击 "应用水印" 按钮

### 使用水印模板
1. 在插件设置中创建和保存水印模板
2. 在添加水印时，从模板下拉列表中选择已保存的模板
3. 应用水印

## 配置选项

插件提供以下配置选项（在设置中）：
- **默认水印文字**：未指定时使用的默认水印文字
- **默认透明度**：水印的默认透明度（0-100）
- **默认文字大小**：水印文字的默认大小（像素）
- **默认位置**：水印的默认位置（左上角、右上角、左下角、右下角、中心）
- **水印模板**：管理常用的水印模板

## 界面说明

插件提供简洁的设置面板，左侧为功能选择区，右侧为预览和参数调整区：
- **左侧面板**：包含图片选择、水印模板选择和水印参数设置
- **右侧面板**：实时预览水印效果，支持拖拽调整位置

## 技术说明

- 本插件使用 HTML Canvas API 处理图片和添加水印
- 生成的带水印图片会保存在与原图片相同的目录下，文件名为 `原文件名_watermark.扩展名`
- 支持的图片格式：JPG、PNG、GIF

## 注意事项
- 请确保您有图片的版权或使用权，本插件仅用于保护您的知识产权
- 处理大图片可能会消耗较多系统资源，请耐心等待
- 如果在使用过程中遇到问题，请尝试重启 Obsidian 或联系插件开发者

## 许可证

本插件采用 MIT 许可证开源。

## 更新日志

### 1.0.0
- 初始版本发布
- 支持文字水印添加
- 支持自定义水印位置、透明度和大小
- 支持水印模板功能
- 支持批量处理图片

## 反馈与建议

如果您有任何问题、建议或功能请求，请在 GitHub 仓库中提交 issue 或 pull request。

希望这个插件能帮助您更好地保护您的图片知识产权！
