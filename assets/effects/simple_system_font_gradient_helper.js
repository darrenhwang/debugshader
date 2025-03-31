/**
 * 简单的系统字体渐变辅助工具
 * 使用兼容性更好的基础语法
 */

// 兼容性更好的导入方式
var cc;
try {
    // CommonJS方式
    cc = require('cc');
} catch (e) {
    // 浏览器环境或其他环境
    cc = window.cc || {};
    console.warn('无法通过require导入cc，将尝试使用全局cc对象');
}

// 确保组件类型可用
var Label = cc.Label || {};
var Sprite = cc.Sprite || {};
var Color = cc.Color || function(r, g, b, a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 255;
};

/**
 * 应用渐变效果到Label和Sprite组件
 * 
 * @param {Label} label - 标签组件
 * @param {Sprite} sprite - 精灵组件
 * @param {Material} material - 渐变材质
 * @param {Object} options - 渐变选项
 * @return {Boolean} 是否设置成功
 */
function applyGradient(label, sprite, material, options) {
    if (!label || !sprite || !material) {
        console.error('缺少必要组件');
        return false;
    }
    
    // 获取选项参数
    options = options || {};
    
    try {
        // 设置标签颜色为白色
        label.color = new Color(255, 255, 255, 255);
        
        // 设置精灵尺寸与标签一致
        sprite.node.setContentSize(label.node.getContentSize());
        
        // 应用材质
        sprite.customMaterial = material;
        
        // 设置渐变参数
        var startColor = options.startColor || new Color(255, 0, 0, 255);
        var endColor = options.endColor || new Color(0, 0, 255, 255);
        var outlineColor = options.outlineColor || new Color(0, 0, 0, 255);
        var isHorizontal = options.isHorizontal !== undefined ? options.isHorizontal : true;
        var outlineWidth = options.outlineWidth !== undefined ? options.outlineWidth : 0.03;
        var brightness = options.brightness !== undefined ? options.brightness : 1.0;
        
        // 设置到材质
        material.setProperty('startColor', startColor);
        material.setProperty('endColor', endColor);
        material.setProperty('outlineColor', outlineColor);
        material.setProperty('isHorizontal', isHorizontal ? 1 : 0);
        material.setProperty('outlineWidth', outlineWidth);
        material.setProperty('brightness', brightness);
        
        return true;
    } catch (error) {
        console.error('应用渐变效果时出错:', error);
        return false;
    }
}

/**
 * 更新文本尺寸
 * 
 * @param {Label} label - 标签组件
 * @param {Sprite} sprite - 精灵组件
 */
function updateSize(label, sprite) {
    if (!label || !sprite) return;
    
    try {
        // 更新精灵尺寸以匹配标签
        sprite.node.setContentSize(label.node.getContentSize());
    } catch (error) {
        console.error('更新尺寸时出错:', error);
    }
}

/**
 * 更新渐变文本
 * 
 * @param {Label} label - 标签组件
 * @param {Sprite} sprite - 精灵组件
 * @param {String} text - 文本内容
 */
function updateText(label, sprite, text) {
    if (!label || !sprite) return;
    
    try {
        // 更新文本
        label.string = text;
        
        // 延迟更新尺寸，确保文本渲染完成
        setTimeout(function() {
            updateSize(label, sprite);
        }, 1);
    } catch (error) {
        console.error('更新文本时出错:', error);
    }
}

/**
 * 创建带渐变效果的文本节点
 * 
 * @param {Node} parentNode - 父节点
 * @param {String} text - 文本内容
 * @param {Material} material - 渐变材质
 * @param {Object} options - 文本和渐变选项
 * @return {Node} 创建的节点
 */
function createGradientText(parentNode, text, material, options) {
    if (!parentNode || !material) {
        console.error('缺少必要参数');
        return null;
    }
    
    options = options || {};
    
    try {
        // 创建根节点
        var node;
        if (cc.Node) {
            node = new cc.Node('GradientText');
            parentNode.addChild(node);
        } else {
            console.error('无法创建节点，cc.Node不可用');
            return null;
        }
        
        // 添加Label组件
        var label = node.addComponent(Label);
        if (label) {
            label.string = text || '';
            label.fontSize = options.fontSize || 24;
            label.lineHeight = options.lineHeight || options.fontSize || 24;
            if (options.font) label.font = options.font;
        }
        
        // 创建精灵子节点
        var spriteNode = new cc.Node('GradientSprite');
        node.addChild(spriteNode);
        var sprite = spriteNode.addComponent(Sprite);
        
        // 应用渐变效果
        applyGradient(label, sprite, material, options);
        
        return node;
    } catch (error) {
        console.error('创建渐变文本节点时出错:', error);
        return null;
    }
}

// 导出对象
var SimpleGradientHelper = {
    applyGradient: applyGradient,
    updateSize: updateSize,
    updateText: updateText,
    createGradientText: createGradientText
};

// 兼容各种模块系统
(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // 浏览器全局变量
        root.SimpleGradientHelper = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    return SimpleGradientHelper;
})); 