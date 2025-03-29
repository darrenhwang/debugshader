# 淡入淡出效果（FadeTransition）使用文档

## 效果概述

淡入淡出效果（FadeTransition）是一种简单而实用的透明度过渡效果，通过控制对象的透明度实现平滑的显示或隐藏动画。该效果适用于场景切换、UI元素过渡、对象出现/消失等多种场景。

## 基本参数

| 参数名称 | 类型 | 范围 | 默认值 | 说明 |
|---------|------|------|--------|------|
| mainTexture | Texture | - | white | 要显示的纹理 |
| progress | Float | 0.0 - 1.0 | 0.0 | 过渡进度，0表示完全显示，1表示完全透明 |

## 使用方法

### 基础设置

1. 在 Cocos Creator 中创建一个新的材质：
   - 在资源面板中右键选择"创建 → 材质"
   - 为新材质命名（例如：FadeMaterial）

2. 将材质的效果设置为"FadeTransition"：
   - 在材质检查器中，点击"效果"下拉菜单
   - 选择"FadeTransition"效果

3. 将材质应用到精灵（Sprite）组件上：
   - 选择目标节点
   - 在检查器中的Sprite组件下，将自定义材质设置为刚创建的材质

4. 通过调整progress参数控制淡入淡出效果：
   - progress = 0.0：完全显示（不透明）
   - progress = 1.0：完全隐藏（透明）
   - 中间值：部分透明

### 代码控制

```typescript
// 获取材质引用
const material = this.getComponent(cc.Sprite).getMaterial(0);

// 设置过渡进度
material.setProperty('progress', 0.5); // 半透明状态
```

### 动画效果示例

```typescript
// 在组件中创建动画效果
@ccclass('FadeTransitionDemo')
export class FadeTransitionDemo extends Component {
    @property(Sprite)
    private sprite: Sprite = null;
    
    private material: Material = null;
    
    start() {
        // 获取材质引用
        this.material = this.sprite.getMaterial(0);
    }
    
    // 淡入效果（从透明到不透明）
    fadeIn(duration: number = 1.0) {
        // 设置初始状态为完全透明
        this.material.setProperty('progress', 1.0);
        
        // 创建淡入动作序列
        const fadeAction = tween(this.material)
            .to(duration, { 
                // 注意：需要使用setProperty方式更新材质参数
                progress: 0.0
            }, {
                onUpdate: (target, ratio) => {
                    const value = 1.0 - ratio;
                    target.setProperty('progress', value);
                }
            });
            
        return fadeAction;
    }
    
    // 淡出效果（从不透明到透明）
    fadeOut(duration: number = 1.0) {
        // 设置初始状态为完全不透明
        this.material.setProperty('progress', 0.0);
        
        // 创建淡出动作序列
        const fadeAction = tween(this.material)
            .to(duration, { 
                // 注意：需要使用setProperty方式更新材质参数
                progress: 1.0
            }, {
                onUpdate: (target, ratio) => {
                    target.setProperty('progress', ratio);
                }
            });
            
        return fadeAction;
    }
    
    // 使用示例
    onFadeInButtonClick() {
        this.fadeIn(1.0).start();
    }
    
    onFadeOutButtonClick() {
        this.fadeOut(1.0).start();
    }
}
```

## 效果预设

### 快速淡入（0.3秒）
```typescript
this.material.setProperty('progress', 1.0); // 起始状态：透明
tween(this.material)
    .to(0.3, {}, {
        onUpdate: (target, ratio) => {
            target.setProperty('progress', 1.0 - ratio);
        }
    })
    .start();
```

### 慢速淡出（2秒）
```typescript
this.material.setProperty('progress', 0.0); // 起始状态：不透明
tween(this.material)
    .to(2.0, {}, {
        onUpdate: (target, ratio) => {
            target.setProperty('progress', ratio);
        }
    })
    .start();
```

### 闪烁效果
```typescript
// 闪烁效果（交替淡入淡出）
flashEffect(times: number = 3, duration: number = 0.5) {
    let sequence = [];
    
    for (let i = 0; i < times; i++) {
        // 添加淡出动作
        sequence.push(
            tween().to(duration / 2, {}, {
                onUpdate: (target, ratio) => {
                    this.material.setProperty('progress', ratio);
                }
            })
        );
        
        // 添加淡入动作
        sequence.push(
            tween().to(duration / 2, {}, {
                onUpdate: (target, ratio) => {
                    this.material.setProperty('progress', 1.0 - ratio);
                }
            })
        );
    }
    
    return tween(this.node).sequence(sequence);
}
```

## 使用场景

1. **场景转换**：在两个场景之间平滑过渡
2. **UI元素显示/隐藏**：为菜单、对话框等UI元素添加平滑的显示和隐藏效果
3. **游戏对象出现/消失**：为游戏中的角色、道具等对象添加淡入淡出效果
4. **文本渐变效果**：为文本添加淡入淡出效果，增强阅读体验
5. **过场动画**：作为过场动画的一部分，与其他效果结合使用

## 性能优化建议

1. **避免过多实例**：该效果使用了alpha混合，过多实例可能影响性能
2. **及时清理**：过渡完成后，可以考虑:
   - 对于淡出到完全透明的对象，设置`node.active = false`或销毁节点
   - 对于不再需要动态调整透明度的对象，恢复使用标准材质
3. **精简纹理大小**：对于仅作为过渡效果的纹理，适当减小分辨率

## 注意事项与常见问题

1. **progress参数说明**
   - 0.0：完全不透明（100%显示）
   - 1.0：完全透明（0%显示）
   - 这与某些系统中alpha值的逻辑相反，请特别注意

2. **与节点opacity属性的区别**
   - 节点的opacity属性：影响整个节点及其子节点
   - 淡入淡出效果：仅影响使用该材质的精灵组件
   - 建议仅使用其中一种方式控制透明度，避免混淆

## 总结

淡入淡出效果（FadeTransition）是一种简单而实用的透明度过渡效果，可以轻松应用于Cocos Creator项目中的各种场景。通过调整progress参数，可以实现从完全显示到完全透明的平滑过渡，为游戏和应用添加专业的视觉效果。

该效果的实现简单高效，确保了跨平台兼容性，您可以放心地在各种目标平台上使用它，而无需担心兼容性问题。
