/**
 * 系统字体渐变效果安装示例
 * 在当前环境可用的情况下进行演示
 */

// 尝试使用不同的方式引入辅助工具
var SimpleGradientHelper;
try {
    // 方式1: CommonJS导入
    SimpleGradientHelper = require('./simple_system_font_gradient_helper');
} catch (e) {
    try {
        // 方式2: 全局对象导入
        SimpleGradientHelper = window.SimpleGradientHelper;
    } catch (e2) {
        console.error('无法导入SimpleGradientHelper工具', e, e2);
    }
}

// 获取引擎相关对象
var cc, Label, Sprite, Color, Material, Node;
try {
    cc = require('cc');
    Label = cc.Label;
    Sprite = cc.Sprite;
    Color = cc.Color;
    Material = cc.Material;
    Node = cc.Node;
} catch (e) {
    console.warn('无法通过require导入cc，将尝试使用全局cc对象');
    cc = window.cc || {};
    Label = cc.Label;
    Sprite = cc.Sprite;
    Color = cc.Color;
    Material = cc.Material;
    Node = cc.Node;
}

/**
 * 设置系统字体渐变 - 手动方式
 * 
 * @param {Node} rootNode 父节点
 * @param {String} text 显示文本
 * @param {Object} options 渐变选项
 */
function setupGradientFontManually(rootNode, text, options) {
    if (!rootNode || !text) {
        console.error('缺少必要参数');
        return;
    }
    
    try {
        console.log('开始设置系统字体渐变效果...');
        
        // 1. 创建文本节点
        var textNode = new Node('GradientTextNode');
        rootNode.addChild(textNode);
        
        // 2. 添加Label组件
        var label = textNode.addComponent(Label);
        if (!label) {
            console.error('无法创建Label组件');
            return;
        }
        
        // 3. 设置Label属性
        label.string = text;
        label.fontSize = options.fontSize || 36;
        label.lineHeight = options.lineHeight || options.fontSize || 36;
        
        // 4. 创建精灵节点
        var spriteNode = new Node('SpriteNode');
        textNode.addChild(spriteNode);
        
        // 5. 添加Sprite组件
        var sprite = spriteNode.addComponent(Sprite);
        if (!sprite) {
            console.error('无法创建Sprite组件');
            return;
        }
        
        // 6. 加载渐变材质
        var material = options.material;
        if (!material) {
            console.error('缺少渐变材质');
            return;
        }
        
        // 7. 使用辅助工具应用渐变效果
        if (SimpleGradientHelper) {
            SimpleGradientHelper.applyGradient(label, sprite, material, {
                startColor: options.startColor || new Color(255, 0, 0, 255),
                endColor: options.endColor || new Color(0, 0, 255, 255),
                isHorizontal: options.isHorizontal !== undefined ? options.isHorizontal : true,
                outlineWidth: options.outlineWidth || 0.03,
                brightness: options.brightness || 1.0
            });
            
            console.log('成功应用渐变效果!');
        } else {
            console.error('SimpleGradientHelper不可用，无法应用渐变效果');
        }
    } catch (error) {
        console.error('设置渐变字体时出错:', error);
    }
}

/**
 * 使用辅助工具直接创建渐变文本
 * 
 * @param {Node} rootNode 父节点
 * @param {String} text 显示文本
 * @param {Material} material 渐变材质
 * @param {Object} options 渐变选项
 */
function setupGradientFontWithHelper(rootNode, text, material, options) {
    if (!SimpleGradientHelper) {
        console.error('SimpleGradientHelper不可用');
        return;
    }
    
    try {
        // 直接创建带渐变效果的文本
        var node = SimpleGradientHelper.createGradientText(
            rootNode,
            text,
            material,
            options
        );
        
        if (node) {
            console.log('成功创建渐变文本!');
        } else {
            console.error('创建渐变文本失败');
        }
    } catch (error) {
        console.error('使用辅助工具创建渐变文本时出错:', error);
    }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupGradientFontManually: setupGradientFontManually,
        setupGradientFontWithHelper: setupGradientFontWithHelper
    };
}

// 在控制台记录导入状态
console.log('系统字体渐变效果安装脚本已加载');
console.log('SimpleGradientHelper可用状态:', !!SimpleGradientHelper);
console.log('cc引擎可用状态:', !!cc && !!Label && !!Sprite); 