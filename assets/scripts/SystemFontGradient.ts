import { _decorator, Component, Node, Label, Material, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SystemFontGradient')
export class SystemFontGradient extends Component {
    @property(Label)
    label: Label = null;
    
    @property(Material)
    gradientMaterial: Material = null;
    
    start() {
        // 确保Label使用的是系统字体
        if (this.label && this.gradientMaterial) {
            // 设置Label颜色为白色
            this.label.color = new Color(255, 255, 255, 255);
            
            // 应用渐变材质
            this.label.customMaterial = this.gradientMaterial;
            
            // 如果需要，可以动态调整材质参数
            this.updateGradientColors();
        }
    }
    
    updateGradientColors() {
        // 动态修改渐变颜色示例
        this.gradientMaterial.setProperty('startColor', new Color(255, 200, 0, 255));
        this.gradientMaterial.setProperty('endColor', new Color(255, 100, 0, 255));
        this.gradientMaterial.setProperty('brightness', 1.2);
    }
} 