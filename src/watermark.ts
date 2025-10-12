import { App, Modal, TFile, FileSystemAdapter, Setting, TextComponent, SliderComponent, DropdownComponent, ToggleComponent, Notice as ObsidianNotice } from 'obsidian';
import ImageWatermarkPlugin from './main';
import { I18n } from './i18n';

interface WatermarkOptions {
  text: string;
  opacity: number;
  size: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  color: string;
  useCustomPosition: boolean;
  xPosition: number;
  yPosition: number;
}

export class WatermarkModal extends Modal {
  app: App;
  plugin: ImageWatermarkPlugin;
  selectedFiles: TFile[];
  watermarkOptions: WatermarkOptions;
  previewCanvas: HTMLCanvasElement;
  selectedTemplate: string | null;
  i18n: I18n;

  constructor(app: App, plugin: ImageWatermarkPlugin, preselectedFiles: TFile[] = []) {
    super(app);
    this.app = app;
    this.plugin = plugin;
    this.selectedFiles = preselectedFiles;
    this.selectedTemplate = null;
    this.i18n = new I18n(this.plugin.settings.language);
    
    // 初始化水印选项
    this.watermarkOptions = {
      text: plugin.settings.defaultWatermarkText,
      opacity: plugin.settings.defaultOpacity,
      size: plugin.settings.defaultSize,
      position: plugin.settings.defaultPosition,
      color: '#000000', // 默认黑色
      useCustomPosition: false,
      xPosition: 50, // 百分比
      yPosition: 50 // 百分比
    };
    
    // 如果有默认模板，自动应用
    if (plugin.settings.defaultTemplate) {
      const defaultTemplate = plugin.settings.watermarkTemplates.find(t => t.name === plugin.settings.defaultTemplate);
      if (defaultTemplate) {
        this.selectedTemplate = defaultTemplate.name;
        this.watermarkOptions = {
          text: defaultTemplate.text,
          opacity: defaultTemplate.opacity,
          size: defaultTemplate.size,
          position: defaultTemplate.position,
          color: defaultTemplate.color || '#000000',
          useCustomPosition: defaultTemplate.useCustomPosition || false,
          xPosition: defaultTemplate.xPosition || 50,
          yPosition: defaultTemplate.yPosition || 50
        };
      }
    }
    
    this.previewCanvas = document.createElement('canvas');
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.className = 'watermark-modal';
    contentEl.addClass('watermark-flex-column');

    // 创建顶部标题和说明
    const header = contentEl.createDiv();
    header.addClass('watermark-header');
    header.createEl('h2', { text: this.i18n.t('ADD_WATERMARK_TITLE') });
    header.createEl('p', { text: this.i18n.t('ADD_WATERMARK_DESC') });

    // 主内容区域
    const mainContent = contentEl.createDiv();
    mainContent.addClass('watermark-main-content');

    // 功能选择区
    const functionPanel = mainContent.createDiv();
    functionPanel.addClass('watermark-function-panel');

    // 图片选择区域
    const fileSelection = functionPanel.createDiv();
    fileSelection.createEl('h3', { text: this.i18n.t('Select_Image') });
    
    // 显示已选文件
    if (this.selectedFiles.length > 0) {
      const filesList = fileSelection.createDiv();
      filesList.addClass('watermark-files-list');

      this.selectedFiles.forEach((file, index) => {
        const fileItem = filesList.createDiv();
        fileItem.addClass('watermark-file-item');

        fileItem.createSpan({ text: file.name });
        fileItem.createEl('button', { text: 'delete' }).addEventListener('click', () => {
          this.selectedFiles.splice(index, 1);
          this.onClose();
          this.onOpen();
        });
      });
    }

    // 选择文件按钮
    const selectButton = fileSelection.createEl('button', {
      text: this.i18n.t('Select_Image_Button'),
      cls: 'mod-cta'
    });

    selectButton.addEventListener('click', async () => {
        try {
          // 使用Obsidian的文件选择对话框
    // 获取文件系统适配器
    const fileSystemAdapter: any = this.app.vault.adapter;
          const folderPath = await fileSystemAdapter.getBasePath();
          
          // 创建一个隐藏的文件输入元素
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.jpg,.jpeg,.png,.gif';
          input.multiple = true; // 允许选择多个文件
          
          // 监听文件选择事件
          input.addEventListener('change', async (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
              // 获取用户选择的文件名
              const selectedFileNames = Array.from(target.files).map(file => file.name);
              
              // 查找对应的TFile对象
              const filesToAdd: TFile[] = [];
              for (const file of this.app.vault.getFiles()) {
                if (file.extension && ['jpg', 'jpeg', 'png', 'gif'].includes(file.extension.toLowerCase())) {
                  if (selectedFileNames.includes(file.name)) {
                    filesToAdd.push(file);
                  }
                }
              }
              
              // 添加选中的文件并刷新模态框
              if (filesToAdd.length > 0) {
                this.selectedFiles = [...this.selectedFiles, ...filesToAdd];
                this.onClose();
                this.onOpen();
              }
            }
          });
          
          // 触发文件选择对话框
          input.click();
        } catch (error) {
          console.error('选择文件时发生错误:', error);
          new ObsidianNotice('选择文件失败，请重试', 3000);
        }
      });

    // 水印模板选择
    const templateSelection = functionPanel.createDiv();
    templateSelection.createEl('h3', { text: this.i18n.t('WATERMARK_TEMPLATES') });
    
    const templateDropdown = new DropdownComponent(templateSelection);
    templateDropdown.addOption('', '无（使用自定义设置）');
    
    this.plugin.settings.watermarkTemplates.forEach(template => {
      templateDropdown.addOption(template.name, template.name);
    });
    
    templateDropdown.onChange((value) => {
      this.selectedTemplate = value || null;
      if (value) {
        const template = this.plugin.settings.watermarkTemplates.find(t => t.name === value);
        if (template) {
          this.watermarkOptions = {
            text: template.text,
            opacity: template.opacity,
            size: template.size,
            position: template.position,
            color: template.color || '#000000', // 使用模板颜色或默认黑色
            useCustomPosition: template.useCustomPosition || false,
            xPosition: template.xPosition || 50, // 使用模板的自定义位置或默认值
            yPosition: template.yPosition || 50 // 使用模板的自定义位置或默认值
          };
          this.updateWatermarkControls();
          this.updatePreview();
        }
      }
    });

    // 水印参数设置区域
    const watermarkSettings = functionPanel.createDiv();
    watermarkSettings.createEl('h3', { text: this.i18n.t('WATERMARK_PARAMS') });

    // 水印文字
    const textSetting = new Setting(watermarkSettings);
    textSetting
      .setName(this.i18n.t('WATERMARK_TEXT'))
      .setDesc(this.i18n.t('WATERMARK_TEXT_DESC'))
      .addText((text) => {
        this.textComponent = text;
        text
          .setPlaceholder(this.i18n.t('WATERMARK_TEXT_PLACEHOLDER'))
          .setValue(this.watermarkOptions.text)
          .onChange((value) => {
            this.watermarkOptions.text = value;
            this.selectedTemplate = null;
            templateDropdown.setValue('');
            this.updatePreview();
          });
      });

    // 透明度设置
    const opacitySetting = new Setting(watermarkSettings);
    opacitySetting
      .setName(this.i18n.t('OPACITY'))
      .setDesc(this.i18n.t('OPACITY_DESC'))
      .addSlider((slider) => {
        this.opacitySlider = slider;
        slider
          .setLimits(10, 100, 5)
          .setValue(this.watermarkOptions.opacity)
          .onChange((value) => {
            this.watermarkOptions.opacity = value;
            this.selectedTemplate = null;
            templateDropdown.setValue('');
            this.updatePreview();
          })
          .setDynamicTooltip();
      });

    // 文字大小设置
    const sizeSetting = new Setting(watermarkSettings);
    sizeSetting
      .setName(this.i18n.t('FONT_SIZE'))
      .setDesc(this.i18n.t('FONT_SIZE_DESC'))
      .addSlider((slider) => {
        this.sizeSlider = slider;
        slider
          .setLimits(8, 36, 2)
          .setValue(this.watermarkOptions.size)
          .onChange((value) => {
            this.watermarkOptions.size = value;
            this.selectedTemplate = null;
            templateDropdown.setValue('');
            this.updatePreview();
          })
          .setDynamicTooltip();
      });

    // 位置设置
    const positionSetting = new Setting(watermarkSettings);
    positionSetting
      .setName(this.i18n.t('POSITION'))
      .setDesc(this.i18n.t('POSITION_DESC'))
      .addDropdown((dropdown) => {
        this.positionDropdown = dropdown;
        dropdown
          .addOption('top-left', this.i18n.t('TOP_LEFT'))
          .addOption('top-right', this.i18n.t('TOP_RIGHT'))
          .addOption('bottom-left', this.i18n.t('BOTTOM_LEFT'))
          .addOption('bottom-right', this.i18n.t('BOTTOM_RIGHT'))
          .addOption('center', this.i18n.t('CENTER'))
          .setValue(this.watermarkOptions.position)
          .onChange((value) => {
            this.watermarkOptions.position = value as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
            this.watermarkOptions.useCustomPosition = false;
            if (this.customPositionToggle) this.customPositionToggle.setValue(false);
            this.selectedTemplate = null;
            templateDropdown.setValue('');
            this.updatePreview();
          });
      });

    // 水印颜色设置
    const colorSetting = new Setting(watermarkSettings);
    colorSetting
      .setName(this.i18n.t('WATERMARK_COLOR'))
      .setDesc(this.i18n.t('WATERMARK_COLOR_DESC'))
      .addText((text) => {
        this.colorComponent = text;
          text
            .setPlaceholder('#000000')
            .setValue(this.watermarkOptions.color)
            .onChange((value) => {
              // 更新颜色值，无论格式是否正确（drawWatermark会处理无效颜色）
              this.watermarkOptions.color = value;
              this.selectedTemplate = null;
              templateDropdown.setValue('');
              this.updatePreview();
            });
      });

    // 颜色选择器（视觉辅助）
    const colorPicker = colorSetting.controlEl.createEl('input', {
      type: 'color',
      value: this.watermarkOptions.color
    });
    colorPicker.addClass('watermark-color-picker');
    colorPicker.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (this.colorComponent) this.colorComponent.setValue(target.value);
      this.watermarkOptions.color = target.value;
      this.selectedTemplate = null;
      templateDropdown.setValue('');
      this.updatePreview();
    });

    // 自定义位置切换
    const customPositionToggle = new Setting(watermarkSettings);
    customPositionToggle
      .setName(this.i18n.t('USE_CUSTOM_POSITION'))
      .setDesc(this.i18n.t('USE_CUSTOM_POSITION_DESC'))
      .addToggle((toggle) => {
        this.customPositionToggle = toggle;
        toggle
          .setValue(this.watermarkOptions.useCustomPosition)
          .onChange((value) => {
            this.watermarkOptions.useCustomPosition = value;
            if (this.xSlider && this.ySlider) {
              this.xSlider.setDisabled(!value);
              this.ySlider.setDisabled(!value);
            }
            this.selectedTemplate = null;
            templateDropdown.setValue('');
            this.updatePreview();
          });
      });

    // X轴位置（水平）
    const xPositionSetting = new Setting(watermarkSettings);
    xPositionSetting
      .setName(this.i18n.t('HORIZONTAL_POSITION'))
      .setDesc(this.i18n.t('HORIZONTAL_POSITION_DESC'))
      .addSlider((slider) => {
        this.xSlider = slider;
        slider
          .setLimits(0, 100, 1)
          .setValue(this.watermarkOptions.xPosition)
          .setDisabled(!this.watermarkOptions.useCustomPosition)
          .onChange((value) => {
            this.watermarkOptions.xPosition = value;
            this.selectedTemplate = null;
            templateDropdown.setValue('');
            this.updatePreview();
          })
          .setDynamicTooltip();
      });

    // Y轴位置（垂直）
    const yPositionSetting = new Setting(watermarkSettings);
    yPositionSetting
      .setName(this.i18n.t('VERTICAL_POSITION'))
      .setDesc(this.i18n.t('VERTICAL_POSITION_DESC'))
      .addSlider((slider) => {
        this.ySlider = slider;
        slider
          .setLimits(0, 100, 1)
          .setValue(this.watermarkOptions.yPosition)
          .setDisabled(!this.watermarkOptions.useCustomPosition)
          .onChange((value) => {
            this.watermarkOptions.yPosition = value;
            this.selectedTemplate = null;
            templateDropdown.setValue('');
            this.updatePreview();
          })
          .setDynamicTooltip();
      });

    // 预览区域 - 放在位置调整区域的下方
    const previewSection = functionPanel.createDiv();
    previewSection.createEl('h3', { text: this.i18n.t('PREVIEW_EFFECT') });

    // 预览容器
    const previewContainer = previewSection.createDiv();
    previewContainer.classList.add('preview-container');
    previewContainer.addClass('watermark-preview-container');
    
    this.previewCanvas.addClass('watermark-preview-canvas');
    previewContainer.appendChild(this.previewCanvas);

    // 应用按钮
    const applyButton = functionPanel.createEl('button', {
      text: this.i18n.t('APPLY_WATERMARK'),
      cls: 'mod-cta watermark-apply-button'
    });

    applyButton.addEventListener('click', async () => {
      if (this.selectedFiles.length === 0) {
        alert(this.i18n.t('SELECT_AT_LEAST_ONE_IMAGE'));
        return;
      }

      await this.applyWatermarkToImages();
      this.close();
    });

    // 初始化预览
    this.updatePreview();
  }

  private textComponent: TextComponent;
  private opacitySlider: SliderComponent;
  private sizeSlider: SliderComponent;
  private positionDropdown: DropdownComponent;
  private colorComponent: TextComponent;
  private customPositionToggle: ToggleComponent;
  private xSlider: SliderComponent;
  private ySlider: SliderComponent;

  private updateWatermarkControls() {
    if (this.textComponent) this.textComponent.setValue(this.watermarkOptions.text);
    if (this.opacitySlider) this.opacitySlider.setValue(this.watermarkOptions.opacity);
    if (this.sizeSlider) this.sizeSlider.setValue(this.watermarkOptions.size);
    if (this.positionDropdown) this.positionDropdown.setValue(this.watermarkOptions.position);
    if (this.colorComponent) this.colorComponent.setValue(this.watermarkOptions.color);
    if (this.customPositionToggle) this.customPositionToggle.setValue(this.watermarkOptions.useCustomPosition);
    if (this.xSlider) {
      this.xSlider.setValue(this.watermarkOptions.xPosition);
      this.xSlider.setDisabled(!this.watermarkOptions.useCustomPosition);
    }
    if (this.ySlider) {
      this.ySlider.setValue(this.watermarkOptions.yPosition);
      this.ySlider.setDisabled(!this.watermarkOptions.useCustomPosition);
    }
  }

  private updatePreview() {
    // 检查预览画布是否存在，如果不存在则重新创建
    if (!this.previewCanvas || !this.previewCanvas.isConnected) {
      // 如果预览画布不存在或已从DOM中移除，重新创建
      const existingCanvas = document.querySelector('.preview-container canvas');
      if (existingCanvas) {
        existingCanvas.remove();
      }
      this.previewCanvas = document.createElement('canvas');
      this.previewCanvas.addClass('watermark-preview-canvas');
      
      // 将新画布添加到预览容器
      const previewContainer = document.querySelector('.preview-container');
      if (previewContainer) {
        previewContainer.appendChild(this.previewCanvas);
      }
    }

    const canvas = this.previewCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // 重置画布尺寸 - 这会清除画布内容
    canvas.width = 300;
    canvas.height = 200;

    // 显式清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制示例内容
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.i18n.t('PREVIEW_IMAGE'), canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText(this.i18n.t('PREVIEW_IMAGE_DESC'), canvas.width / 2, canvas.height / 2 + 10);

    // 绘制水印 - 确保每次都能重新绘制
    this.drawWatermark(ctx, canvas.width, canvas.height);
    
    // 强制重绘
    canvas.addClass('watermark-hidden');
    canvas.offsetHeight; // 触发重排
    canvas.removeClass('watermark-hidden');
  }

  private drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const { text, opacity, size, position, color, useCustomPosition, xPosition, yPosition } = this.watermarkOptions;
    
    // 重置画布状态
    ctx.save();
    
    // 重置所有画布属性到默认值
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    
    // 设置字体大小
    ctx.font = `${size}px sans-serif`;
    
    // 设置水印颜色并添加透明度
    const rgb = this.hexToRgb(color);
    if (rgb) {
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
    } else {
      // 如果颜色解析失败，使用默认黑色带透明度
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity / 100})`;
    }
    
    // 计算水印位置
    let x = width / 2;
    let y = height / 2;

    if (useCustomPosition) {
      // 使用自定义位置（百分比）
      x = (width * xPosition) / 100;
      y = (height * yPosition) / 100;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    } else {
      // 使用预设位置
      const margin = Math.min(size, width / 4, height / 4); // 确保边距不会太大
      switch (position) {
        case 'top-left':
          x = margin;
          y = margin;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          break;
        case 'top-right':
          x = width - margin;
          y = margin;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          break;
        case 'bottom-left':
          x = margin;
          y = height - margin;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          break;
        case 'bottom-right':
          x = width - margin;
          y = height - margin;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          break;
        case 'center':
        default:
          x = width / 2;
          y = height / 2;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          break;
      }
    }

    // 绘制水印文字
    ctx.fillText(text, x, y);
    
    // 恢复画布状态
    ctx.restore();
  }

  // 将十六进制颜色转换为RGB
  private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    // 移除#号（如果存在）
    hex = hex.replace(/^#/, '');

    // 解析十六进制值
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return { r, g, b };
  }

  private async applyWatermarkToImages() {
    const adapter = this.app.vault.adapter;

    for (const file of this.selectedFiles) {
      try {
        // 创建新文件路径
        const fileExtension = file.extension;
        const fileNameWithoutExt = file.name.replace(`.${fileExtension}`, '');
        const newFileName = `${fileNameWithoutExt}_watermark.${fileExtension}`;
        const newFilePath = `${file.parent.path}/${newFileName}`;

        // 读取图片 - 使用相对路径
        const imageData = await adapter.readBinary(file.path);
        
        // 创建图片对象
        const img = new Image();
        const imgUrl = URL.createObjectURL(new Blob([imageData]));
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = imgUrl;
        });

        // 创建画布
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('无法创建画布上下文');

        // 绘制原图
        ctx.drawImage(img, 0, 0);

        // 绘制水印
        this.drawWatermark(ctx, img.width, img.height);

        // 将画布内容转换为二进制数据
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else throw new Error('无法将画布转换为blob');
          }, `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`);
        });

        // 保存新图片
        const buffer = await blob.arrayBuffer();
        await adapter.writeBinary(newFilePath, new Uint8Array(buffer));

        // 清理URL对象
        URL.revokeObjectURL(imgUrl);

      } catch (error) {
        console.error(`处理图片 ${file.name} 时出错:`, error);
        alert(`${this.i18n.t('ERROR_PROCESSING_IMAGE')} ${file.name}: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    // 显示成功消息
    new ObsidianNotice(this.i18n.t('SUCCESS_ADD_WATERMARK', { count: this.selectedFiles.length }));
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

// 简单的通知类，用于显示操作结果
class Notice {
  constructor(message: string, duration: number = 3000) {
    const notice = document.createElement('div');
    notice.className = 'watermark-notice';
    
    // 使用CSS类而不是直接设置样式
    const style = document.createElement('style');
    style.textContent = `
      .watermark-notice {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background-color: var(--background-primary);
        color: var(--text-primary);
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .watermark-notice.show {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    notice.textContent = message;
    
    document.body.appendChild(notice);
    
    // 显示通知
    setTimeout(() => {
      notice.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
      notice.classList.remove('show');
      setTimeout(() => {
        if (notice.parentNode) {
          notice.parentNode.removeChild(notice);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    }, duration);
  }
}