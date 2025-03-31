import { _decorator, Component, Label, Sprite, SpriteFrame, Material, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 系统字体渐变效果组件
 * 将此组件挂载到包含Label和Sprite的节点
 * 自动应用渐变效果到系统字体
 */
class SystemFontGradient extends Component {
    constructor() {
        super();
        
        // 默认属性值
        this.sourceLabel = null;
        this.targetSprite = null;
        this.gradientMaterial = null;
        this.startColor = new Color(255, 0, 0, 255);
        this.endColor = new Color(0, 0, 255, 255);
        this.outlineColor = new Color(0, 0, 0, 255);
        this.isHorizontal = true;
        this.outlineWidth = 0.03;
        this.brightness = 1.0;
        this.autoUpdate = false;
        this._textContent = '';
    }
    
    start() {
        this.setup();
    }
    
    update(dt) {
        if (this.autoUpdate && this.sourceLabel) {
            // 如果文本内容变化，则更新渐变效果
            if (this._textContent !== this.sourceLabel.string) {
                this._textContent = this.sourceLabel.string;
                this.applyGradient();
            }
        }
    }
    
    setup() {
        if (!this.sourceLabel || !this.targetSprite || !this.gradientMaterial) {
            console.error('SystemFontGradient: 缺少必要组件');
            return;
        }
        
        // 确保Label可见
        this.sourceLabel.color = Color.WHITE;
        
        // 记录初始文本内容
        this._textContent = this.sourceLabel.string;
        
        // 使Label和Sprite重叠
        this.targetSprite.node.setPosition(0, 0);
        
        // 应用材质到精灵
        this.targetSprite.customMaterial = this.gradientMaterial;
        
        // 初始化属性
        this.applyGradient();
    }
    
    applyGradient() {
        // 设置渐变参数
        this.gradientMaterial.setProperty('startColor', this.startColor);
        this.gradientMaterial.setProperty('endColor', this.endColor);
        this.gradientMaterial.setProperty('outlineColor', this.outlineColor);
        this.gradientMaterial.setProperty('isHorizontal', this.isHorizontal ? 1 : 0);
        this.gradientMaterial.setProperty('outlineWidth', this.outlineWidth);
        this.gradientMaterial.setProperty('brightness', this.brightness);
        
        // 将标签设置为精灵的纹理
        if (this.sourceLabel && this.targetSprite) {
            // 这里无法直接将Label转为纹理，但可以将材质应用到具有相同尺寸的精灵
            this.targetSprite.node.setContentSize(this.sourceLabel.node.getContentSize());
        }
    }
}

// 使用ccclass和property注册组件属性
SystemFontGradient = ccclass('SystemFontGradient')(SystemFontGradient);

// 注册组件属性
property(Label)(SystemFontGradient.prototype, 'sourceLabel');
property(Sprite)(SystemFontGradient.prototype, 'targetSprite');
property(Material)(SystemFontGradient.prototype, 'gradientMaterial');
property(Color)(SystemFontGradient.prototype, 'startColor');
property(Color)(SystemFontGradient.prototype, 'endColor');
property(Color)(SystemFontGradient.prototype, 'outlineColor');
property()(SystemFontGradient.prototype, 'isHorizontal');
property({ range: [0, 0.1], slide: true })(SystemFontGradient.prototype, 'outlineWidth');
property({ range: [0.5, 2.0], slide: true })(SystemFontGradient.prototype, 'brightness');
property()(SystemFontGradient.prototype, 'autoUpdate');

export { SystemFontGradient }; 