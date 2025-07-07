// NVIDIA RTX and Game Development Integration for CryptoQuest Platform
// Supporting DLSS 4, RTX Neural Rendering, ACE AI Characters, and more

export interface NVIDIAConfig {
  dlss: {
    enabled: boolean;
    version: '4.0' | '3.0' | '2.0';
    quality: 'Performance' | 'Balanced' | 'Quality' | 'Ultra Performance';
    multiFrameGeneration: boolean;
    rayReconstruction: boolean;
  };
  rtx: {
    rayTracing: boolean;
    globalIllumination: boolean;
    reflections: boolean;
    shadows: boolean;
    pathTracing: boolean;
    neuralRendering: boolean;
  };
  ace: {
    enabled: boolean;
    characterAI: boolean;
    conversationalNPCs: boolean;
    visionLanguageModel: boolean;
    contextAwareness: boolean;
  };
  reflex: {
    enabled: boolean;
    version: '2.0' | '1.0';
    lowLatencyMode: boolean;
    boostMode: boolean;
    systemLatencyMonitoring: boolean;
  };
  broadcast: {
    noiseRemoval: boolean;
    virtualBackground: boolean;
    autoFrame: boolean;
    eyeContact: boolean;
  };
}

export interface RTXPerformanceMetrics {
  fps: number;
  frameTime: number;
  gpuUtilization: number;
  vramUsage: number;
  cpuUtilization: number;
  systemLatency: number;
  renderLatency: number;
  dlssPerformanceGain: number;
  rayTracingCost: number;
  aiProcessingTime: number;
}

export interface ACECharacterConfig {
  name: string;
  personality: 'assistant' | 'companion' | 'advisor' | 'trader' | 'guide';
  voiceModel: string;
  knowledgeDomain: string[];
  contextMemory: number; // In MB
  responseStyle: 'professional' | 'casual' | 'technical' | 'friendly';
  emotionalRange: 'minimal' | 'moderate' | 'expressive';
  multimodal: boolean;
}

export interface NeuralRenderingSettings {
  denoising: boolean;
  upscaling: boolean;
  temporalAccumulation: boolean;
  aiEnhancedLighting: boolean;
  materialGeneration: boolean;
  proceduralTextures: boolean;
  realTimeGI: boolean;
}

// Main NVIDIA RTX Integration Class
export class NVIDIARTXManager {
  private config: NVIDIAConfig;
  private performanceMetrics: RTXPerformanceMetrics;
  private aceCharacters: Map<string, ACECharacterConfig> = new Map();
  private canvas: HTMLCanvasElement | null = null;
  private webglContext: WebGL2RenderingContext | null = null;

  constructor(config: NVIDIAConfig) {
    this.config = config;
    this.performanceMetrics = this.initializeMetrics();
  }

  // Initialize performance metrics
  private initializeMetrics(): RTXPerformanceMetrics {
    return {
      fps: 60,
      frameTime: 16.67,
      gpuUtilization: 0,
      vramUsage: 0,
      cpuUtilization: 0,
      systemLatency: 0,
      renderLatency: 0,
      dlssPerformanceGain: 0,
      rayTracingCost: 0,
      aiProcessingTime: 0
    };
  }

  // Initialize WebGL context with RTX optimizations
  public initializeWebGL(canvasId: string): boolean {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas not found');
      return false;
    }

    // Request WebGL2 context with RTX-optimized settings
    const contextAttributes: WebGLContextAttributes = {
      alpha: false,
      depth: true,
      stencil: false,
      antialias: this.config.dlss.enabled ? false : true, // Let DLSS handle AA
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: false
    };

    this.webglContext = this.canvas.getContext('webgl2', contextAttributes);
    
    if (!this.webglContext) {
      console.error('WebGL2 not supported');
      return false;
    }

    // Enable RTX-specific extensions if available
    this.enableRTXExtensions();
    
    return true;
  }

  // Enable RTX-specific WebGL extensions
  private enableRTXExtensions(): void {
    if (!this.webglContext) return;

    const extensions = [
      'EXT_color_buffer_float',
      'EXT_texture_filter_anisotropic',
      'WEBGL_depth_texture',
      'OES_texture_float_linear',
      'EXT_shader_texture_lod',
      'WEBGL_debug_renderer_info'
    ];

    extensions.forEach(ext => {
      const extension = this.webglContext!.getExtension(ext);
      if (extension) {
        console.log(`RTX Extension enabled: ${ext}`);
      }
    });

    // Check for RTX-specific capabilities
    this.detectRTXCapabilities();
  }

  // Detect RTX capabilities
  private detectRTXCapabilities(): void {
    if (!this.webglContext) return;

    const debugInfo = this.webglContext.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = this.webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      const vendor = this.webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      
      console.log('GPU Renderer:', renderer);
      console.log('GPU Vendor:', vendor);

      // Detect RTX capabilities
      if (renderer.includes('RTX') || renderer.includes('GeForce')) {
        console.log('RTX GPU detected - enabling advanced features');
        this.enableAdvancedRTXFeatures();
      }
    }
  }

  // Enable advanced RTX features
  private enableAdvancedRTXFeatures(): void {
    // Enable DLSS simulation (WebGL approximation)
    if (this.config.dlss.enabled) {
      this.initializeDLSSSimulation();
    }

    // Enable ray tracing simulation
    if (this.config.rtx.rayTracing) {
      this.initializeRayTracingSimulation();
    }

    // Enable neural rendering features
    if (this.config.rtx.neuralRendering) {
      this.initializeNeuralRendering();
    }
  }

  // DLSS 4.0 simulation for web environments
  private initializeDLSSSimulation(): void {
    console.log('Initializing DLSS 4.0 simulation...');
    
    // Create upscaling shaders that simulate DLSS behavior
    const dlssVertexShader = `#version 300 es
      in vec4 a_position;
      in vec2 a_texcoord;
      out vec2 v_texcoord;
      
      void main() {
        gl_Position = a_position;
        v_texcoord = a_texcoord;
      }
    `;

    const dlssFragmentShader = `#version 300 es
      precision highp float;
      
      uniform sampler2D u_texture;
      uniform sampler2D u_motionVectors;
      uniform sampler2D u_depthBuffer;
      uniform vec2 u_resolution;
      uniform float u_jitterOffset;
      uniform float u_sharpening;
      
      in vec2 v_texcoord;
      out vec4 fragColor;
      
      // DLSS-inspired temporal upsampling
      vec4 temporalUpsampling(vec2 uv) {
        vec4 currentFrame = texture(u_texture, uv);
        vec2 motion = texture(u_motionVectors, uv).xy;
        vec2 prevUV = uv - motion;
        
        // Multi-frame generation simulation
        vec4 accumulatedColor = currentFrame;
        for(int i = 1; i <= 4; i++) {
          vec2 offsetUV = uv + vec2(u_jitterOffset) * float(i) / u_resolution;
          accumulatedColor += texture(u_texture, offsetUV) * (1.0 / float(i + 1));
        }
        
        return accumulatedColor / 4.0;
      }
      
      // AI-inspired sharpening filter
      vec4 neuralSharpening(vec2 uv, vec4 color) {
        vec2 texelSize = 1.0 / u_resolution;
        vec4 sharp = color * 5.0;
        sharp -= texture(u_texture, uv + vec2(texelSize.x, 0.0));
        sharp -= texture(u_texture, uv - vec2(texelSize.x, 0.0));
        sharp -= texture(u_texture, uv + vec2(0.0, texelSize.y));
        sharp -= texture(u_texture, uv - vec2(0.0, texelSize.y));
        
        return mix(color, sharp, u_sharpening);
      }
      
      void main() {
        vec4 upsampled = temporalUpsampling(v_texcoord);
        vec4 sharpened = neuralSharpening(v_texcoord, upsampled);
        fragColor = sharpened;
      }
    `;

    // Store shaders for later use
    this.createShaderProgram('dlss', dlssVertexShader, dlssFragmentShader);
  }

  // Ray tracing simulation using compute shaders
  private initializeRayTracingSimulation(): void {
    console.log('Initializing RTX ray tracing simulation...');

    const rayTracingShader = `#version 300 es
      precision highp float;
      
      uniform vec3 u_cameraPos;
      uniform vec3 u_lightPos;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform sampler2D u_sceneTexture;
      uniform sampler2D u_normalTexture;
      uniform sampler2D u_materialTexture;
      
      in vec2 v_texcoord;
      out vec4 fragColor;
      
      struct Ray {
        vec3 origin;
        vec3 direction;
      };
      
      struct Hit {
        bool hit;
        float distance;
        vec3 point;
        vec3 normal;
        vec3 material;
      };
      
      // Simplified ray-sphere intersection
      Hit intersectSphere(Ray ray, vec3 center, float radius) {
        Hit hit;
        vec3 oc = ray.origin - center;
        float a = dot(ray.direction, ray.direction);
        float b = 2.0 * dot(oc, ray.direction);
        float c = dot(oc, oc) - radius * radius;
        float discriminant = b * b - 4.0 * a * c;
        
        if (discriminant < 0.0) {
          hit.hit = false;
          return hit;
        }
        
        float t = (-b - sqrt(discriminant)) / (2.0 * a);
        if (t > 0.0) {
          hit.hit = true;
          hit.distance = t;
          hit.point = ray.origin + t * ray.direction;
          hit.normal = normalize(hit.point - center);
          hit.material = vec3(0.8, 0.8, 0.8);
        } else {
          hit.hit = false;
        }
        
        return hit;
      }
      
      // RTX Global Illumination simulation
      vec3 globalIllumination(vec3 point, vec3 normal, vec3 material) {
        vec3 gi = vec3(0.0);
        
        // Ambient occlusion approximation
        float ao = 1.0;
        for(int i = 0; i < 8; i++) {
          float angle = float(i) * 0.785398; // PI/4
          vec3 sampleDir = vec3(cos(angle), sin(angle), 0.5);
          sampleDir = normalize(sampleDir);
          
          Ray aoRay;
          aoRay.origin = point + normal * 0.01;
          aoRay.direction = sampleDir;
          
          // Check occlusion (simplified)
          Hit aoHit = intersectSphere(aoRay, vec3(0.0, 0.0, 0.0), 2.0);
          if (aoHit.hit && aoHit.distance < 0.5) {
            ao -= 0.1;
          }
        }
        
        ao = max(ao, 0.2);
        gi = material * ao * 0.3;
        
        return gi;
      }
      
      // RTX Reflections
      vec3 rayTracedReflections(vec3 point, vec3 normal, vec3 viewDir) {
        vec3 reflectDir = reflect(viewDir, normal);
        
        Ray reflectRay;
        reflectRay.origin = point + normal * 0.01;
        reflectRay.direction = reflectDir;
        
        // Sample environment (simplified)
        vec3 envColor = vec3(0.1, 0.3, 0.6); // Sky color
        
        // Check for reflections
        Hit reflectHit = intersectSphere(reflectRay, u_lightPos, 0.2);
        if (reflectHit.hit) {
          envColor = vec3(1.0, 0.9, 0.7); // Light reflection
        }
        
        return envColor * 0.4;
      }
      
      void main() {
        vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;
        
        // Create primary ray
        Ray ray;
        ray.origin = u_cameraPos;
        ray.direction = normalize(vec3(uv.x, uv.y, -1.0));
        
        // Trace primary ray
        Hit hit = intersectSphere(ray, vec3(0.0, 0.0, -3.0), 1.0);
        
        vec3 color = vec3(0.1, 0.2, 0.4); // Background
        
        if (hit.hit) {
          vec3 lightDir = normalize(u_lightPos - hit.point);
          float NdotL = max(dot(hit.normal, lightDir), 0.0);
          
          // Direct lighting
          vec3 directLight = hit.material * NdotL;
          
          // Global illumination
          vec3 gi = globalIllumination(hit.point, hit.normal, hit.material);
          
          // Reflections
          vec3 reflections = rayTracedReflections(hit.point, hit.normal, -ray.direction);
          
          color = directLight + gi + reflections;
        }
        
        fragColor = vec4(color, 1.0);
      }
    `;

    this.createShaderProgram('raytracing', '', rayTracingShader);
  }

  // Neural rendering initialization
  private initializeNeuralRendering(): void {
    console.log('Initializing RTX Neural Rendering...');

    // Neural denoising shader
    const neuralDenoisingShader = `#version 300 es
      precision highp float;
      
      uniform sampler2D u_noisyTexture;
      uniform sampler2D u_normalTexture;
      uniform sampler2D u_depthTexture;
      uniform sampler2D u_motionTexture;
      uniform vec2 u_resolution;
      uniform float u_time;
      
      in vec2 v_texcoord;
      out vec4 fragColor;
      
      // Neural network-inspired denoising
      vec4 neuralDenoise(vec2 uv) {
        vec4 center = texture(u_noisyTexture, uv);
        vec3 normal = texture(u_normalTexture, uv).xyz;
        float depth = texture(u_depthTexture, uv).r;
        vec2 motion = texture(u_motionTexture, uv).xy;
        
        vec2 texelSize = 1.0 / u_resolution;
        vec4 accumulated = vec4(0.0);
        float totalWeight = 0.0;
        
        // Multi-layer sampling pattern
        for(int i = -2; i <= 2; i++) {
          for(int j = -2; j <= 2; j++) {
            vec2 offset = vec2(float(i), float(j)) * texelSize;
            vec2 sampleUV = uv + offset;
            
            vec4 sampleColor = texture(u_noisyTexture, sampleUV);
            vec3 sampleNormal = texture(u_normalTexture, sampleUV).xyz;
            float sampleDepth = texture(u_depthTexture, sampleUV).r;
            
            // Weight based on normal, depth, and spatial distance
            float normalWeight = max(0.0, dot(normal, sampleNormal));
            float depthWeight = 1.0 - abs(depth - sampleDepth) * 50.0;
            float spatialWeight = exp(-length(offset) * 100.0);
            
            float weight = normalWeight * depthWeight * spatialWeight;
            weight = max(weight, 0.01);
            
            accumulated += sampleColor * weight;
            totalWeight += weight;
          }
        }
        
        return accumulated / totalWeight;
      }
      
      void main() {
        vec4 denoised = neuralDenoise(v_texcoord);
        fragColor = denoised;
      }
    `;

    this.createShaderProgram('neural_denoising', '', neuralDenoisingShader);
  }

  // Create shader program
  private createShaderProgram(name: string, vertexSource: string, fragmentSource: string): void {
    if (!this.webglContext) return;

    // Basic vertex shader if not provided
    if (!vertexSource) {
      vertexSource = `#version 300 es
        in vec4 a_position;
        in vec2 a_texcoord;
        out vec2 v_texcoord;
        
        void main() {
          gl_Position = a_position;
          v_texcoord = a_texcoord;
        }
      `;
    }

    const vertexShader = this.compileShader(this.webglContext.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.compileShader(this.webglContext.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      console.error(`Failed to compile shaders for ${name}`);
      return;
    }

    const program = this.webglContext.createProgram();
    if (!program) {
      console.error(`Failed to create program for ${name}`);
      return;
    }

    this.webglContext.attachShader(program, vertexShader);
    this.webglContext.attachShader(program, fragmentShader);
    this.webglContext.linkProgram(program);

    if (!this.webglContext.getProgramParameter(program, this.webglContext.LINK_STATUS)) {
      console.error(`Program linking failed for ${name}:`, this.webglContext.getProgramInfoLog(program));
      return;
    }

    console.log(`RTX shader program '${name}' compiled successfully`);
  }

  // Compile individual shader
  private compileShader(type: number, source: string): WebGLShader | null {
    if (!this.webglContext) return null;

    const shader = this.webglContext.createShader(type);
    if (!shader) return null;

    this.webglContext.shaderSource(shader, source);
    this.webglContext.compileShader(shader);

    if (!this.webglContext.getShaderParameter(shader, this.webglContext.COMPILE_STATUS)) {
      console.error('Shader compilation failed:', this.webglContext.getShaderInfoLog(shader));
      this.webglContext.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // ACE AI Character Management
  public createACECharacter(config: ACECharacterConfig): void {
    this.aceCharacters.set(config.name, config);
    console.log(`ACE AI Character '${config.name}' created with personality: ${config.personality}`);
  }

  // Simulate ACE AI character interaction
  public async interactWithACECharacter(
    characterName: string,
    userInput: string,
    context?: any
  ): Promise<string> {
    const character = this.aceCharacters.get(characterName);
    if (!character) {
      throw new Error(`Character '${characterName}' not found`);
    }

    // Simulate AI processing time
    const processingTime = 200 + Math.random() * 300;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Generate context-aware response based on character config
    let response = '';
    
    switch (character.personality) {
      case 'trader':
        response = this.generateTraderResponse(userInput, context);
        break;
      case 'assistant':
        response = this.generateAssistantResponse(userInput, context);
        break;
      case 'guide':
        response = this.generateGuideResponse(userInput, context);
        break;
      default:
        response = this.generateGenericResponse(userInput, context);
    }

    // Update performance metrics
    this.performanceMetrics.aiProcessingTime = processingTime;

    return response;
  }

  // Generate trader-specific responses
  private generateTraderResponse(input: string, context: any): string {
    const responses = [
      "Based on current market conditions, I'd suggest monitoring the CQT/USDC pair for arbitrage opportunities.",
      "The risk-reward ratio on this trade looks favorable. Current confidence level is 94.7%.",
      "I'm detecting increased volatility in the Polygon network. Consider adjusting position sizes.",
      "Cross-chain arbitrage between Base and Polygon shows 12.8% profit potential.",
      "Market sentiment analysis indicates bullish momentum for the next 4-hour window."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Generate assistant-specific responses
  private generateAssistantResponse(input: string, context: any): string {
    const responses = [
      "I can help you navigate the DeFi dashboard. What specific feature would you like to explore?",
      "Your current portfolio shows strong diversification across 8 different pools.",
      "The holographic visualization is ready. Would you like me to adjust the rendering parameters?",
      "RTX acceleration is active, providing 8x performance improvement over traditional rendering.",
      "I've optimized your gas settings for minimum cost while maintaining transaction speed."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Generate guide-specific responses
  private generateGuideResponse(input: string, context: any): string {
    const responses = [
      "Let me walk you through the Uniswap V4 integration features in the DeFi dashboard.",
      "The holographic visualization uses advanced algorithms from HoloPy and OpenHolo libraries.",
      "NVIDIA DLSS 4.0 is enhancing your visual experience with multi-frame generation.",
      "For optimal arbitrage results, I recommend enabling all security layers including ZK-proofs.",
      "The AI Miner has optimized your staking positions for maximum yield."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Generate generic responses
  private generateGenericResponse(input: string, context: any): string {
    const responses = [
      "I understand your request. How can I assist you further?",
      "That's an interesting point. Let me process that information.",
      "I'm here to help with any questions about the platform.",
      "Would you like me to explain any specific features?",
      "I can provide more details if you need them."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Performance monitoring
  public updatePerformanceMetrics(): RTXPerformanceMetrics {
    // Simulate real-time performance data
    this.performanceMetrics.fps = 55 + Math.random() * 10;
    this.performanceMetrics.frameTime = 1000 / this.performanceMetrics.fps;
    this.performanceMetrics.gpuUtilization = 60 + Math.random() * 30;
    this.performanceMetrics.vramUsage = 4000 + Math.random() * 2000;
    this.performanceMetrics.cpuUtilization = 30 + Math.random() * 20;
    this.performanceMetrics.systemLatency = 15 + Math.random() * 10;
    this.performanceMetrics.renderLatency = 8 + Math.random() * 5;
    
    if (this.config.dlss.enabled) {
      this.performanceMetrics.dlssPerformanceGain = 2.5 + Math.random() * 5.5; // 2.5x to 8x improvement
    }
    
    if (this.config.rtx.rayTracing) {
      this.performanceMetrics.rayTracingCost = 20 + Math.random() * 15; // Performance cost
    }

    return this.performanceMetrics;
  }

  // Get current configuration
  public getConfig(): NVIDIAConfig {
    return { ...this.config };
  }

  // Update configuration
  public updateConfig(newConfig: Partial<NVIDIAConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('NVIDIA RTX configuration updated:', this.config);
  }

  // Get ACE characters
  public getACECharacters(): ACECharacterConfig[] {
    return Array.from(this.aceCharacters.values());
  }

  // Get performance metrics
  public getPerformanceMetrics(): RTXPerformanceMetrics {
    return { ...this.performanceMetrics };
  }
}

// NVIDIA RTX Gaming Utilities
export class RTXGameUtils {
  // Create optimized render settings based on hardware
  public static optimizeRenderSettings(
    hardwareProfile: 'RTX4090' | 'RTX4080' | 'RTX4070' | 'RTX3080' | 'RTX3070' | 'other'
  ): NVIDIAConfig {
    const baseConfig: NVIDIAConfig = {
      dlss: {
        enabled: true,
        version: '4.0',
        quality: 'Balanced',
        multiFrameGeneration: true,
        rayReconstruction: true
      },
      rtx: {
        rayTracing: true,
        globalIllumination: true,
        reflections: true,
        shadows: true,
        pathTracing: false,
        neuralRendering: true
      },
      ace: {
        enabled: true,
        characterAI: true,
        conversationalNPCs: true,
        visionLanguageModel: true,
        contextAwareness: true
      },
      reflex: {
        enabled: true,
        version: '2.0',
        lowLatencyMode: true,
        boostMode: true,
        systemLatencyMonitoring: true
      },
      broadcast: {
        noiseRemoval: true,
        virtualBackground: true,
        autoFrame: true,
        eyeContact: true
      }
    };

    // Adjust based on hardware profile
    switch (hardwareProfile) {
      case 'RTX4090':
        baseConfig.dlss.quality = 'Quality';
        baseConfig.rtx.pathTracing = true;
        break;
      case 'RTX4080':
        baseConfig.dlss.quality = 'Balanced';
        baseConfig.rtx.pathTracing = true;
        break;
      case 'RTX4070':
        baseConfig.dlss.quality = 'Performance';
        baseConfig.rtx.pathTracing = false;
        break;
      case 'RTX3080':
        baseConfig.dlss.version = '3.0';
        baseConfig.dlss.quality = 'Performance';
        baseConfig.rtx.pathTracing = false;
        break;
      case 'RTX3070':
        baseConfig.dlss.version = '3.0';
        baseConfig.dlss.quality = 'Ultra Performance';
        baseConfig.rtx.globalIllumination = false;
        baseConfig.rtx.pathTracing = false;
        break;
      default:
        baseConfig.dlss.enabled = false;
        baseConfig.rtx.rayTracing = false;
        baseConfig.rtx.globalIllumination = false;
        baseConfig.rtx.reflections = false;
        baseConfig.rtx.shadows = false;
        baseConfig.rtx.neuralRendering = false;
    }

    return baseConfig;
  }

  // Calculate expected performance improvement
  public static calculatePerformanceGain(config: NVIDIAConfig): {
    dlssGain: number;
    rtxCost: number;
    netImprovement: number;
  } {
    let dlssGain = 1.0;
    let rtxCost = 1.0;

    if (config.dlss.enabled) {
      switch (config.dlss.quality) {
        case 'Ultra Performance':
          dlssGain = config.dlss.multiFrameGeneration ? 8.0 : 3.0;
          break;
        case 'Performance':
          dlssGain = config.dlss.multiFrameGeneration ? 6.0 : 2.5;
          break;
        case 'Balanced':
          dlssGain = config.dlss.multiFrameGeneration ? 4.0 : 2.0;
          break;
        case 'Quality':
          dlssGain = config.dlss.multiFrameGeneration ? 3.0 : 1.7;
          break;
      }
    }

    if (config.rtx.rayTracing) {
      rtxCost = 1.5;
      if (config.rtx.globalIllumination) rtxCost += 0.3;
      if (config.rtx.reflections) rtxCost += 0.2;
      if (config.rtx.shadows) rtxCost += 0.2;
      if (config.rtx.pathTracing) rtxCost += 1.0;
    }

    const netImprovement = dlssGain / rtxCost;

    return { dlssGain, rtxCost, netImprovement };
  }
}