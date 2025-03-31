好的，我来创建一个详细的使用文档：

# 火焰与烟雾特效使用文档

## 一、效果概述

本文档包含两个主要特效：
1. 火焰效果 (FireEffect)：实现动态、自然的火焰效果，包含内外焰层和脉冲动画
2. 烟雾效果 (SmokeEffect)：实现柔和、飘动的烟雾效果，包含扩散和漂移动画

## 二、基础设置

### 1. 文件结构
```
assets/
  └─ effects/
      ├─ FireEffect.effect    // 火焰shader效果
      └─ SmokeEffect.effect   // 烟雾shader效果
```

### 2. 纹理要求

#### 主纹理 (mainTexture)
- 火焰纹理：
  - 推荐尺寸：64x64 或 128x128
  - 格式：带Alpha通道的PNG
  - 内容：从下到上的渐变图案
  - 压缩：建议使用DXT5/BC3

- 烟雾纹理：
  - 推荐尺寸：128x128 或 256x256
  - 格式：带Alpha通道的PNG
  - 内容：柔和的云状图案
  - 压缩：建议使用DXT5/BC3

#### 噪声纹理 (noiseTexture)
- 推荐尺寸：256x256
- 格式：单通道灰度图
- 内容：Perlin噪声或Worley噪声
- 压缩：可使用DXT1/BC1

## 三、参数详解

### 1. 火焰效果参数 (FireEffect)

#### 颜色参数
| 参数名 | 默认值 | 说明 |
|--------|---------|------|
| baseColor | [1.0, 0.3, 0.0, 1.0] | 火焰底部颜色 |
| tipColor | [1.0, 0.7, 0.0, 1.0] | 火焰顶部颜色 |
| innerColor | [1.0, 0.5, 0.0, 1.0] | 内焰颜色 |
| outerColor | [1.0, 0.2, 0.0, 1.0] | 外焰颜色 |
| pulseColor | [1.0, 0.8, 0.0, 1.0] | 脉冲高亮颜色 |

#### 动画参数
| 参数名 | 范围 | 默认值 | 说明 |
|--------|------|---------|------|
| gradientStrength | 0.0-2.0 | 1.0 | 渐变强度 |
| waveSpeed | 0.0-5.0 | 1.0 | 波动速度 |
| waveScale | 0.0-2.0 | 1.0 | 波动幅度 |
| distortionStrength | 0.0-0.5 | 0.1 | 扭曲强度 |
| innerFlameScale | 0.0-1.0 | 0.8 | 内焰比例 |
| noiseScale | 0.1-5.0 | 1.0 | 噪声缩放 |
| noiseSpeed | 0.0-2.0 | 0.5 | 噪声动画速度 |
| pulseSpeed | 0.0-5.0 | 2.0 | 脉冲速度 |
| pulseScale | 0.0-1.0 | 0.2 | 脉冲强度 |

### 2. 烟雾效果参数 (SmokeEffect)

#### 颜色参数
| 参数名 | 默认值 | 说明 |
|--------|---------|------|
| baseColor | [0.3, 0.3, 0.3, 1.0] | 烟雾底部颜色 |
| tipColor | [0.7, 0.7, 0.7, 1.0] | 烟雾顶部颜色 |
| innerColor | [0.5, 0.5, 0.5, 1.0] | 内层颜色 |
| outerColor | [0.2, 0.2, 0.2, 1.0] | 外层颜色 |
| driftColor | [0.4, 0.4, 0.4, 1.0] | 扩散颜色 |

#### 动画参数
| 参数名 | 范围 | 默认值 | 说明 |
|--------|------|---------|------|
| gradientStrength | 0.0-2.0 | 1.0 | 渐变强度 |
| waveSpeed | 0.0-5.0 | 0.5 | 波动速度 |
| waveScale | 0.0-2.0 | 0.5 | 波动幅度 |
| distortionStrength | 0.0-0.5 | 0.05 | 扭曲强度 |
| innerSmokeScale | 0.0-1.0 | 0.6 | 内层比例 |
| noiseScale | 0.1-5.0 | 0.5 | 噪声缩放 |
| noiseSpeed | 0.0-2.0 | 0.2 | 噪声动画速度 |
| driftSpeed | 0.0-2.0 | 0.3 | 扩散速度 |
| driftScale | 0.0-1.0 | 0.1 | 扩散强度 |

## 四、使用示例

### 1. 基础使用
```typescript
// 创建火焰材质
const fireMaterial = new Material();
fireMaterial.initialize({
    effectName: 'FireEffect',
    defines: { USE_TEXTURE: true }
});

// 创建烟雾材质
const smokeMaterial = new Material();
smokeMaterial.initialize({
    effectName: 'SmokeEffect',
    defines: { USE_TEXTURE: true }
});
```

### 2. 参数调整示例
```typescript
// 调整火焰参数
fireMaterial.setProperty('pulseSpeed', 2.5);
fireMaterial.setProperty('distortionStrength', 0.15);
fireMaterial.setProperty('baseColor', new Color(1.0, 0.3, 0.0, 1.0));

// 调整烟雾参数
smokeMaterial.setProperty('driftSpeed', 0.4);
smokeMaterial.setProperty('noiseScale', 0.6);
smokeMaterial.setProperty('innerSmokeScale', 0.7);
```

## 五、性能优化建议

### 1. 纹理优化
- 使用合适大小的纹理，避免过大
- 对噪声纹理使用较低的压缩格式
- 考虑使用纹理图集合并多个效果

### 2. 参数优化
- `distortionStrength`: 保持在0.1以下以减少计算量
- `noiseScale`: 较大值可能导致采样频繁，建议保持在1.0左右
- `waveSpeed`: 过快的速度会增加GPU负担

### 3. 渲染优化
- 控制同屏特效数量
- 远处特效可使用简化版本
- 使用LOD系统管理特效细节

## 六、常见问题解决

### 1. 性能问题
- 问题：特效运行卡顿
- 解决：
  - 降低纹理分辨率
  - 减小噪声采样频率
  - 简化动画参数

### 2. 视觉问题
- 问题：效果过于锐利或模糊
- 解决：
  - 调整 `gradientStrength` 参数
  - 检查纹理设置是否正确
  - 微调混合模式参数

### 3. 动画问题
- 问题：动画不连贯
- 解决：
  - 检查 `waveSpeed` 和 `noiseSpeed` 设置
  - 确保纹理循环无缝
  - 调整 `distortionStrength` 值

## 七、最佳实践

1. 参数调优顺序：
   - 先调整基础颜色
   - 再调整动画速度
   - 最后微调扭曲和特效参数

2. 性能优化：
   - 使用合适的纹理大小和格式
   - 避免过度使用扭曲效果
   - 控制同屏特效数量

3. 视觉效果：
   - 保持颜色协调
   - 确保动画流畅自然
   - 适当使用混合效果
