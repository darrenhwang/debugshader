# 涡旋过渡效果使用说明

## 效果概述

涡旋过渡效果是一种动态的场景转换效果，通过旋转扭曲将一个场景平滑地转换到另一个场景。该效果支持自定义涡旋中心点、旋转速度和边缘发光，适用于传送门、魔法漩涡或创意场景切换。

## 使用方法

1. 在 Cocos Creator 中，创建一个新的材质（Material）
2. 在材质检查器中，选择"效果"（Effect）下拉菜单，选择`vortex_transition`效果
3. 设置材质参数：
   - 将`mainTexture`设置为当前场景纹理
   - 将`nextTexture`设置为目标场景纹理
   - 根据需要调整其他参数（中心点、旋转速度等）
4. 将材质应用到目标精灵（Sprite）上
5. 通过代码或动画系统控制`progress`参数来实现过渡动画

## 参数说明

| 参数名称 | 类型 | 范围 | 默认值 | 说明 |
|---------|------|------|--------|------|
| mainTexture | Texture | - | white | 起始场景纹理 |
| nextTexture | Texture | - | white | 目标场景纹理 |
| progress | Float | 0.0 - 1.0 | 0.0 | 过渡进度，0为起始场景，1为目标场景 |
| centerX | Float | 0.0 - 1.0 | 0.5 | 涡旋中心点X坐标 |
| centerY | Float | 0.0 - 1.0 | 0.5 | 涡旋中心点Y坐标 |
| rotationSpeed | Float | 0.1 - 10.0 | 1.0 | 涡旋旋转速度 |

## 效果预设

### 标准涡旋

```json
{
  "progress": 0.0,
  "centerX": 0.5,
  "centerY": 0.5,
  "rotationSpeed": 1.0
}
```

### 快速涡旋

```json
{
  "progress": 0.0,
  "centerX": 0.5,
  "centerY": 0.5,
  "rotationSpeed": 3.0
}
```

### 偏心涡旋

```json
{
  "progress": 0.0,
  "centerX": 0.75,
  "centerY": 0.25,
  "rotationSpeed": 1.5
}
```

### 慢速涡旋

```json
{
  "progress": 0.0,
  "centerX": 0.5,
  "centerY": 0.5,
  "rotationSpeed": 0.5
}
```

## 使用场景

1. **传送门效果**：角色穿越传送门或空间裂缝时的过渡
2. **魔法漩涡**：召唤魔法或特殊技能时的视觉效果
3. **场景切换**：游戏关卡或场景之间的创意过渡
4. **时空扭曲**：表现时间或空间变形的视觉效果
5. **黑洞效应**：模拟引力场或吸入效果

## 性能优化

1. 适当降低`rotationSpeed`可减少每帧计算量
2. 将涡旋中心点设置在视觉焦点位置提高观感
3. 避免同屏出现过多涡旋效果实例
4. 在低性能设备上考虑降低过渡持续时间

## 常见问题

### 效果不可见或显示异常
- 检查材质是否正确应用到精灵上
- 确认已设置有效的`mainTexture`和`nextTexture`
- 验证`progress`值是否在有效范围内

### 涡旋效果不明显
- 增加`rotationSpeed`值使旋转更加显著
- 调整涡旋中心点位置改变效果焦点
- 确保过渡持续时间足够长以展示完整效果

## 代码示例

### 实现简单的涡旋过渡

```typescript
// 在场景脚本中
import { _decorator, Component, Node, Material, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VortexTransition')
export class VortexTransition extends Component {
    @property(Material)
    private transitionMaterial: Material = null;
    
    @property(Sprite)
    private transitionSprite: Sprite = null;
    
    private isTransitioning: boolean = false;
    private transitionTime: number = 1.5;
    private elapsedTime: number = 0;
    
    startTransition() {
        if (!this.isTransitioning) {
            this.isTransitioning = true;
            this.elapsedTime = 0;
            this.transitionSprite.node.active = true;
        }
    }
    
    update(deltaTime: number) {
        if (this.isTransitioning) {
            this.elapsedTime += deltaTime;
            const progress = Math.min(this.elapsedTime / this.transitionTime, 1.0);
            
            // 更新材质的progress参数
            this.transitionMaterial.setProperty('progress', progress);
            
            if (progress >= 1.0) {
                this.isTransitioning = false;
                // 这里可以触发场景加载完成事件
            }
        }
    }
} 