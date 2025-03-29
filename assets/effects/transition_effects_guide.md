# 过渡效果使用指南

## 概述

过渡效果是在游戏中实现场景切换、界面转换或特殊视觉效果的重要工具。本项目提供了四种不同类型的过渡效果，每种效果都有其独特的视觉风格和适用场景。本指南将帮助您了解如何选择、使用和自定义这些效果。

## 可用效果

| 效果名称 | 文件名 | 特点 | 适用场景 |
|---------|-------|------|---------|
| 圆形过渡 | circle_transition.effect | 从中心向外扩散的圆形过渡，支持自定义中心点和边缘发光 | 技能释放、场景切换、UI过渡 |
| 百叶窗过渡 | blinds_transition.effect | 类似百叶窗的条带过渡效果，支持方向控制和条带数量调整 | 界面切换、场景转换、特殊效果 |
| 波浪过渡 | wave_transition.effect | 波浪状过渡效果，支持波浪参数调整和方向控制 | 水相关场景、魔法效果、UI动画 |
| 涡旋过渡 | vortex_transition.effect | 旋转扭曲的过渡效果，支持中心点控制和旋转速度调整 | 传送门、魔法漩涡、时空扭曲 |

## 基本使用流程

### 1. 创建材质

1. 在 Cocos Creator 的资源面板中，右键选择 `创建 -> 材质`
2. 为新材质命名（例如 `CircleTransitionMat`）

### 2. 设置效果

1. 选择创建的材质
2. 在属性检查器中，点击 `Effect` 下拉菜单
3. 选择所需的过渡效果（例如 `circle_transition`）
4. 调整参数至适合的值

### 3. 应用到精灵

1. 在场景中创建一个 Sprite 节点
2. 将该节点的材质属性设置为刚才创建的材质
3. 确保 Sprite 的大小覆盖需要过渡的区域

### 4. 控制过渡

通过脚本控制过渡效果的进度（progress）参数：

```typescript
// 获取材质引用
const material = this.getComponent(Sprite).getMaterial(0);

// 设置过渡进度（0.0 - 1.0）
material.setProperty('progress', value);
```

## 选择合适的效果

### 根据视觉需求选择

- **圆形过渡**：适合表现集中爆发或从一点扩散的效果
- **百叶窗过渡**：适合干净利落的UI切换或机械感的场景转换
- **波浪过渡**：适合流体、水相关或有机形态的过渡
- **涡旋过渡**：适合表现扭曲、传送或魔法漩涡效果

### 根据性能需求选择

性能消耗从低到高：
1. 圆形过渡（计算最简单）
2. 百叶窗过渡
3. 波浪过渡
4. 涡旋过渡（计算最复杂）

## 高级使用技巧

### 组合多种效果

可以在不同层次使用不同的过渡效果，创造复合视觉效果：

```typescript
// 前景使用圆形过渡
this.foregroundMaterial.setProperty('progress', value);

// 背景使用波浪过渡
this.backgroundMaterial.setProperty('progress', value * 0.8); // 稍有延迟
```

### 动态参数调整

除了过渡进度外，还可以动态调整其他参数：

```typescript
// 动态改变圆形过渡的中心点
material.setProperty('centerX', 0.5 + Math.sin(time) * 0.2);
material.setProperty('centerY', 0.5 + Math.cos(time) * 0.2);
```

### 创建自定义过渡序列

组合多个过渡效果创建复杂的过渡序列：

```typescript
// 过渡序列示例
async startTransitionSequence() {
    // 第一步：圆形收缩
    await this.animateTransition(this.circleMaterial, 1.0, 0.0, 0.5);
    
    // 第二步：加载新场景
    await this.loadNewScene();
    
    // 第三步：波浪展开
    await this.animateTransition(this.waveMaterial, 0.0, 1.0, 0.8);
}

// 动画辅助函数
async animateTransition(material, from, to, duration) {
    return new Promise(resolve => {
        // 实现过渡动画并在完成时调用resolve
        // ...
    });
}
```

## 性能优化建议

1. **避免过度使用**：同时使用多个过渡效果会显著增加GPU负担
2. **简化参数**：减少波浪数量、降低效果复杂度
3. **限制范围**：可以在较小的区域应用过渡效果，而不是全屏
4. **预加载资源**：确保过渡前所有纹理都已加载完成
5. **适当降级**：在低性能设备上自动使用更简单的过渡效果

## 常见问题

### 效果显示不正确

- 检查材质是否正确应用到精灵上
- 确认纹理已正确设置
- 验证精灵大小和位置是否正确

### 性能问题

- 减少效果复杂度（波浪数量、边缘宽度等）
- 检查是否同时应用了过多效果
- 考虑使用更简单的过渡效果

### 过渡不平滑

- 确保进度值变化平滑
- 调整过渡持续时间
- 优化游戏帧率

## 进一步学习

要了解各效果的详细用法，请参考各效果的专门文档：

- [圆形过渡效果使用说明](./circle_transition_usage.md)
- [百叶窗过渡效果使用说明](./blinds_transition_usage.md)
- [波浪过渡效果使用说明](./wave_transition_usage.md)
- [涡旋过渡效果使用说明](./vortex_transition_usage.md)

## 自定义效果

如果需要创建自定义过渡效果，可以参考现有效果的shader代码，修改片段着色器中的过渡逻辑部分。常见的自定义方向包括：

1. 修改过渡形状（如菱形、星形等）
2. 添加扭曲或模糊效果
3. 结合粒子或噪声图实现特殊效果
4. 添加颜色变换或后处理效果 