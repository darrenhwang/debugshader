创建和调试 Cocos Creator 3.8 的着色器 2D 非3D:

着色器语法参考地址：https://docs.cocos.com/creator/3.8/manual/zh/shader/effect-syntax.html

项目需求：因为最近通过ai生成的着色器都不能被编辑加载存在问题。所以以当前的cocoscreator 3.8.2 生成的2d空仓库为基础 开发一个着色器调试工具。
1. **从最简单的着色器开始**
首先创建一个最基础的可运行着色器:

```glsl
CCEffect %{
  techniques:
  - name: opaque
    passes:
    - vert: sprite-vs:vert
      frag: sprite-fs:frag
      properties:
        mainTexture: { value: white }
}%

CCProgram sprite-vs %{
  precision highp float;
  #include <cc-global>
  
  in vec3 a_position;
  in vec2 a_texCoord;
  
  out vec2 v_uv0;
  
  vec4 vert () {
    v_uv0 = a_texCoord;
    return cc_matViewProj * vec4(a_position, 1);
  }
}%

CCProgram sprite-fs %{
  precision highp float;
  
  in vec2 v_uv0;
  
  uniform sampler2D mainTexture;
  
  vec4 frag () {
    return texture(mainTexture, v_uv0);
  }
}%
```

2. **调试步骤**

a. **检查语法错误**:
```typescript
// 创建调试脚本 ShaderDebug.ts
import { _decorator, Component, Material, log, error } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShaderDebug')
export class ShaderDebug extends Component {
    @property(Material)
    material: Material | null = null;

    start() {
        this.debugShader();
    }

    debugShader() {
        if (!this.material) {
            error('Material not assigned!');
            return;
        }

        // 打印着色器信息
        log('Effect name:', this.material.effectName);
        log('Shader defines:', this.material.defines);
        log('Pass index:', this.material.passes);
        
        // 尝试获取uniform值
        try {
            const handle = this.material.passes[0].getHandle('mainTexture');
            log('mainTexture handle:', handle);
        } catch (e) {
            error('Failed to get uniform handle:', e);
        }
    }
}
```

b. **逐步添加功能**:
```glsl
// 1. 先测试基本渲染
CCEffect %{
  techniques:
  - name: opaque
    passes:
    - vert: sprite-vs:vert
      frag: sprite-fs:frag
      properties:
        mainTexture: { value: white }
}%

// 2. 添加颜色支持
properties:
  mainTexture: { value: white }
  mainColor: { value: [1, 1, 1, 1], editor: { type: color } }

// 3. 添加混合状态
blendState:
  targets:
  - blend: true
    blendSrc: src_alpha
    blendDst: one_minus_src_alpha

// 4. 逐步添加其他功能
```

3. **常见问题检查清单**:

```typescript
// 创建检查清单脚本 ShaderChecker.ts
@ccclass('ShaderChecker')
export class ShaderChecker extends Component {
    checkShaderSetup() {
        const problems = [];
        
        // 1. 检查文件命名
        if (!this.material?.effectAsset) {
            problems.push('Effect asset not found');
        }
        
        // 2. 检查语法结构
        const effect = this.material?.effectAsset;
        if (effect) {
            if (!effect.techniques?.length) {
                problems.push('No techniques defined');
            }
            
            if (!effect.techniques[0].passes?.length) {
                problems.push('No passes defined');
            }
        }
        
        // 3. 检查属性定义
        const props = this.material?.passes[0].properties;
        if (props) {
            for (const key in props) {
                if (!props[key].value) {
                    problems.push(`Property ${key} has no default value`);
                }
            }
        }
        
        // 输出问题列表
        if (problems.length > 0) {
            error('Shader problems found:', problems);
        } else {
            log('Shader setup looks good!');
        }
    }
}
```

4. **开发建议**:

```typescript
// 1. 使用版本控制
// effect-version.ts
const EFFECT_VERSION = {
    CURRENT: '1.0.0',
    checkCompatibility(material: Material) {
        // 检查材质版本兼容性
        return material.getProperty('_version') === this.CURRENT;
    }
};

// 2. 添加调试开关
uniform Debug {
    float debugView;  // 0: normal, 1: uv, 2: normal
};

// 3. 分步骤开发
// - 先实现基本功能
// - 添加一个功能就测试一次
// - 保存可用的中间版本
```

5. **实用调试技巧**:

```glsl
// 1. 在片段着色器中输出调试颜色
vec4 frag() {
    #if DEBUG_UV
        return vec4(v_uv0, 0, 1); // 显示UV坐标
    #endif
    
    #if DEBUG_NORMAL
        return vec4(v_normal * 0.5 + 0.5, 1); // 显示法线
    #endif
    
    // 正常渲染
    return texture(mainTexture, v_uv0);
}

// 2. 添加调试变量
uniform Debug {
    vec4 debugColor;
    float debugValue;
};
```

6. **性能优化检查**:

```typescript
// ShaderProfiler.ts
@ccclass('ShaderProfiler')
export class ShaderProfiler extends Component {
    @property(Material)
    material: Material | null = null;

    profileShader() {
        // 检查uniform数量
        const uniformCount = this.material?.passes[0].properties.size;
        if (uniformCount > 10) {
            warn('High uniform count:', uniformCount);
        }

        // 检查纹理采样数量
        const textureCount = Object.keys(this.material?.passes[0].properties)
            .filter(key => this.material?.passes[0].properties[key].type === 'sampler2D').length;
        if (textureCount > 4) {
            warn('High texture sample count:', textureCount);
        }
    }
}
```
说明：若我让你创建一个着色器，可以按照基础到完善的过程生成多个着色器，如warp.effect，可以同时创建warp0.effect
warp1.effect warp2.effect .。。。文件 不断完善着色器功能，我会一个个去看哪个加载有问题来分析当前增加的部分的问题

另外测试着色器的场景请告诉我如何手动去创建