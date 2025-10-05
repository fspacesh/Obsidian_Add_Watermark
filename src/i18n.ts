// 国际化支持

interface TranslationMap {
  [key: string]: {
    en: string;
    zh: string;
  };
}

export const translations: TranslationMap = {
  // 主模态框
  'ADD_WATERMARK_TITLE': { en: 'Add Image Watermark', zh: '添加图片水印' },
  'ADD_WATERMARK_DESC': { en: 'Select images and set watermark parameters', zh: '选择图片并设置水印参数' },
  'SELECT_IMAGES': { en: 'Select Images', zh: '选择图片' },
  'SELECT_IMAGE_FILES': { en: 'Select Image Files', zh: '选择图片文件' },
  'WATERMARK_TEMPLATES': { en: 'Watermark Templates', zh: '水印模板' },
  'WATERMARK_PARAMS': { en: 'Watermark Parameters', zh: '水印参数' },
  'PREVIEW_EFFECT': { en: 'Preview Effect', zh: '预览效果' },
  'APPLY_WATERMARK': { en: 'Apply Watermark', zh: '应用水印' },
  
  // 水印参数
  'WATERMARK_TEXT': { en: 'Watermark Text', zh: '水印文字' },
  'WATERMARK_TEXT_DESC': { en: 'Enter the watermark text', zh: '输入要添加的水印文字' },
  'WATERMARK_TEXT_PLACEHOLDER': { en: 'Enter watermark text', zh: '输入水印文字' },
  'OPACITY': { en: 'Opacity', zh: '透明度' },
  'OPACITY_DESC': { en: 'Set watermark opacity', zh: '设置水印的透明度' },
  'FONT_SIZE': { en: 'Font Size', zh: '文字大小' },
  'FONT_SIZE_DESC': { en: 'Set watermark font size (pixels)', zh: '设置水印文字的大小（像素）' },
  'POSITION': { en: 'Position', zh: '水印位置' },
  'POSITION_DESC': { en: 'Select watermark position in image', zh: '选择水印在图片中的位置' },
  'WATERMARK_COLOR': { en: 'Watermark Color', zh: '水印颜色' },
  'WATERMARK_COLOR_DESC': { en: 'Select watermark text color', zh: '选择水印文字的颜色' },
  'COLOR_PLACEHOLDER': { en: '#000000', zh: '#000000' },
  'USE_CUSTOM_POSITION': { en: 'Use Custom Position', zh: '使用自定义位置' },
  'USE_CUSTOM_POSITION_DESC': { en: 'Check to freely adjust watermark position', zh: '勾选后可以自由调整水印位置' },
  'HORIZONTAL_POSITION': { en: 'Horizontal Position', zh: '水平位置' },
  'HORIZONTAL_POSITION_DESC': { en: 'Adjust watermark horizontal position (percentage)', zh: '调整水印的水平位置（百分比）' },
  'VERTICAL_POSITION': { en: 'Vertical Position', zh: '垂直位置' },
  'VERTICAL_POSITION_DESC': { en: 'Adjust watermark vertical position (percentage)', zh: '调整水印的垂直位置（百分比）' },
  
  // 位置选项
  'TOP_LEFT': { en: 'Top Left', zh: '左上角' },
  'TOP_RIGHT': { en: 'Top Right', zh: '右上角' },
  'BOTTOM_LEFT': { en: 'Bottom Left', zh: '左下角' },
  'BOTTOM_RIGHT': { en: 'Bottom Right', zh: '右下角' },
  'CENTER': { en: 'Center', zh: '中心' },
  
  // 设置页面
  'INTERFACE_LANGUAGE': { en: 'Interface Language', zh: '界面语言' },
  'INTERFACE_LANGUAGE_DESC': { en: 'Select interface language', zh: '选择界面语言' },
  'IMAGE_WATERMARK_SETTINGS': { en: 'Image Watermark Settings', zh: '图片水印插件设置' },
  'DEFAULT_WATERMARK_TEXT': { en: 'Default Watermark Text', zh: '默认水印文字' },
  'DEFAULT_WATERMARK_TEXT_DESC': { en: 'Default text for watermark', zh: '水印的默认文字' },
  'DEFAULT_OPACITY': { en: 'Default Opacity', zh: '默认透明度' },
  'DEFAULT_OPACITY_DESC': { en: 'Default opacity for watermark (10-100)', zh: '水印的默认透明度（10-100）' },
  'DEFAULT_SIZE': { en: 'Default Size', zh: '默认大小' },
  'DEFAULT_SIZE_DESC': { en: 'Default font size for watermark (pixels)', zh: '水印的默认文字大小（像素）' },
  'DEFAULT_POSITION': { en: 'Default Position', zh: '默认位置' },
  'DEFAULT_POSITION_DESC': { en: 'Default position for watermark', zh: '水印的默认位置' },
  'DEFAULT_COLOR': { en: 'Default Color', zh: '默认颜色' },
  'DEFAULT_COLOR_DESC': { en: 'Default color for watermark', zh: '水印的默认颜色' },
  'WATERMARK_TEMPLATE_MANAGEMENT': { en: 'Watermark Template Management', zh: '水印模板' },
  'WATERMARK_TEMPLATE_MANAGEMENT_DESC': { en: 'Manage common watermark templates for reuse', zh: '管理常用的水印模板，方便重复使用。' },
  'TEMPLATE_NAME': { en: 'Template Name', zh: '模板名称' },
  'ADD_NEW_TEMPLATE': { en: 'Add New Template', zh: '添加新模板' },
  'COLOR': { en: 'Color', zh: '颜色' },
  'DELETE': { en: 'Delete', zh: '删除' },
  
  // 添加模板模态框
  'ADD_WATERMARK_TEMPLATE': { en: 'Add Watermark Template', zh: '添加水印模板' },
  'TEMPLATE_NAME_PLACEHOLDER': { en: 'Enter template name', zh: '输入模板名称' },
  'SAVE_TEMPLATE': { en: 'Save Template', zh: '保存模板' },
  'PLEASE_ENTER_TEMPLATE_NAME': { en: 'Please enter template name', zh: '请输入模板名称' },
  
  // 命令
  'ADD_WATERMARK_COMMAND': { en: 'Add watermark to image', zh: '为图片添加水印' },
  'ADD_WATERMARK': { en: 'Add Watermark', zh: '添加水印' },
  
  // 提示和通知
  'NO_IMAGES_SELECTED': { en: 'Please select images first', zh: '请先选择图片' },
  'NO_WATERMARK_TEXT': { en: 'Please enter watermark text', zh: '请输入水印文字' },
  'WATERMARK_APPLIED_SUCCESS': { en: 'Watermark applied successfully to {count} image(s)', zh: '水印已成功应用到 {count} 张图片' },
  'ERROR_APPLYING_WATERMARK': { en: 'Error applying watermark to image {name}: {error}', zh: '为图片 {name} 添加水印时出错: {error}' },
  'WATERMARK_SETTINGS_SAVED': { en: 'Watermark settings saved', zh: '水印设置已保存' },
  'TEMPLATE_ADDED': { en: 'Template added successfully', zh: '模板添加成功' },
  'SELECT_AT_LEAST_ONE_IMAGE': { en: 'Please select at least one image', zh: '请选择至少一张图片' },
  'PREVIEW_IMAGE': { en: 'Preview Image', zh: '预览图像' },
  'PREVIEW_IMAGE_DESC': { en: 'Click "Apply Watermark" button to add watermark to selected images', zh: '点击"应用水印"按钮添加水印到选中图片' },
  'ERROR_PROCESSING_IMAGE': { en: 'Error processing image', zh: '处理图片时出错' },
  'SUCCESS_ADD_WATERMARK': { en: 'Successfully added watermark to {count} images', zh: '已成功为 {count} 张图片添加水印' },
};

export class I18n {
  private language: 'en' | 'zh';
  
  constructor(language: 'en' | 'zh' = 'en') {
    this.language = language;
  }
  
  /**
   * 设置语言
   */
  setLanguage(language: 'en' | 'zh'): void {
    this.language = language;
  }
  
  /**
   * 获取当前语言
   */
  getLanguage(): 'en' | 'zh' {
    return this.language;
  }
  
  /**
   * 翻译文本
   */
  t(key: string, substitutions: Record<string, string | number> = {}): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    let text = translation[this.language];
    
    // 替换占位符
    Object.entries(substitutions).forEach(([placeholder, value]) => {
      // 支持两种占位符格式: {placeholder} 和 ?{placeholder}
      text = text.replace(new RegExp(`\\?\\{${placeholder}\\}`, 'g'), String(value));
      text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
    });
    
    return text;
  }
}