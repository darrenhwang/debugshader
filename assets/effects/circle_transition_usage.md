# 圆形转场效果使用说明

## 一、效果概述

这是一个模拟圆形扩展/收缩效果的转场着色器，支持自定义圆心位置、边缘过渡和发光效果。适用于场景切换、技能释放等需要圆形过渡效果的场景。

## 二、使用方法

### 1. 基础设置
1. 在 Cocos Creator 中创建新材质
2. 选择 `basic_circle` 效果
3. 将材质应用到目标精灵上

### 2. 参数说明

#### 基础参数
- `mainTexture`：当前场景/主纹理
- `secondTexture`：下一个场景/次纹理

- `progress`：转场进度
  - 范围：0.0 - 1.0
  - 默认值：0.0
  - 说明：控制转场进度，0表示开始，1表示完成

- `centerX`：圆心X坐标
  - 范围：0.0 - 1.0
  - 默认值：0.5
  - 说明：控制圆心在水平方向的位置

- `centerY`：圆心Y坐标
  - 范围：0.0 - 1.0
  - 默认值：0.5
  - 说明：控制圆心在垂直方向的位置

#### 边缘控制参数
- `edgeWidth`：边缘宽度
  - 范围：0.0 - 0.5
  - 默认值：0.1
  - 说明：控制边缘过渡和发光的宽度

- `edgeColor`：边缘颜色
  - 类型：颜色
  - 默认值：[1.0, 1.0, 1.0, 1.0]
  - 说明：控制边缘发光的颜色

- `edgeBrightness`：边缘亮度
  - 范围：0.0 - 2.0
  - 默认值：1.0
  - 说明：控制边缘发光的亮度

#### 特殊控制参数
- `isReverse`：反向过渡
  - 范围：0 或 1
  - 默认值：0
  - 说明：0表示从内到外扩展，1表示从外到内收缩

- `debugMode`：调试模式
  - 范围：0 - 3
  - 默认值：0
  - 说明：0表示正常模式，1显示遮罩，2显示边缘，3显示距离

## 三、效果预设

### 1. 基础圆形扩展
```json
{
  "progress": 0.5,
  "centerX": 0.5,
  "centerY": 0.5,
  "edgeWidth": 0.1,
  "edgeColor": [1.0, 1.0, 1.0, 1.0],
  "isReverse": 0,
  "edgeBrightness": 1.0,
  "debugMode": 0
}
```

### 2. 圆形收缩效果
```json
{
  "progress": 0.5,
  "centerX": 0.5,
  "centerY": 0.5,
  "edgeWidth": 0.1,
  "edgeColor": [1.0, 1.0, 1.0, 1.0],
  "isReverse": 1,
  "edgeBrightness": 1.0,
  "debugMode": 0
}
```

### 3. 边缘特效圆形扩展
```json
{
  "progress": 0.5,
  "centerX": 0.5,
  "centerY": 0.5,
  "edgeWidth": 0.15,
  "edgeColor": [0.8, 0.2, 1.0, 1.0],
  "isReverse": 0,
  "edgeBrightness": 1.5,
  "debugMode": 0
}
```

### 4. 双纹理混合效果
```json
{
  "progress": 0.5,
  "centerX": 0.5,
  "centerY": 0.5,
  "edgeWidth": 0.05,
  "edgeColor": [1.0, 0.5, 0.0, 1.0],
  "isReverse": 0,
  "edgeBrightness": 0.8,
  "debugMode": 0
}
```

### 5. 冲击波效果
```json
{
  "progress": 0.3,
  "centerX": 0.5,
  "centerY": 0.5,
  "edgeWidth": 0.2,
  "edgeColor": [0.0, 0.8, 1.0, 1.0],
  "isReverse": 0,
  "edgeBrightness": 1.8,
  "debugMode": 0
}
```

## 四、使用场景

### 1. 场景切换
- 使用基础圆形扩展/收缩效果
- 调整圆心位置创造方向感
- 设置适当的边缘宽度和颜色

### 2. 技能释放
- 使用高亮边缘的圆形扩展
- 调整边缘颜色匹配技能效果
- 控制转场速度创造打击感

### 3. UI过渡
- 使用轻微的边缘效果
- 调整圆心位置指向交互点
- 使用缓动函数控制进度变化

### 4. 双纹理混合
- 利用圆形遮罩实现两个纹理的平滑混合
- 配合动画调整进度实现动态切换效果
- 适用于材质变化、状态切换等场景

### 5. 特殊效果
- 冲击波：高亮边缘+快速扩展
- 能量护盾：反向过渡+适当边缘宽度
- 传送门：高亮边缘+循环动画

## 五、动画实现示例

### 1. 使用Tween动画控制进度
```typescript
import { tween, Vec3 } from 'cc';

// 获取材质
const material = this.getComponent(Sprite).getMaterial(0);

// 从内到外的动画
tween(material)
    .to(1.0, { getProperty('progress'): 1.0 }, { easing: 'cubicOut' })
    .start();
    
// 从外到内的动画
material.setProperty('isReverse', 1);
tween(material)
    .to(1.0, { getProperty('progress'): 1.0 }, { easing: 'cubicIn' })
    .start();
```

### 2. 鼠标点击位置设置圆心
```typescript
import { EventTouch, Vec2, UITransform } from 'cc';

// 监听点击事件
this.node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
    // 获取材质
    const material = this.getComponent(Sprite).getMaterial(0);
    
    // 获取点击位置
    const touchPos = event.getUILocation();
    const nodePos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
    
    // 转换为0-1范围的UV坐标
    const nodeSize = this.node.getComponent(UITransform).contentSize;
    const centerX = (nodePos.x + nodeSize.width/2) / nodeSize.width;
    const centerY = (nodePos.y + nodeSize.height/2) / nodeSize.height;
    
    // 设置圆心位置
    material.setProperty('centerX', centerX);
    material.setProperty('centerY', centerY);
    
    // 开始动画
    tween(material)
        .set({ getProperty('progress'): 0.0 })
        .to(0.8, { getProperty('progress'): 1.0 }, { easing: 'quartOut' })
        .start();
});
```

## 六、调试技巧

### 1. 使用调试模式
- 设置 `debugMode` 为 1 查看遮罩效果
- 设置 `debugMode` 为 2 查看边缘效果
- 设置 `debugMode` 为 3 查看距离场

### 2. 渐进式调整
1. 先设置基本的圆心和进度
2. 调整边缘宽度获取平滑过渡
3. 设置边缘颜色和亮度
4. 微调各参数获取最佳效果

### 3. 常见问题解决
- 如果效果不明显：增加`edgeBrightness`或调整`edgeWidth`
- 如果圆形不对称：检查`centerX`和`centerY`设置
- 如果边缘过于锐利：增加`edgeWidth`参数
- 如果过渡不连续：检查`isReverse`设置是否正确

## 七、性能优化

### 1. 参数优化
- `edgeWidth`不要过大，会增加计算量
- 动态调整时使用缓存减少参数设置次数

### 2. 使用时机
- 场景切换结束后释放或重置材质
- 使用合适的纹理大小，避免过大纹理

### 3. 渲染优化
- 考虑使用`RenderTexture`减少动态更新
- 对于频繁使用的效果，考虑预计算部分结果

## 八、高级技巧

### 1. 多重效果叠加
- 使用多个节点叠加不同参数的效果
- 通过透明度和混合模式创造复合效果

### 2. 与粒子系统结合
- 在边缘位置生成粒子效果
- 配合shader动画创造更丰富的视觉效果

### 3. 自定义变体
- 基于此效果创建更多自定义效果
- 添加噪声、扭曲等额外特效 