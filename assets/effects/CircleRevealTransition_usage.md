# 圆形揭示转场效果（CircleRevealTransition）使用文档

## 一、效果概述

圆形揭示转场效果是一种从指定圆心位置逐渐显示或隐藏内容的过渡效果。它支持自定义圆心位置、边缘平滑度以及转场方向。该效果适用于场景切换、UI元素展示、技能释放等需要吸引注意力到特定位置的应用场景。

## 二、基本参数

| 参数名称 | 类型 | 范围 | 默认值 | 说明 |
|---------|------|------|--------|------|
| mainTexture | Texture | - | white | 要显示的纹理 |
| progress | Float | 0.0 - 1.0 | 0.5 | 转场进度，值越大，圆形范围越大 |
| centerX | Float | 0.0 - 1.0 | 0.5 | 圆心在X轴的位置（UV空间） |
| centerY | Float | 0.0 - 1.0 | 0.5 | 圆心在Y轴的位置（UV空间） |
| smoothness | Float | 0.01 - 0.2 | 0.05 | 边缘平滑过渡的宽度 |
| reverse | Int | 0 - 1 | 0 | 转场方向（0: 从外到内，1: 从内到外） |

## 三、使用方法

### 基础设置

1. 在 Cocos Creator 中创建一个新的材质：
   - 在资源面板中右键选择"创建 → 材质"
   - 为新材质命名（例如：CircleRevealMaterial）

2. 将材质的效果设置为"CircleRevealTransition"：
   - 在材质检查器中，点击"效果"下拉菜单
   - 选择"CircleRevealTransition"效果

3. 将材质应用到精灵（Sprite）组件上：
   - 选择目标节点
   - 在检查器中的Sprite组件下，将自定义材质设置为刚创建的材质

4. 调整参数以获得所需效果：
   - 设置合适的圆心位置（centerX，centerY）
   - 调整平滑度（smoothness）获得理想的边缘过渡效果
   - 选择转场方向（reverse）

### 代码控制

```typescript
// 获取材质引用
const material = this.getComponent(cc.Sprite).getMaterial(0);

// 设置转场参数
material.setProperty('centerX', 0.5);  // 将圆心设为中心
material.setProperty('centerY', 0.5);
material.setProperty('progress', 0.3); // 设置进度
material.setProperty('smoothness', 0.05); // 设置边缘平滑度
material.setProperty('reverse', 0);    // 设置为从外到内
```

### 动画效果示例

```typescript
// 在组件中创建动画效果
@ccclass('CircleRevealDemo')
export class CircleRevealDemo extends Component {
    @property(Sprite)
    private sprite: Sprite = null;
    
    private material: Material = null;
    
    start() {
        // 获取材质引用
        this.material = this.sprite.getMaterial(0);
    }
    
    // 从点击位置展开效果
    revealFromPoint(event: EventTouch) {
        const touchPos = event.getUILocation();
        const nodePos = this.node.getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        
        // 转换为0-1范围的UV坐标
        const nodeSize = this.node.getComponent(UITransform).contentSize;
        const centerX = (nodePos.x + nodeSize.width/2) / nodeSize.width;
        const centerY = (nodePos.y + nodeSize.height/2) / nodeSize.height;
        
        // 设置参数
        this.material.setProperty('centerX', centerX);
        this.material.setProperty('centerY', centerY);
        this.material.setProperty('reverse', 1); // 从内到外
        
        // 创建动画
        tween(this.material)
            .set({ 
                // 初始状态
                progress: 0.01 
            })
            .to(1.0, { 
                // 终止状态 
            }, {
                onUpdate: (target, ratio) => {
                    target.setProperty('progress', ratio);
                }
            })
            .start();
    }
    
    // 向点击位置收缩效果
    concealToPoint(event: EventTouch) {
        const touchPos = event.getUILocation();
        const nodePos = this.node.getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        
        // 转换为0-1范围的UV坐标
        const nodeSize = this.node.getComponent(UITransform).contentSize;
        const centerX = (nodePos.x + nodeSize.width/2) / nodeSize.width;
        const centerY = (nodePos.y + nodeSize.height/2) / nodeSize.height;
        
        // 设置参数
        this.material.setProperty('centerX', centerX);
        this.material.setProperty('centerY', centerY);
        this.material.setProperty('reverse', 0); // 从外到内
        
        // 创建动画
        tween(this.material)
            .set({ 
                // 初始状态
                progress: 1.0
            })
            .to(1.0, { 
                // 终止状态 
            }, {
                onUpdate: (target, ratio) => {
                    target.setProperty('progress', 1.0 - ratio);
                }
            })
            .start();
    }
}
```

## 四、效果预设

### 从中心展开
```typescript
material.setProperty('centerX', 0.5);
material.setProperty('centerY', 0.5);
material.setProperty('smoothness', 0.05);
material.setProperty('reverse', 1);

// 动画
tween(material)
    .set({ progress: 0.0 })
    .to(1.0, {}, {
        onUpdate: (target, ratio) => {
            target.setProperty('progress', ratio);
        },
        easing: 'quartOut'
    })
    .start();
```

### 向中心收缩
```typescript
material.setProperty('centerX', 0.5);
material.setProperty('centerY', 0.5);
material.setProperty('smoothness', 0.05);
material.setProperty('reverse', 0);

// 动画
tween(material)
    .set({ progress: 1.0 })
    .to(1.0, {}, {
        onUpdate: (target, ratio) => {
            target.setProperty('progress', 1.0 - ratio);
        },
        easing: 'quartIn'
    })
    .start();
```

### 从角落展开
```typescript
material.setProperty('centerX', 0.0);
material.setProperty('centerY', 0.0);
material.setProperty('smoothness', 0.1);
material.setProperty('reverse', 1);

// 动画
tween(material)
    .set({ progress: 0.0 })
    .to(1.2, {}, {
        onUpdate: (target, ratio) => {
            target.setProperty('progress', ratio);
        },
        easing: 'cubicOut'
    })
    .start();
```

### 锐利边缘效果
```typescript
material.setProperty('centerX', 0.5);
material.setProperty('centerY', 0.5);
material.setProperty('smoothness', 0.01);
material.setProperty('reverse', 1);

// 动画
tween(material)
    .set({ progress: 0.0 })
    .to(0.8, {}, {
        onUpdate: (target, ratio) => {
            target.setProperty('progress', ratio);
        },
        easing: 'linear'
    })
    .start();
```

### 柔和边缘效果
```typescript
material.setProperty('centerX', 0.5);
material.setProperty('centerY', 0.5);
material.setProperty('smoothness', 0.15);
material.setProperty('reverse', 1);

// 动画
tween(material)
    .set({ progress: 0.0 })
    .to(1.2, {}, {
        onUpdate: (target, ratio) => {
            target.setProperty('progress', ratio);
        },
        easing: 'sineInOut'
    })
    .start();
```

## 五、使用场景

### 1. 场景转换
```typescript
// 在场景管理器中
transitionToScene(nextScene: string) {
    // 创建全屏覆盖的精灵
    const transitionNode = this.createFullScreenNode();
    const sprite = transitionNode.getComponent(Sprite);
    const material = sprite.getMaterial(0);
    
    // 设置参数
    material.setProperty('centerX', 0.5);
    material.setProperty('centerY', 0.5);
    material.setProperty('smoothness', 0.1);
    material.setProperty('reverse', 0); // 从外到内
    
    // 执行收缩动画
    tween(material)
        .set({ progress: 1.0 })
        .to(0.8, {}, {
            onUpdate: (target, ratio) => {
                target.setProperty('progress', 1.0 - ratio);
            }
        })
        .call(() => {
            // 加载下一个场景
            director.loadScene(nextScene, () => {
                // 设置为从内到外的效果
                material.setProperty('reverse', 1);
                
                // 执行展开动画
                tween(material)
                    .set({ progress: 0.0 })
                    .to(0.8, {}, {
                        onUpdate: (target, ratio) => {
                            target.setProperty('progress', ratio);
                        }
                    })
                    .call(() => {
                        transitionNode.destroy();
                    })
                    .start();
            });
        })
        .start();
}
```

### 2. UI元素展示
```typescript
// 展示对话框
showDialog() {
    this.dialogNode.active = true;
    const sprite = this.dialogNode.getComponent(Sprite);
    const material = sprite.getMaterial(0);
    
    // 设置参数
    material.setProperty('centerX', 0.5);
    material.setProperty('centerY', 0.5);
    material.setProperty('smoothness', 0.05);
    material.setProperty('reverse', 1); // 从内到外
    
    // 执行展开动画
    tween(material)
        .set({ progress: 0.0 })
        .to(0.3, {}, {
            onUpdate: (target, ratio) => {
                target.setProperty('progress', ratio);
            },
            easing: 'backOut'
        })
        .start();
}

// 隐藏对话框
hideDialog() {
    const sprite = this.dialogNode.getComponent(Sprite);
    const material = sprite.getMaterial(0);
    
    // 设置参数
    material.setProperty('centerX', 0.5);
    material.setProperty('centerY', 0.5);
    material.setProperty('smoothness', 0.05);
    material.setProperty('reverse', 0); // 从外到内
    
    // 执行收缩动画
    tween(material)
        .set({ progress: 1.0 })
        .to(0.3, {}, {
            onUpdate: (target, ratio) => {
                target.setProperty('progress', 1.0 - ratio);
            },
            easing: 'backIn'
        })
        .call(() => {
            this.dialogNode.active = false;
        })
        .start();
}
```

### 3. 技能释放效果
```typescript
// 技能释放位置的圆形展开效果
castSkill(position: Vec3) {
    // 创建技能效果节点
    const effectNode = this.createEffectNode();
    const sprite = effectNode.getComponent(Sprite);
    const material = sprite.getMaterial(0);
    
    // 设置世界坐标到UV坐标的转换
    const worldPos = position;
    const nodePos = effectNode.getComponent(UITransform)
        .convertToNodeSpaceAR(worldPos);
    
    // 转换为0-1范围的UV坐标
    const nodeSize = effectNode.getComponent(UITransform).contentSize;
    const centerX = (nodePos.x + nodeSize.width/2) / nodeSize.width;
    const centerY = (nodePos.y + nodeSize.height/2) / nodeSize.height;
    
    // 设置参数
    material.setProperty('centerX', centerX);
    material.setProperty('centerY', centerY);
    material.setProperty('smoothness', 0.1);
    material.setProperty('reverse', 1); // 从内到外
    
    // 执行快速展开动画
    tween(material)
        .set({ progress: 0.0 })
        .to(0.5, {}, {
            onUpdate: (target, ratio) => {
                target.setProperty('progress', ratio);
            },
            easing: 'quartOut'
        })
        .call(() => {
            // 技能释放完成
            effectNode.destroy();
        })
        .start();
}
```

## 六、性能优化建议

1. **避免过多实例**：该效果使用了距离计算和平滑函数，过多实例可能影响性能
2. **调整平滑度**：
   - 较小的`smoothness`值（如0.01-0.03）计算量较小
   - 较大的`smoothness`值（如0.1-0.2）虽视觉效果更佳但计算量较大
3. **尺寸考量**：
   - 对于大型背景或全屏转场，可以考虑使用较小的平滑度值
   - 对于小型UI元素，可以使用较大的平滑度值以获得更好的视觉效果
4. **及时清理**：
   - 转场结束后，及时销毁或重置不再需要的节点和材质
   - 对于频繁使用的场景，考虑使用对象池管理这些效果节点

## 七、注意事项与常见问题

1. **参数关系说明**
   - `progress`与`reverse`参数配合使用效果更佳
   - 当`reverse = 0`时，`progress`值越小，显示的圆形区域越大
   - 当`reverse = 1`时，`progress`值越大，显示的圆形区域越大

2. **边界情况处理**
   - 当圆心（centerX, centerY）设置在屏幕外时，可能需要更大的`progress`值才能完成转场
   - 对于非正方形的目标节点，圆形效果会呈现为椭圆形，需要考虑宽高比调整

3. **常见问题排查**
   - 如果效果不明显：检查`progress`值是否在合适范围内
   - 如果边缘过于锐利：增加`smoothness`值
   - 如果转场方向相反：检查`reverse`值是否正确

## 八、进阶应用

### 多重圆形揭示
```typescript
// 创建多个圆形揭示效果，从不同位置同时展开
createMultiReveal() {
    const positions = [
        {x: 0.2, y: 0.2},
        {x: 0.8, y: 0.2},
        {x: 0.5, y: 0.8}
    ];
    
    positions.forEach(pos => {
        const node = this.createRevealNode();
        const sprite = node.getComponent(Sprite);
        const material = sprite.getMaterial(0);
        
        material.setProperty('centerX', pos.x);
        material.setProperty('centerY', pos.y);
        material.setProperty('smoothness', 0.05);
        material.setProperty('reverse', 1);
        
        tween(material)
            .set({ progress: 0.0 })
            .to(0.8, {}, {
                onUpdate: (target, ratio) => {
                    target.setProperty('progress', ratio);
                }
            })
            .start();
    });
}
```

### 脉冲效果
```typescript
// 创建一个循环的脉冲效果
createPulseEffect() {
    const material = this.node.getComponent(Sprite).getMaterial(0);
    
    material.setProperty('centerX', 0.5);
    material.setProperty('centerY', 0.5);
    material.setProperty('smoothness', 0.15);
    material.setProperty('reverse', 1);
    
    // 创建循环动画
    tween(material)
        .set({ progress: 0.0 })
        .to(1.0, {}, {
            onUpdate: (target, ratio) => {
                target.setProperty('progress', ratio);
            }
        })
        .set({ progress: 0.0 })
        .union()
        .repeatForever()
        .start();
}
```

## 九、总结

圆形揭示转场效果（CircleRevealTransition）是一种简单而实用的视觉转场效果，可以轻松应用于Cocos Creator项目中的各种场景。通过调整圆心位置、平滑度和转场方向等参数，可以实现多种风格的视觉效果，为游戏和应用增添专业的视觉体验。

该效果不仅可用于常规的场景切换，还可以作为UI元素的展示/隐藏效果，或者作为游戏中技能释放、能量波动等特效的基础。其简单的实现和灵活的参数控制使其成为各类交互式应用的理想选择。
