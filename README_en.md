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

## License

This plugin is open-sourced under the MIT License.

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
