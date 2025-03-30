/**
 * 系统字体渐变效果演示脚本
 */

// 获取辅助工具
var SimpleGradientHelper = require('./simple_system_font_gradient_helper');

// Cocos Creator 组件声明
var cc = require('cc');
var Component = cc.Component;
var _decorator = cc._decorator;
var ccclass = _decorator.ccclass;
var property = _decorator.property;
var Material = cc.Material;
var Label = cc.Label;
var Sprite = cc.Sprite;
var Color = cc.Color;

/**
 * 系统字体渐变组件
 */
var SystemFontGradientDemo = ccclass('SystemFontGradientDemo')(Component.extend({
    
    properties: {
        // 渐变材质
        gradientMaterial: {
            type: Material,
            default: null,
        },
        // 标签组件
        label: {
            type: Label,
            default: null,
        },
        // 精灵组件
        sprite: {
            type: Sprite,
            default: null,
        },
    },
    
    // 组件启动时
    start: function() {
        this._applyGradient();
    },
    
    // 应用渐变效果
    _applyGradient: function() {
        if (!this.label || !this.sprite || !this.gradientMaterial) {
            console.error('缺少必要组件');
            return;
        }
        
        // 应用渐变效果
        SimpleGradientHelper.applyGradient(this.label, this.sprite, this.gradientMaterial, {
            startColor: new Color(255, 0, 0, 255),
            endColor: new Color(0, 0, 255, 255),
            isHorizontal: true,
            outlineWidth: 0.05,
            brightness: 1.0
        });
    },
    
    // 更新文本内容
    updateText: function(text) {
        if (!text) return;
        
        SimpleGradientHelper.updateText(this.label, this.sprite, text);
    }
}));

module.exports = SystemFontGradientDemo; 