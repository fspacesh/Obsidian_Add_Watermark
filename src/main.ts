import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, FileSystemAdapter, TFile, SliderComponent } from 'obsidian';
import { WatermarkModal } from './watermark';
import { I18n } from './i18n';
import './styles.css';

interface ImageWatermarkPluginSettings {
  defaultWatermarkText: string;
  defaultOpacity: number;
  defaultSize: number;
  defaultPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  defaultColor: string;
  defaultTemplate: string | null; // 默认模板名称
  language: 'en' | 'zh';
  watermarkTemplates: Array<{
    name: string;
    text: string;
    opacity: number;
    size: number;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    color: string;
    useCustomPosition: boolean;
    xPosition: number;
    yPosition: number;
  }>;
}

const DEFAULT_SETTINGS: ImageWatermarkPluginSettings = {
  defaultWatermarkText: 'Confidential',
  defaultOpacity: 50,
  defaultSize: 12,
  defaultPosition: 'center',
  defaultColor: '#000000',
  defaultTemplate: null,
  language: 'en',
  watermarkTemplates: []
};

export default class ImageWatermarkPlugin extends Plugin {
  settings: ImageWatermarkPluginSettings;
  i18n: I18n;

  async onload() {
    await this.loadSettings();
    this.i18n = new I18n(this.settings.language);

    // 添加命令到 Obsidian 命令面板
    this.addCommand({
      id: 'add-watermark-to-image',
      name: this.i18n.t('ADD_WATERMARK_COMMAND'),
      callback: () => {
        new WatermarkModal(this.app, this).open();
      }
    });

    // 添加右键菜单选项（单文件）
    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        if (file instanceof TFile && ['jpg', 'jpeg', 'png', 'gif'].includes(file.extension.toLowerCase())) {
          menu.addItem((item) => {
            item
              .setTitle(this.i18n.t('ADD_WATERMARK'))
              .setIcon('image')
              .onClick(() => {
                new WatermarkModal(this.app, this, [file]).open();
              });
          });
        }
      })
    );

    // 添加右键菜单选项（多文件选择）
    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file, source, leaf) => {
        // 检查是否有多个文件被选中
        if (source === 'file-explorer') {
          // 获取文件浏览器中的所有选中文件
          const fileExplorerView = this.app.workspace.getLeavesOfType('file-explorer')[0]?.view;
          if (fileExplorerView && 'fileItems' in fileExplorerView) {
            const fileItems = (fileExplorerView as any).fileItems;
            const selectedFiles = Object.keys(fileItems)
              .map(key => fileItems[key].file)
              .filter((f: any) => 
                f instanceof TFile && ['jpg', 'jpeg', 'png', 'gif'].includes(f.extension.toLowerCase())
              ) as TFile[];
            
            if (selectedFiles.length > 1) {
              menu.addItem((item) => {
                item
                  .setTitle('为选中图片添加水印')
                  .setIcon('image')
                  .onClick(() => {
                    new WatermarkModal(this.app, this, selectedFiles).open();
                  });
              });
            }
          }
        }
      })
    );

    // 添加设置选项卡
    this.addSettingTab(new WatermarkSettingTab(this.app, this));

    // 添加功能区按钮
    this.addRibbonIcon('image', '图片水印', () => {
      // 尝试获取文件浏览器中选中的图片文件
      let selectedFiles: TFile[] = [];
      
      try {
        // 方法: 直接获取文件浏览器选中的文件
        const fileExplorerView = this.app.workspace.getLeavesOfType('file-explorer')[0]?.view;
        
        if (fileExplorerView) {
          // 检查是否有selection或getSelection方法
          if ('selection' in fileExplorerView) {
            console.log('使用selection属性获取选中文件');
            const selection = (fileExplorerView as any).selection;
            if (selection && Array.isArray(selection)) {
              selectedFiles = selection
                .filter((file: any) => 
                  file instanceof TFile && 
                  ['jpg', 'jpeg', 'png', 'gif'].includes(file.extension.toLowerCase())
                ) as TFile[];
            }
          } 
          // 检查是否有getSelection方法
          else if ('getSelection' in fileExplorerView && typeof (fileExplorerView as any).getSelection === 'function') {
            console.log('使用getSelection方法获取选中文件');
            const selection = (fileExplorerView as any).getSelection();
            if (selection && Array.isArray(selection)) {
              selectedFiles = selection
                .filter((file: any) => 
                  file instanceof TFile && 
                  ['jpg', 'jpeg', 'png', 'gif'].includes(file.extension.toLowerCase())
                ) as TFile[];
            }
          }
          // 使用原始的fileItems方法作为后备
          else if ('fileItems' in fileExplorerView) {
            console.log('使用fileItems方法获取选中文件');
            const fileItems = (fileExplorerView as any).fileItems;
            selectedFiles = Object.values(fileItems)
              .filter((item: any) => 
                item && item.file instanceof TFile && 
                item.selected && 
                ['jpg', 'jpeg', 'png', 'gif'].includes(item.file.extension.toLowerCase())
              )
              .map((item: any) => item.file) as TFile[];
          }
        }
        
        console.log(`成功获取到 ${selectedFiles.length} 个选中的图片文件`);
        if (selectedFiles.length > 0) {
          console.log('选中的文件列表:', selectedFiles.map(f => f.name));
        }
      } catch (error) {
        console.error('获取选中文件时发生错误:', error);
      }
      
      // 传递选中的文件（如果有）给WatermarkModal
      new WatermarkModal(this.app, this, selectedFiles).open();
    });
  }

  onunload() {
    console.log('卸载图片水印插件');
  }

  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...await this.loadData() };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class WatermarkSettingTab extends PluginSettingTab {
  plugin: ImageWatermarkPlugin;

  constructor(app: App, plugin: ImageWatermarkPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: this.plugin.i18n.t('IMAGE_WATERMARK_SETTINGS') });

    // 默认水印文字设置
    new Setting(containerEl)
      .setName(this.plugin.i18n.t('DEFAULT_WATERMARK_TEXT'))
      .setDesc(this.plugin.i18n.t('DEFAULT_WATERMARK_TEXT_DESC'))
      .addText((text) =>
        text
          .setPlaceholder(this.plugin.i18n.t('ENTER_WATERMARK_TEXT'))
          .setValue(this.plugin.settings.defaultWatermarkText)
          .onChange(async (value) => {
            this.plugin.settings.defaultWatermarkText = value;
            await this.plugin.saveSettings();
          })
      );

    // 默认透明度设置
    new Setting(containerEl)
      .setName(this.plugin.i18n.t('DEFAULT_OPACITY'))
      .setDesc(this.plugin.i18n.t('DEFAULT_OPACITY_DESC'))
      .addSlider((slider) =>
        slider
          .setLimits(10, 100, 5)
          .setValue(this.plugin.settings.defaultOpacity)
          .onChange(async (value) => {
            this.plugin.settings.defaultOpacity = value;
            await this.plugin.saveSettings();
          })
          .setDynamicTooltip()
      );

    // 默认大小设置
    new Setting(containerEl)
      .setName(this.plugin.i18n.t('DEFAULT_SIZE'))
      .setDesc(this.plugin.i18n.t('DEFAULT_SIZE_DESC'))
      .addSlider((slider) =>
        slider
          .setLimits(8, 36, 2)
          .setValue(this.plugin.settings.defaultSize)
          .onChange(async (value) => {
            this.plugin.settings.defaultSize = value;
            await this.plugin.saveSettings();
          })
          .setDynamicTooltip()
      );

    // 默认位置设置
    new Setting(containerEl)
      .setName(this.plugin.i18n.t('DEFAULT_POSITION'))
      .setDesc(this.plugin.i18n.t('DEFAULT_POSITION_DESC'))
      .addDropdown((dropdown) =>
        dropdown
          .addOption('top-left', this.plugin.i18n.t('TOP_LEFT'))
          .addOption('top-right', this.plugin.i18n.t('TOP_RIGHT'))
          .addOption('bottom-left', this.plugin.i18n.t('BOTTOM_LEFT'))
          .addOption('bottom-right', this.plugin.i18n.t('BOTTOM_RIGHT'))
          .addOption('center', this.plugin.i18n.t('CENTER'))
          .setValue(this.plugin.settings.defaultPosition)
          .onChange(async (value) => {
            this.plugin.settings.defaultPosition = value as any;
            await this.plugin.saveSettings();
          })
      );

    // 语言设置
    new Setting(containerEl)
      .setName(this.plugin.i18n.t('INTERFACE_LANGUAGE'))
      .setDesc(this.plugin.i18n.t('INTERFACE_LANGUAGE_DESC'))
      .addDropdown((dropdown) =>
        dropdown
          .addOption('en', 'English')
          .addOption('zh', '中文')
          .setValue(this.plugin.settings.language)
          .onChange(async (value) => {
            this.plugin.settings.language = value as 'en' | 'zh';
            this.plugin.i18n.setLanguage(value as 'en' | 'zh');
            await this.plugin.saveSettings();
            this.display(); // 重新显示设置面板以应用语言变更
          })
      );

    // 默认颜色设置
    new Setting(containerEl)
      .setName(this.plugin.i18n.t('DEFAULT_COLOR'))
      .setDesc(this.plugin.i18n.t('DEFAULT_COLOR_DESC'))
      .addText((text) =>
        text
          .setPlaceholder('#000000')
          .setValue(this.plugin.settings.defaultColor)
          .onChange(async (value) => {
            // 简单验证颜色格式
            if (/^#[0-9A-F]{6}$/i.test(value) || /^#[0-9A-F]{3}$/i.test(value)) {
              this.plugin.settings.defaultColor = value;
              await this.plugin.saveSettings();
            }
          })
      )
      .then((setting) => {
        // 添加颜色选择器
        const colorPicker = setting.controlEl.createEl('input', {
          type: 'color',
          value: this.plugin.settings.defaultColor
        });
        colorPicker.style.marginLeft = '10px';
        colorPicker.style.cursor = 'pointer';
        colorPicker.addEventListener('input', async (event) => {
          const target = event.target as HTMLInputElement;
          this.plugin.settings.defaultColor = target.value;
          // 更新文本输入框
          const textInput = setting.controlEl.querySelector('input[type="text"]') as HTMLInputElement;
          if (textInput) textInput.value = target.value;
          await this.plugin.saveSettings();
        });
      });

    // 默认模板设置
    new Setting(containerEl)
      .setName('Default Template')
      .setDesc('Select default watermark template (leave empty to use custom settings)')
      .addDropdown((dropdown) => {
        dropdown
          .addOption('', 'None (use custom settings)');
        
        this.plugin.settings.watermarkTemplates.forEach(template => {
          dropdown.addOption(template.name, template.name);
        });
        
        dropdown
          .setValue(this.plugin.settings.defaultTemplate || '')
          .onChange(async (value) => {
            this.plugin.settings.defaultTemplate = value || null;
            await this.plugin.saveSettings();
          });
      });

    // 水印模板管理区域
    containerEl.createEl('h3', { text: this.plugin.i18n.t('WATERMARK_TEMPLATE_MANAGEMENT') });
    containerEl.createEl('p', { text: this.plugin.i18n.t('WATERMARK_TEMPLATE_MANAGEMENT_DESC') });

    // 显示已保存的模板
    this.plugin.settings.watermarkTemplates.forEach((template, index) => {
      const templateEl = containerEl.createDiv();
      templateEl.style.border = '1px solid var(--background-modifier-border)';
      templateEl.style.padding = '10px';
      templateEl.style.borderRadius = '4px';
      templateEl.style.marginBottom = '10px';

      templateEl.createEl('div', { text: `${this.plugin.i18n.t('TEMPLATE_NAME')}: ${template.name}` });
      templateEl.createEl('div', { text: `${this.plugin.i18n.t('WATERMARK_TEXT')}: ${template.text}` });
      templateEl.createEl('div', { text: `${this.plugin.i18n.t('OPACITY')}: ${template.opacity}%, ${this.plugin.i18n.t('FONT_SIZE')}: ${template.size}px, ${this.plugin.i18n.t('POSITION')}: ${this.getPositionText(template.position)}` });
      
      // 添加颜色显示
      const colorContainer = templateEl.createEl('div');
      colorContainer.appendText(`${this.plugin.i18n.t('COLOR')}: `);
      const colorBox = colorContainer.createEl('span');
      colorBox.style.display = 'inline-block';
      colorBox.style.width = '20px';
      colorBox.style.height = '20px';
      colorBox.style.backgroundColor = template.color;
      colorBox.style.border = '1px solid var(--background-modifier-border)';
      colorBox.style.borderRadius = '3px';
      colorBox.style.marginLeft = '5px';
      colorBox.title = template.color;

      templateEl.createEl('button', {
        text: this.plugin.i18n.t('DELETE')
      }).addEventListener('click', async () => {
        this.plugin.settings.watermarkTemplates.splice(index, 1);
        await this.plugin.saveSettings();
        this.display();
      });
    });

    // 添加新模板按钮
    new Setting(containerEl)
      .addButton((btn) =>
        btn
          .setButtonText(this.plugin.i18n.t('ADD_NEW_TEMPLATE'))
          .setCta()
          .onClick(async () => {
            // 这里可以打开一个模态框来设置新模板
            const newTemplateModal = new AddTemplateModal(this.app, this.plugin);
            newTemplateModal.onClose = () => this.display();
            newTemplateModal.open();
          })
      );
  }

  private getPositionText(position: string): string {
    const positionMap: Record<string, string> = {
      'top-left': this.plugin.i18n.t('TOP_LEFT'),
      'top-right': this.plugin.i18n.t('TOP_RIGHT'),
      'bottom-left': this.plugin.i18n.t('BOTTOM_LEFT'),
      'bottom-right': this.plugin.i18n.t('BOTTOM_RIGHT'),
      'center': this.plugin.i18n.t('CENTER')
    };
    return positionMap[position] || position;
  }
}

class AddTemplateModal extends Modal {
  plugin: ImageWatermarkPlugin;
  templateName: string;
  watermarkText: string;
  opacity: number;
  size: number;
  position: string;
  color: string;
  useCustomPosition: boolean;
  xPosition: number;
  yPosition: number;
  
  // 组件引用
  private xSlider: SliderComponent;
  private ySlider: SliderComponent;
  private previewCanvas: HTMLCanvasElement;
  
  constructor(app: App, plugin: ImageWatermarkPlugin) {
    super(app);
    this.plugin = plugin;
    this.templateName = '';
    this.watermarkText = plugin.settings.defaultWatermarkText;
    this.opacity = plugin.settings.defaultOpacity;
    this.size = plugin.settings.defaultSize;
    this.position = plugin.settings.defaultPosition;
    this.color = plugin.settings.defaultColor;
    this.useCustomPosition = false;
    this.xPosition = 50;
    this.yPosition = 50;
    this.previewCanvas = document.createElement('canvas');
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: this.plugin.i18n.t('ADD_WATERMARK_TEMPLATE') });

    // 模板名称
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('TEMPLATE_NAME'))
      .setDesc('Name your template')
      .addText((text) =>
        text
          .setPlaceholder(this.plugin.i18n.t('TEMPLATE_NAME_PLACEHOLDER'))
          .onChange((value) => (this.templateName = value))
      );

    // 水印文字
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('WATERMARK_TEXT'))
      .setDesc(this.plugin.i18n.t('WATERMARK_TEXT_DESC'))
      .addText((text) =>
        text
          .setPlaceholder(this.plugin.i18n.t('WATERMARK_TEXT_PLACEHOLDER'))
          .setValue(this.watermarkText)
          .onChange((value) => (this.watermarkText = value))
      );

    // 透明度
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('OPACITY'))
      .setDesc(this.plugin.i18n.t('OPACITY_DESC'))
      .addSlider((slider) =>
        slider
          .setLimits(10, 100, 5)
          .setValue(this.opacity)
          .onChange((value) => {
            this.opacity = value;
            this.updatePreview();
          })
          .setDynamicTooltip()
      );

    // 文字大小
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('FONT_SIZE'))
      .setDesc(this.plugin.i18n.t('FONT_SIZE_DESC'))
      .addSlider((slider) =>
        slider
          .setLimits(8, 36, 2)
          .setValue(this.size)
          .onChange((value) => {
            this.size = value;
            this.updatePreview();
          })
          .setDynamicTooltip()
      );

    // 位置
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('POSITION'))
      .setDesc(this.plugin.i18n.t('POSITION_DESC'))
      .addDropdown((dropdown) => {
        dropdown
          .addOption('top-left', this.plugin.i18n.t('TOP_LEFT'))
          .addOption('top-right', this.plugin.i18n.t('TOP_RIGHT'))
          .addOption('bottom-left', this.plugin.i18n.t('BOTTOM_LEFT'))
          .addOption('bottom-right', this.plugin.i18n.t('BOTTOM_RIGHT'))
          .addOption('center', this.plugin.i18n.t('CENTER'))
          .setValue(this.position)
          .onChange((value) => {
            this.position = value;
            this.updatePreview();
          });
      });

    // 颜色
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('WATERMARK_COLOR'))
      .setDesc(this.plugin.i18n.t('WATERMARK_COLOR_DESC'))
      .addText((text) =>
        text
          .setPlaceholder(this.plugin.i18n.t('COLOR_PLACEHOLDER'))
          .setValue(this.color)
          .onChange((value) => {
            // 简单验证颜色格式
            if (/^#[0-9A-F]{6}$/i.test(value) || /^#[0-9A-F]{3}$/i.test(value)) {
              this.color = value;
            }
            this.updatePreview();
          })
      )
      .then((setting) => {
        // 添加颜色选择器
        const colorPicker = setting.controlEl.createEl('input', {
          type: 'color',
          value: this.color
        });
        colorPicker.style.marginLeft = '10px';
        colorPicker.style.cursor = 'pointer';
        colorPicker.addEventListener('input', (event) => {
          const target = event.target as HTMLInputElement;
          this.color = target.value;
          // 更新文本输入框
          const textInput = setting.controlEl.querySelector('input[type="text"]') as HTMLInputElement;
          if (textInput) textInput.value = target.value;
          this.updatePreview();
        });
      });

    // 自定义位置切换
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('USE_CUSTOM_POSITION'))
      .setDesc(this.plugin.i18n.t('USE_CUSTOM_POSITION_DESC'))
      .addToggle((toggle) =>
        toggle
          .setValue(this.useCustomPosition)
          .onChange((value) => {
            this.useCustomPosition = value;
            // 更新滑块禁用状态
            if (this.xSlider) this.xSlider.setDisabled(!value);
            if (this.ySlider) this.ySlider.setDisabled(!value);
            this.updatePreview();
          })
      );

    // X轴位置（水平）
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('HORIZONTAL_POSITION'))
      .setDesc(this.plugin.i18n.t('HORIZONTAL_POSITION_DESC'))
      .addSlider((slider) => {
        this.xSlider = slider;
        return slider
          .setLimits(0, 100, 1)
          .setValue(this.xPosition)
          .setDisabled(!this.useCustomPosition)
          .onChange((value) => {
            this.xPosition = value;
            this.updatePreview();
          })
          .setDynamicTooltip();
      });

    // Y轴位置（垂直）
    new Setting(contentEl)
      .setName(this.plugin.i18n.t('VERTICAL_POSITION'))
      .setDesc(this.plugin.i18n.t('VERTICAL_POSITION_DESC'))
      .addSlider((slider) => {
        this.ySlider = slider;
        return slider
          .setLimits(0, 100, 1)
          .setValue(this.yPosition)
          .setDisabled(!this.useCustomPosition)
          .onChange((value) => {
            this.yPosition = value;
            this.updatePreview();
          })
          .setDynamicTooltip();
      });

    // 预览区域
    contentEl.createEl('h3', { text: this.plugin.i18n.t('PREVIEW_EFFECT') });
    const previewContainer = contentEl.createDiv();
    previewContainer.style.border = '1px solid var(--background-modifier-border)';
    previewContainer.style.borderRadius = '4px';
    previewContainer.style.overflow = 'hidden';
    previewContainer.style.marginBottom = '20px';
    
    this.previewCanvas.style.maxWidth = '100%';
    this.previewCanvas.style.maxHeight = '100%';
    previewContainer.appendChild(this.previewCanvas);
    
    // 初始化预览
    this.updatePreview();

    // 保存按钮
    const saveBtn = contentEl.createEl('button', {
      text: this.plugin.i18n.t('SAVE_TEMPLATE'),
      cls: 'mod-cta'
    });

    saveBtn.addEventListener('click', async () => {
      if (!this.templateName.trim()) {
        alert(this.plugin.i18n.t('PLEASE_ENTER_TEMPLATE_NAME'));
        return;
      }

      this.plugin.settings.watermarkTemplates.push({
        name: this.templateName.trim(),
        text: this.watermarkText,
        opacity: this.opacity,
        size: this.size,
        position: this.position as any,
        color: this.color,
        useCustomPosition: this.useCustomPosition,
        xPosition: this.xPosition,
        yPosition: this.yPosition
      });

      await this.plugin.saveSettings();
      this.close();
    });
  }

  // 更新预览
  private updatePreview() {
    const canvas = this.previewCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    canvas.width = 300;
    canvas.height = 200;

    // 绘制背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制示例内容
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('预览图像', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('此为模板预览效果', canvas.width / 2, canvas.height / 2 + 10);

    // 绘制水印预览
    this.drawWatermarkPreview(ctx, canvas.width, canvas.height);
  }
  
  // 绘制水印预览
  private drawWatermarkPreview(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const { watermarkText: text, opacity, size, position, color, useCustomPosition, xPosition, yPosition } = this;
    
    // 设置水印样式
    // 解析颜色并添加透明度
    const rgb = this.hexToRgb(color);
    if (rgb) {
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
    }
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 计算水印位置
    let x = width / 2;
    let y = height / 2;

    if (useCustomPosition) {
      // 使用自定义位置（百分比）
      x = (width * xPosition) / 100;
      y = (height * yPosition) / 100;
    } else {
      // 使用预设位置
      switch (position) {
        case 'top-left':
          x = size * 2;
          y = size * 2;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          break;
        case 'top-right':
          x = width - size * 2;
          y = size * 2;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          break;
        case 'bottom-left':
          x = size * 2;
          y = height - size * 2;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          break;
        case 'bottom-right':
          x = width - size * 2;
          y = height - size * 2;
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
  
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}