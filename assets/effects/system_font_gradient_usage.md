# 系统字体渐变效果使用指南

## 简介

本工具提供了一种简单的方法来为系统字体添加渐变效果，避免了装饰器语法错误问题，完全兼容Cocos Creator 3.8.2。

## 文件说明

- `simple_system_font_gradient_helper.js`: 简化版辅助工具，不使用ES6导入导出语法
- `system_font_gradient_demo.js`: 渐变效果演示组件
- `system_font_gradient.effect`: 渐变材质效果文件（需要单独创建）

## 使用方法

### 1. 准备节点结构

为了使用渐变效果，您需要创建以下节点结构：

```
RootNode
  ├── Label (带有Label组件)
  └── Sprite (带有Sprite组件，使用相同的RT渲染目标)
```

### 2. 导入辅助工具

```javascript
// 导入辅助工具
var SimpleGradientHelper = require('./simple_system_font_gradient_helper');
```

### 3. 应用渐变效果

```javascript
// 获取组件
var label = node.getComponent(cc.Label);
var sprite = node.getChildByName('Sprite').getComponent(cc.Sprite);
var material = cc.resources.get('effects/system_font_gradient', cc.Material);

// 应用渐变效果
SimpleGradientHelper.applyGradient(label, sprite, material, {
    startColor: new cc.Color(255, 0, 0, 255),   // 起始颜色
    endColor: new cc.Color(0, 0, 255, 255),     // 结束颜色
    isHorizontal: true,                          // 是否水平渐变
    outlineWidth: 0.05,                          // 轮廓宽度
    brightness: 1.0                              // 亮度
});
```

### 4. 更新文本内容

```javascript
// 更新文本内容
SimpleGradientHelper.updateText(label, sprite, '新的文本内容');
```

### 5. 使用演示组件

您也可以直接使用提供的演示组件：

1. 在场景中创建一个节点
2. 添加Label组件
3. 添加一个子节点并添加Sprite组件
4. 添加`SystemFontGradientDemo`组件
5. 设置演示组件中的属性：
   - gradientMaterial: 渐变材质
   - label: 标签组件引用
   - sprite: 精灵组件引用

## 渐变材质属性

渐变材质支持以下属性：

- `startColor`: 渐变起始颜色
- `endColor`: 渐变结束颜色
- `outlineColor`: 轮廓颜色
- `isHorizontal`: 是否水平渐变（1为水平，0为垂直）
- `outlineWidth`: 轮廓宽度（0-1之间）
- `brightness`: 亮度调整（默认1.0）

## 注意事项

1. 确保Label和Sprite组件尺寸保持一致
2. 当文本内容变化时，需要调用`updateText`方法更新尺寸
3. 如需自定义更多效果，可以修改渐变材质文件

## 更新：解决浏览器装饰器语法错误

如果遇到以下错误：
```
Error: SyntaxError: unknown: Support for the experimental syntax 'decorators' isn't currently enabled
```

这是因为项目未启用装饰器语法支持。我们提供了两种解决方案：

### 方案一：启用装饰器语法
在项目的Babel配置中添加装饰器支持：
1. 安装插件：`npm install --save-dev @babel/plugin-proposal-decorators`
2. 在babel.config.js中添加：
```javascript
plugins: [
  ["@babel/plugin-proposal-decorators", { "legacy": true }]
]
```

### 方案二：使用不含装饰器的辅助工具
我们提供了`SystemFontGradientHelper.js`，这是一个不使用装饰器的辅助工具：

```javascript
// 引入辅助工具
import { SystemFontGradientHelper } from './system_font_gradient_helper';

// 在组件中使用
onLoad() {
    // 获取组件
    const label = this.getComponent(Label);
    const sprite = this.getComponent(Sprite);
    const material = this.gradientMaterial;
    
    // 应用渐变效果
    SystemFontGradientHelper.applyGradient(label, sprite, material, {
        startColor: new Color(255, 0, 0, 255),
        endColor: new Color(0, 0, 255, 255),
        isHorizontal: true
    });
}
```

## 一、效果概述

这是一个专门为系统字体设计的渐变色效果着色器，与通用渐变文本着色器相比，此版本针对系统字体的特性进行了优化，可以更好地支持系统字体的渐变和描边效果。

## 二、使用方法

### 1. 基础设置
1. 在 Cocos Creator 中创建新材质
2. 选择 `SystemFontGradient` 效果
3. 创建一个节点，添加Label和Sprite组件
4. 使用下面的方法之一应用渐变效果

### 2. 应用方法

#### 方法一：使用Helper工具（推荐，无装饰器问题）
```javascript
import { _decorator, Component, Label, Sprite, Material } from 'cc';
import { SystemFontGradientHelper } from './system_font_gradient_helper';

const { ccclass, property } = _decorator;

@ccclass('TextGradientDemo')
export class TextGradientDemo extends Component {
    @property(Material)
    gradientMaterial = null;
    
    start() {
        // 获取组件
        const label = this.node.getComponent(Label);
        const sprite = this.node.getComponent(Sprite) || this.node.addComponent(Sprite);
        
        // 应用渐变效果
        if (this.gradientMaterial) {
            SystemFontGradientHelper.applyGradient(
                label, sprite, this.gradientMaterial, {
                    startColor: new Color(255, 150, 0, 255),
                    endColor: new Color(255, 0, 150, 255),
                    outlineWidth: 0.03
                }
            );
        }
    }
}
```

#### 方法二：创建新的文本节点
```javascript
import { SystemFontGradientHelper } from './system_font_gradient_helper';

// 创建带渐变效果的文本
const textNode = SystemFontGradientHelper.createGradientText(
    this.node,  // 父节点 
    "渐变文本", // 文本内容
    this.material, // 材质
    {
        fontSize: 36,
        startColor: new Color(255, 0, 0, 255),
        endColor: new Color(0, 0, 255, 255)
    }
);
```

#### 方法三：使用组件脚本（需启用装饰器支持）
1. 在节点上添加Label和Sprite组件
2. 添加`SystemFontGradient`脚本组件
3. 在Inspector中设置属性：
   - sourceLabel: 引用Label组件
   - targetSprite: 引用Sprite组件
   - gradientMaterial: 引用渐变材质
   - 其他渐变参数

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
- `outlineColor`：描边颜色
  - 类型：颜色
  - 默认值：[0.0, 0.0, 0.0, 1.0] (黑色)
  - 说明：文本描边的颜色

- `outlineWidth`：描边宽度
  - 范围：0.0 - 0.1
  - 默认值：0.03
  - 说明：文本描边的宽度，0表示无描边

- `brightness`：亮度调整
  - 范围：0.5 - 2.0
  - 默认值：1.0
  - 说明：控制渐变颜色的整体亮度

## 三、故障排除

### 1. UBO内存对齐错误

如果遇到以下错误：
```
[Assets] SystemFontGradient.effect - sprite-fs:frag: Error EFX2205: UBO 'Constant' introduces implicit padding: 12 bytes before 'outlineColor', consider re-ordering the members
```

这是由于着色器中的UBO(Uniform Buffer Object)内存对齐问题导致的。GLSL中的数据结构需要按照特定规则对齐内存，错误的顺序会导致隐式填充和性能问题。

**解决方案**：
1. 重新按照以下顺序排列Uniform变量：
   - 首先放置所有vec4类型 (如startColor, endColor, outlineColor)
   - 然后放置所有int类型 (如isHorizontal)
   - 最后放置所有float类型 (如outlineWidth, brightness)

2. 属性声明顺序和UBO中的顺序要保持一致

修复后的UBO结构应如下所示：
```glsl
uniform FSBlock {
  vec4 startColor;   // 16字节
  vec4 endColor;     // 16字节
  vec4 outlineColor; // 16字节
  int isHorizontal;  // 4字节
  float outlineWidth;// 4字节
  float brightness;  // 4字节
};
```

### 2. 常见问题解决

- **着色器无法挂载**:
  - 确保已修复UBO内存对齐问题
  - 检查Label组件的颜色是否为白色
  - 确保文本本身可见 (非空字符串)

- **装饰器语法错误**:
  - 使用提供的`SystemFontGradientHelper`工具，它不依赖装饰器语法
  - 或者按照上述方法启用装饰器支持

- **渐变效果不明显**:
  - 增加字体大小 (24-36pt范围效果最佳)
  - 使用具有较大对比度的startColor和endColor
  - 增加brightness值

- **描边效果不明显**:
  - 适当增加outlineWidth (推荐值0.03-0.05)
  - 确保outlineColor与渐变色具有足够对比度
  - 增加字体粗细

## 四、效果预设

### 1. 红蓝系统字体渐变
```json
{
  "startColor": [1.0, 0.0, 0.0, 1.0],
  "endColor": [0.0, 0.0, 1.0, 1.0],
  "outlineColor": [0.0, 0.0, 0.0, 1.0],
  "isHorizontal": 1,
  "outlineWidth": 0.0,
  "brightness": 1.0
}
```

### 2. 黑色描边金色系统字体
```json
{
  "startColor": [1.0, 0.8, 0.2, 1.0],
  "endColor": [0.8, 0.6, 0.1, 1.0],
  "outlineColor": [0.0, 0.0, 0.0, 1.0],
  "isHorizontal": 1,
  "outlineWidth": 0.03,
  "brightness": 1.2
}
```

### 3. 垂直绿蓝渐变系统字体
```json
{
  "startColor": [0.0, 0.8, 0.2, 1.0],
  "endColor": [0.0, 0.4, 0.8, 1.0],
  "outlineColor": [0.1, 0.1, 0.1, 1.0],
  "isHorizontal": 0,
  "outlineWidth": 0.02,
  "brightness": 1.3
}
```

## 五、系统字体渐变的实现原理

系统字体渐变的实现与位图字体(BMFont)或TTF字体略有不同，主要区别在于：

1. **系统字体的特性**：
   - 系统字体渲染时通常不使用纹理，而是通过顶点颜色控制
   - 字体的形状信息存储在顶点属性中，而非纹理中

2. **着色器实现方式**：
   - 这个专用着色器直接使用顶点颜色的alpha通道判断文本区域
   - 在文本区域应用渐变色，而非纹理采样的方式
   - 描边效果通过混合相邻顶点颜色实现，效果可能受字体大小影响

## 六、技巧与注意事项

### 1. 优化系统字体渐变效果
- 调整字体大小至合适范围（24-36 pt 通常有较好效果）
- 使用较粗的字体样式以获得更明显的渐变效果
- 设置合适的描边宽度以提高可读性

### 2. 性能优势
- 系统字体渐变的性能开销比渲染到纹理的方法小
- 适合动态变化的文本内容（如计分、时间显示等）
- 无需额外的渲染相机或RenderTexture资源

### 3. 局限性
- 渐变效果可能不如位图字体精细
- 描边效果受字体大小和形状限制
- 不适合特别小的字体大小（可能导致渐变不明显）

### 4. 常见问题解决
- 如果文本不显示：检查Label组件的颜色是否为白色
- 如果渐变不明显：增加字体大小或粗细，或调整亮度参数
- 如果描边效果不理想：尝试减小描边宽度或调整字体大小

## 七、与其他字体类型的对比

| 特性 | 系统字体渐变 | BMFont渐变 | TTF字体渐变 |
|------|------------|-----------|------------|
| 性能开销 | 低 | 中 | 高 |
| 渐变效果质量 | 一般 | 高 | 高 |
| 支持动态文本 | 是 | 有限制 | 需转为纹理 |
| 描边效果 | 简单 | 精细 | 精细 |
| 内存占用 | 低 | 高 | 中 |
| 适用场景 | 频繁变化的文本 | 静态标题、按钮 | 需要高质量效果的场景 |

## 八、使用示例代码

```typescript
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