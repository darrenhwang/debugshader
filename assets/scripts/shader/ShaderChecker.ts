import { _decorator, Component, Material, log, error } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShaderChecker')
export class ShaderChecker extends Component {
    @property(Material)
    material: Material | null = null;

    start() {
        this.checkShaderSetup();
    }

    checkShaderSetup() {
        if (!this.material) {
            error('ShaderChecker: Material not assigned!');
            return;
        }

        const problems: string[] = [];
        
        // 1. 检查Effect资源
        if (!this.material.effectAsset) {
            problems.push('Effect asset not found');
            error('ShaderChecker: Problems found:', problems);
            return;
        }
        
        // 2. 检查技术和通道
        const effect = this.material.effectAsset;
        if (!effect.techniques || effect.techniques.length === 0) {
            problems.push('No techniques found in effect');
            error('ShaderChecker: Problems found:', problems);
            return;
        }

        // 检查第一个技术的通道
        const technique = effect.techniques[0];
        if (!technique.passes || technique.passes.length === 0) {
            problems.push('No passes found in technique');
            error('ShaderChecker: Problems found:', problems);
            return;
        }
        
        // 3. 检查材质通道的属性
        if (this.material.passes.length > 0) {
            const currentPass = this.material.passes[0];
            if (!currentPass) {
                problems.push('Material pass not found');
            } else {
                // 检查必要的属性
                const requiredProps = ['mainTexture', 'tilingOffset', 'color'];
                for (const propName of requiredProps) {
                    try {
                        const handle = currentPass.getHandle(propName);
                        if (handle === undefined || handle === null) {
                            problems.push(`Property ${propName} not found in pass`);
                        }
                    } catch (e) {
                        problems.push(`Error checking property ${propName}: ${e}`);
                    }
                }

                // 检查属性值
                const props = currentPass.properties;
                if (props) {
                    for (const key in props) {
                        const prop = props[key];
                        if (!prop || typeof prop.value === 'undefined') {
                            problems.push(`Property ${key} has no value`);
                        }
                    }
                }
            }
        } else {
            problems.push('No passes found in material');
        }
        
        // 输出检查结果
        if (problems.length > 0) {
            error('ShaderChecker: Problems found:', problems);
        } else {
            log('ShaderChecker: Shader setup looks good!');
            this.checkRuntime();
        }
    }

    // 运行时检查方法
    checkRuntime() {
        if (!this.material) return;

        try {
            const pass = this.material.passes[0];
            if (pass) {
                // 检查uniform值是否有效
                const mainTextureHandle = pass.getHandle('mainTexture');
                if (mainTextureHandle === undefined || mainTextureHandle === null) {
                    error('ShaderChecker: mainTexture uniform not found');
                } else {
                    log('ShaderChecker: mainTexture handle:', mainTextureHandle);
                }

                // 检查 tilingOffset
                const tilingHandle = pass.getHandle('tilingOffset');
                if (tilingHandle === undefined || tilingHandle === null) {
                    error('ShaderChecker: tilingOffset uniform not found');
                } else {
                    log('ShaderChecker: tilingOffset handle:', tilingHandle);
                }

                // 检查 color
                const colorHandle = pass.getHandle('color');
                if (colorHandle === undefined || colorHandle === null) {
                    error('ShaderChecker: color uniform not found');
                } else {
                    log('ShaderChecker: color handle:', colorHandle);
                }
            }
        } catch (e) {
            error('ShaderChecker: Runtime check failed:', e);
        }
    }
} 