# 渐变文本效果使用说明

## 一、效果概述

这是一个为文本添加渐变色效果的着色器，支持水平或垂直渐变方向，可调整渐变范围、偏移和颜色强度。适用于标题、按钮文本、特殊提示等需要突出显示的UI文本元素。现在还支持文本描边效果，并增强了与不同字体类型的兼容性。

## 二、使用方法

### 1. 基础设置
1. 在 Cocos Creator 中创建新材质
2. 选择 `GradientText` 效果
3. 将材质应用到包含文本的精灵或Label组件上

### 2. 不同字体类型的应用方法

#### BMFont（位图字体）
- 直接在使用BMFont的Label组件上应用材质即可
- 确保Label组件颜色设置为白色（#FFFFFF）

#### TTF字体
**方法一：使用Label组件**
1. 将Label组件颜色设置为白色（#FFFFFF）
2. 将渐变材质应用到Label组件

**方法二：渲染为纹理**
1. 创建一个使用TTF字体的Label节点
2. 使用以下脚本将Label渲染为RenderTexture:
```typescript
import { _decorator, Component, Node, Label, Sprite, RenderTexture, Camera, UITransform, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TextToRenderTexture')
export class TextToRenderTexture extends Component {
    @property(Label)
    sourceLabel: Label = null;
    
    @property(Sprite)
    targetSprite: Sprite = null;
    
    @property(Camera)
    renderCamera: Camera = null;
    
    start() {
        this.renderLabelToTexture();
    }
    
    renderLabelToTexture() {
        // 获取Label的尺寸
        const labelSize = this.sourceLabel.node.getComponent(UITransform).contentSize;
        
        // 创建RenderTexture
        const renderTexture = new RenderTexture();
        renderTexture.reset({
            width: labelSize.width,
            height: labelSize.height
        });
        
        // 设置相机
        this.renderCamera.targetTexture = renderTexture;
        
        // 渲染
        this.renderCamera.render();
        
        // 创建SpriteFrame
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = renderTexture;
        
        // 应用到目标Sprite
        this.targetSprite.spriteFrame = spriteFrame;
    }
}
```

#### 系统字体
- 与TTF字体相同，可以直接应用或使用RenderTexture方法
- 确保Label组件颜色设置为白色（#FFFFFF）

### 3. 参数说明

#### 基础参数
- `startColor`：渐变起始颜色
  - 类型：颜色
  - 默认值：[1.0, 0.0, 0.0, 1.0] (红色)
  - 说明：渐变效果的起始颜色

- `endColor`：渐变结束颜色
  - 类型：颜色
  - 默认值：[0.0, 0.0, 1.0, 1.0] (蓝色)
  - 说明：渐变效果的结束颜色

- `isHorizontal`：渐变方向
  - 范围：0 或 1
  - 默认值：1
  - 说明：1表示水平渐变(左到右)，0表示垂直渐变(下到上)

#### 高级参数
- `gradientOffset`：渐变偏移
  - 范围：-0.5 - 0.5
  - 默认值：0.0
  - 说明：控制渐变的起始位置偏移，负值向左/下偏移，正值向右/上偏移

- `gradientScale`：渐变缩放
  - 范围：0.1 - 2.0
  - 默认值：1.0
  - 说明：控制渐变的范围，值越大渐变范围越窄，值越小渐变范围越宽

- `colorIntensity`：颜色强度
  - 范围：0.0 - 2.0
  - 默认值：1.0
  - 说明：控制渐变颜色的亮度，值越大颜色越亮

#### 描边参数
- `outlineColor`：描边颜色
  - 类型：颜色
  - 默认值：[0.0, 0.0, 0.0, 1.0] (黑色)
  - 说明：文本描边的颜色

- `outlineWidth`：描边宽度
  - 范围：0.0 - 0.1
  - 默认值：0.0
  - 说明：文本描边的宽度，0表示无描边

## 三、效果预设

### 1. 经典红蓝渐变
```json
{
  "startColor": [1.0, 0.0, 0.0, 1.0],
  "endColor": [0.0, 0.0, 1.0, 1.0],
  "isHorizontal": 1,
  "gradientOffset": 0.0,
  "gradientScale": 1.0,
  "colorIntensity": 1.0,
  "outlineWidth": 0.0
}
```

### 2. 金色标题渐变（带描边）
```json
{
  "startColor": [1.0, 0.8, 0.2, 1.0],
  "endColor": [0.8, 0.6, 0.1, 1.0],
  "isHorizontal": 1,
  "gradientOffset": 0.0,
  "gradientScale": 1.2,
  "colorIntensity": 1.3,
  "outlineColor": [0.3, 0.2, 0.0, 1.0],
  "outlineWidth": 0.03
}
```

### 3. 彩虹渐变
```json
{
  "startColor": [1.0, 0.0, 0.0, 1.0],
  "endColor": [0.0, 0.0, 1.0, 1.0],
  "isHorizontal": 1,
  "gradientOffset": 0.0,
  "gradientScale": 0.5,
  "colorIntensity": 1.5,
  "outlineWidth": 0.0
}
```

### 4. 霓虹文本效果
```json
{
  "startColor": [0.0, 1.0, 1.0, 1.0],
  "endColor": [1.0, 0.0, 1.0, 1.0],
  "isHorizontal": 0,
  "gradientOffset": 0.1,
  "gradientScale": 0.8,
  "colorIntensity": 1.8,
  "outlineColor": [0.0, 0.0, 0.0, 0.8],
  "outlineWidth": 0.02
}
```

### 5. 游戏数值显示
```json
{
  "startColor": [0.8, 1.0, 0.2, 1.0],
  "endColor": [0.2, 0.8, 0.0, 1.0],
  "isHorizontal": 1,
  "gradientOffset": 0.0,
  "gradientScale": 1.0,
  "colorIntensity": 1.2,
  "outlineColor": [0.0, 0.2, 0.0, 1.0],
  "outlineWidth": 0.04
}
```

## 四、使用场景

### 1. UI标题
- 使用对比度高的渐变色
- 适当增加颜色强度增强视觉冲击力
- 可以考虑使用金色系渐变提升质感
- 添加细微描边增强可读性

### 2. 按钮文本
- 使用与按钮背景互补的渐变色
- 适当调整渐变方向与按钮形状匹配
- 考虑使用亮色系增强可点击感
- 添加描边使文本在不同背景上都清晰可见

### 3. 特殊提示文本
- 使用明亮的颜色组合吸引注意
- 可以尝试垂直渐变增加层次感
- 适当调整偏移和缩放产生视觉焦点
- 重要文本使用粗描边突出显示

### 4. 游戏数值显示
- 对伤害数值、奖励数值使用渐变效果
- 可以使用描边让数字在复杂背景上清晰可见
- 根据数值类型使用不同的颜色方案

## 五、动画实现示例

### 1. 呼吸效果
```typescript
import { tween, Vec3 } from 'cc';

// 获取材质
const material = this.getComponent(Sprite).getMaterial(0);

// 创建循环动画
tween(material)
    .to(1.0, { getProperty('colorIntensity'): 1.5 }, { easing: 'sineInOut' })
    .to(1.0, { getProperty('colorIntensity'): 0.8 }, { easing: 'sineInOut' })
    .union()
    .repeatForever()
    .start();
```

### 2. 渐变偏移动画
```typescript
import { tween, Vec3 } from 'cc';

// 获取材质
const material = this.getComponent(Sprite).getMaterial(0);

// 创建偏移动画
tween(material)
    .to(2.0, { getProperty('gradientOffset'): 0.3 }, { easing: 'quadOut' })
    .to(2.0, { getProperty('gradientOffset'): -0.3 }, { easing: 'quadOut' })
    .union()
    .repeatForever()
    .start();
```

### 3. 描边闪烁效果
```typescript
import { tween, Color } from 'cc';

// 获取材质
const material = this.getComponent(Sprite).getMaterial(0);

// 设置初始描边
material.setProperty('outlineWidth', 0.03);
material.setProperty('outlineColor', new Color(0, 0, 0, 255));

// 创建描边颜色变化动画
const color1 = new Color(0, 0, 0, 255);
const color2 = new Color(255, 255, 255, 128);

tween(material)
    .to(0.5, { 
        getProperty('outlineColor'): color2
    }, { easing: 'sineInOut' })
    .to(0.5, { 
        getProperty('outlineColor'): color1
    }, { easing: 'sineInOut' })
    .union()
    .repeatForever()
    .start();
```

## 六、注意事项

### 1. 性能优化
- 渐变文本效果一般不会造成性能问题，可放心使用
- 动态更新参数的频率不宜过高
- 描边效果会增加一定的性能开销，特别是大量文本时

### 2. 兼容性问题
- 确保目标平台支持自定义着色器
- 在低端设备上测试性能表现
- 不同字体类型可能需要不同的处理方式

### 3. 常见问题解决
- 如果文本不显示：检查Label组件的颜色是否为白色，确保文本本身可见
- 如果渐变不明显：增加起始颜色和结束颜色的对比度，或调整颜色强度
- 如果边缘模糊：确保文本的原始纹理清晰，可能需要调整字体大小
- 如果描边效果不明显：适当增加描边宽度，或调整描边颜色与文本颜色的对比度
- 系统字体或TTF字体问题：尝试转换为RenderTexture再应用效果

### 4. 最佳实践
- 为不同场景预设多个渐变效果材质
- 根据背景颜色选择合适的渐变色组合
- 与UI主题风格保持一致
- 避免使用过于复杂的渐变，保持易读性
- 描边宽度不宜过大，会影响文本清晰度 