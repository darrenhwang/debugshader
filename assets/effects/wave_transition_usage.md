# 波浪过渡效果使用说明

## 效果概述

波浪过渡效果是一种平滑的场景转换效果，通过波浪状的边界线将一个场景逐渐过渡到另一个场景。该效果支持自定义波浪参数（数量、振幅、速度）、过渡方向和边缘发光，适用于水相关场景、魔法效果或创意UI切换。

## 使用方法

1. 在 Cocos Creator 中，创建一个新的材质（Material）
2. 在材质检查器中，选择"效果"（Effect）下拉菜单，选择`wave_transition`效果
3. 设置材质参数：
   - 将`mainTexture`设置为当前场景纹理
   - 将`secondTexture`设置为目标场景纹理
   - 根据需要调整其他参数（波浪数量、振幅、方向等）
4. 将材质应用到目标精灵（Sprite）上
5. 通过代码或动画系统控制`progress`参数来实现过渡动画

## 参数说明

| 参数名称 | 类型 | 范围 | 默认值 | 说明 |
|---------|------|------|--------|------|
| mainTexture | Texture | - | white | 起始场景纹理 |
| secondTexture | Texture | - | white | 目标场景纹理 |
| progress | Float | 0.0 - 1.0 | 0.0 | 过渡进度，0为起始场景，1为目标场景 |
| waveCount | Float | 1.0 - 10.0 | 3.0 | 波浪数量，越大波浪越密集 |
| waveAmplitude | Float | 0.0 - 0.5 | 0.1 | 波浪振幅，影响波浪高度 |
| waveSpeed | Float | 0.0 - 5.0 | 1.0 | 波浪移动速度 |
| direction | Float | 0 - 360 | 0.0 | 过渡方向（角度值，0为从下到上） |
| edgeWidth | Float | 0.0 - 0.2 | 0.05 | 边缘发光宽度 |
| edgeColorR | Float | 0.0 - 1.0 | 1.0 | 边缘发光颜色的红色分量 |
| edgeColorG | Float | 0.0 - 1.0 | 1.0 | 边缘发光颜色的绿色分量 |
| edgeColorB | Float | 0.0 - 1.0 | 1.0 | 边缘发光颜色的蓝色分量 |

## 效果预设

### 标准波浪过渡

```json
{
  "waveCount": 3.0,
  "waveAmplitude": 0.1,
  "waveSpeed": 1.0,
  "direction": 0,
  "edgeWidth": 0.05,
  "edgeColorR": 1.0,
  "edgeColorG": 1.0,
  "edgeColorB": 1.0
}
```

### 水平波浪过渡

```json
{
  "waveCount": 3.0,
  "waveAmplitude": 0.1,
  "waveSpeed": 1.0,
  "direction": 90,
  "edgeWidth": 0.05,
  "edgeColorR": 0.0,
  "edgeColorG": 0.5,
  "edgeColorB": 1.0
}
```

### 多重波浪效果

```json
{
  "waveCount": 8.0,
  "waveAmplitude": 0.05,
  "waveSpeed": 2.0,
  "direction": 0,
  "edgeWidth": 0.1,
  "edgeColorR": 0.0,
  "edgeColorG": 1.0,
  "edgeColorB": 0.5
}
```

### 斜向慢速波浪

```json
{
  "waveCount": 2.0,
  "waveAmplitude": 0.2,
  "waveSpeed": 0.5,
  "direction": 45,
  "edgeWidth": 0.15,
  "edgeColorR": 1.0,
  "edgeColorG": 0.0,
  "edgeColorB": 0.5
}
```

## 使用场景

1. **水相关场景过渡**：游泳池、海洋、河流等水相关场景切换
2. **魔法效果**：水系魔法技能释放或结界展示
3. **UI动画**：创意流体界面切换
4. **梦境/幻境效果**：表现迷幻或梦境场景转换
5. **能量波动**：能量冲击波或力场展示

## 性能优化

1. 减少`waveCount`值可降低计算复杂度
2. 适当降低`waveSpeed`和`waveAmplitude`可减少每帧计算量
3. 减小`edgeWidth`值可降低边缘混合计算复杂度
4. 避免同屏出现过多波浪效果实例

## 常见问题

### 效果不可见或显示异常
- 检查材质是否正确应用到精灵上
- 确认已设置有效的`mainTexture`和`secondTexture`
- 验证`progress`值是否在有效范围内

### 波浪效果不明显
- 增加`waveAmplitude`值使波浪更加显著
- 适当调整`waveCount`值改变波浪密度
- 尝试不同的`direction`值改变波浪方向

## 代码示例

### 实现简单的波浪过渡

```typescript
// 在场景脚本中
import { _decorator, Component, Node, Material, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WaveTransition')
export class WaveTransition extends Component {
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
``` 