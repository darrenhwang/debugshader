// 系统字体渐变效果辅助脚本
// 创建一个简单的工具类，不使用装饰器语法

import { Component, Label, Sprite, Color, Node, UITransform, Vec3 } from 'cc';

/**
 * 系统字体渐变辅助工具
 * 
 * 这个工具提供了不使用装饰器语法的方法来应用渐变效果，
 * 解决浏览器中不支持装饰器语法的问题。
 */
export class SystemFontGradientHelper {
    /**
     * 应用渐变效果到现有的Label和Sprite组件
     * 
     * @param {Label} label - 源Label组件
     * @param {Sprite} sprite - 目标Sprite组件，用于显示渐变效果
     * @param {Material} material - 渐变材质
     * @param {Object} options - 渐变选项
     * @param {Color} [options.startColor] - 渐变起始颜色
     * @param {Color} [options.endColor] - 渐变结束颜色
     * @param {boolean} [options.isHorizontal=true] - 是否为水平渐变
     * @param {number} [options.outlineWidth=0] - 描边宽度
     * @param {Color} [options.outlineColor] - 描边颜色
     * @param {number} [options.brightness=1.0] - 亮度调整
     * @returns {Sprite} 应用了渐变效果的Sprite组件
     */
    static applyGradient(label, sprite, material, options = {}) {
        if (!label || !sprite || !material) {
            console.error('SystemFontGradientHelper: 缺少必要组件');
            return null;
        }

        // 默认选项
        const defaultOptions = {
            startColor: new Color(255, 0, 0, 255),
            endColor: new Color(0, 0, 255, 255),
            isHorizontal: true,
            outlineWidth: 0,
            outlineColor: new Color(0, 0, 0, 255),
            brightness: 1.0
        };

        // 合并选项
        const mergedOptions = Object.assign({}, defaultOptions, options);

        // 准备渐变效果
        this._prepareGradientEffect(label, sprite, material, mergedOptions);

        return sprite;
    }

    /**
     * 创建带渐变效果的文本节点
     * 
     * @param {Node} parent - 父节点
     * @param {string} text - 文本内容
     * @param {Material} material - 渐变材质
     * @param {Object} options - 文本和渐变选项
     * @returns {Node} 创建的文本节点
     */
    static createGradientText(parent, text, material, options = {}) {
        if (!parent || !material) {
            console.error('SystemFontGradientHelper: 缺少必要参数');
            return null;
        }

        // 创建文本节点
        const textNode = new Node('GradientText');
        parent.addChild(textNode);

        // 添加UITransform组件
        const transform = textNode.addComponent(UITransform);
        transform.setContentSize(300, 50); // 默认大小，将根据文本自动调整

        // 添加Label组件
        const label = textNode.addComponent(Label);
        label.string = text || 'Gradient Text';
        
        // 设置Label属性
        if (options.fontSize) label.fontSize = options.fontSize;
        if (options.font) label.font = options.font;
        if (options.fontFamily) label.fontFamily = options.fontFamily;
        if (options.lineHeight) label.lineHeight = options.lineHeight;
        if (options.horizontalAlign) label.horizontalAlign = options.horizontalAlign;
        if (options.verticalAlign) label.verticalAlign = options.verticalAlign;
        
        // 确保Label的颜色为白色
        label.color = new Color(255, 255, 255, 255);

        // 添加Sprite组件
        const sprite = textNode.addComponent(Sprite);
        
        // 应用渐变效果
        this.applyGradient(label, sprite, material, options);
        
        // 更新节点大小以匹配文本内容
        this._updateNodeSize(textNode, label);
        
        return textNode;
    }

    /**
     * 更新渐变文本内容
     * 
     * @param {Node} node - 文本节点
     * @param {string} text - 新的文本内容
     * @param {boolean} [updateSize=true] - 是否更新节点大小
     */
    static updateGradientText(node, text, updateSize = true) {
        if (!node) return;
        
        const label = node.getComponent(Label);
        if (!label) return;
        
        label.string = text;
        
        if (updateSize) {
            this._updateNodeSize(node, label);
        }
    }

    /**
     * 内部方法：准备渐变效果
     * 
     * @private
     */
    static _prepareGradientEffect(label, sprite, material, options) {
        // 确保Label的颜色为白色
        label.color = new Color(255, 255, 255, 255);
        
        // 应用材质到Sprite
        sprite.customMaterial = material;
        
        // 转换Color对象为vec4格式
        const startColorVec4 = this._colorToVec4(options.startColor);
        const endColorVec4 = this._colorToVec4(options.endColor);
        const outlineColorVec4 = this._colorToVec4(options.outlineColor);
        
        // 设置材质属性
        const materialPass = material.passes[0];
        
        // 更新材质参数
        materialPass.setUniform(materialPass.getHandle('startColor'), startColorVec4);
        materialPass.setUniform(materialPass.getHandle('endColor'), endColorVec4);
        materialPass.setUniform(materialPass.getHandle('outlineColor'), outlineColorVec4);
        materialPass.setUniform(materialPass.getHandle('isHorizontal'), options.isHorizontal ? 1 : 0);
        materialPass.setUniform(materialPass.getHandle('outlineWidth'), options.outlineWidth);
        materialPass.setUniform(materialPass.getHandle('brightness'), options.brightness);
    }

    /**
     * 内部方法：更新节点大小
     * 
     * @private
     */
    static _updateNodeSize(node, label) {
        // 获取UITransform组件
        const transform = node.getComponent(UITransform);
        if (!transform || !label) return;

        // 等待一帧以确保Label完成渲染
        setTimeout(() => {
            // 获取实际文本内容大小
            const contentSize = label.actualContentSize;
            
            // 设置节点大小匹配文本
            transform.setContentSize(
                contentSize.width + 10, // 添加一些边距
                contentSize.height + 10
            );
        }, 0);
    }

    /**
     * 内部方法：转换Color对象为vec4数组
     * 
     * @private
     */
    static _colorToVec4(color) {
        if (!color) return [1, 1, 1, 1];
        return [
            color.r / 255,
            color.g / 255,
            color.b / 255,
            color.a / 255
        ];
    }
} 