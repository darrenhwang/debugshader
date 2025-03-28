import { _decorator, Component, Material, log, error, warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShaderDebug')
export class ShaderDebug extends Component {
    @property(Material)
    material: Material | null = null;

    @property
    debugMode: boolean = false;

    start() {
        this.debugShader();
    }

    debugShader() {
        if (!this.material) {
            error('ShaderDebug: Material not assigned!');
            return;
        }

        try {
            // 打印着色器基本信息
            log('Shader Debug Info:');
            log('Effect name:', this.material.effectName);
            log('Shader defines:', this.material.defines);
            log('Pass count:', this.material.passes.length);

            // 检查每个pass
            this.material.passes.forEach((pass, index) => {
                log(`Pass ${index} info:`, {
                    properties: pass.properties,
                    blendState: pass.blendState,
                    rasterizerState: pass.rasterizerState,
                    depthStencilState: pass.depthStencilState
                });
            });

            // 检查uniform值
            const pass = this.material.passes[0];
            if (pass) {
                const mainTextureHandle = pass.getHandle('mainTexture');
                log('mainTexture handle:', mainTextureHandle);
            }

            // 性能检查
            this.checkPerformance();
        } catch (e) {
            error('ShaderDebug: Error during debug:', e);
        }
    }

    private checkPerformance() {
        if (!this.material) return;

        const pass = this.material.passes[0];
        if (!pass) return;

        // 检查uniform数量
        const uniformCount = Object.keys(pass.properties).length;
        if (uniformCount > 10) {
            warn('ShaderDebug: High uniform count detected:', uniformCount);
        }

        // 检查纹理采样数量
        const textureCount = Object.keys(pass.properties)
            .filter(key => pass.properties[key].type === 'sampler2D').length;
        if (textureCount > 4) {
            warn('ShaderDebug: High texture sample count:', textureCount);
        }
    }

    // 用于运行时切换调试模式
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        this.debugShader();
    }
} 