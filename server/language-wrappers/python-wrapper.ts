import { spawn, ChildProcess } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

interface PythonExecution {
  id: string;
  code: string;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage: number;
  status: 'success' | 'error' | 'timeout';
  libraries: string[];
}

interface AIModelResult {
  prediction: any;
  confidence: number;
  modelType: string;
  processingTime: number;
}

export class PythonWrapper {
  private static instance: PythonWrapper;
  private activeProcesses: Map<string, ChildProcess> = new Map();
  private executionHistory: PythonExecution[] = [];

  public static getInstance(): PythonWrapper {
    if (!PythonWrapper.instance) {
      PythonWrapper.instance = new PythonWrapper();
    }
    return PythonWrapper.instance;
  }

  // Execute Python code with comprehensive library support
  async executePythonCode(code: string, libraries: string[] = []): Promise<PythonExecution> {
    const executionId = Date.now().toString();
    const startTime = Date.now();
    
    // Create temporary Python file
    const tempFile = join(__dirname, `temp_${executionId}.py`);
    
    // Add library imports and error handling
    const fullCode = `
import sys
import traceback
import time
import os

# Import requested libraries
${libraries.map(lib => `
try:
    import ${lib}
    print(f"✓ ${lib} imported successfully")
except ImportError as e:
    print(f"✗ Failed to import ${lib}: {e}")
`).join('')}

try:
    # User code execution
    ${code}
    
    print(f"\\nExecution completed successfully")
    
except Exception as e:
    print(f"Error: {str(e)}")
    traceback.print_exc()
    sys.exit(1)
`;

    writeFileSync(tempFile, fullCode);

    return new Promise((resolve) => {
      let output = '';
      let error = '';

      const pythonProcess = spawn('python3', [tempFile], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONPATH: process.env.PYTHONPATH || '' }
      });

      this.activeProcesses.set(executionId, pythonProcess);

      pythonProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr?.on('data', (data) => {
        error += data.toString();
      });

      const timeout = setTimeout(() => {
        pythonProcess.kill();
        this.cleanup(executionId, tempFile);
        
        const execution: PythonExecution = {
          id: executionId,
          code,
          output: output || 'Execution timed out',
          error: 'Execution timed out after 30 seconds',
          executionTime: 30000,
          memoryUsage: 0,
          status: 'timeout',
          libraries
        };
        
        this.executionHistory.push(execution);
        resolve(execution);
      }, 30000);

      pythonProcess.on('close', (code) => {
        clearTimeout(timeout);
        this.cleanup(executionId, tempFile);
        
        const executionTime = Date.now() - startTime;

        const execution: PythonExecution = {
          id: executionId,
          code,
          output,
          error: error || undefined,
          executionTime,
          memoryUsage: Math.random() * 100, // Simulated for demo
          status: code === 0 ? 'success' : 'error',
          libraries
        };

        this.executionHistory.push(execution);
        resolve(execution);
      });
    });
  }

  // AI/ML model inference wrapper
  async runAIModel(modelType: 'tensorflow' | 'pytorch' | 'opencv' | 'sklearn', data: any): Promise<AIModelResult> {
    const startTime = Date.now();
    
    let code = '';
    switch (modelType) {
      case 'tensorflow':
        code = `
import numpy as np
print("TensorFlow model simulation")
prediction = np.random.random()
confidence = 0.95
print(f"Prediction: {prediction}")
print(f"Confidence: {confidence}")
`;
        break;
        
      case 'pytorch':
        code = `
import numpy as np
print("PyTorch model simulation")
prediction = np.random.random()
confidence = 0.92
print(f"Prediction: {prediction}")
print(f"Confidence: {confidence}")
`;
        break;
        
      case 'opencv':
        code = `
import numpy as np
print("OpenCV processing simulation")
contours = np.random.randint(5, 50)
confidence = contours / 100.0
print(f"Detected contours: {contours}")
print(f"Confidence: {confidence}")
`;
        break;
        
      case 'sklearn':
        code = `
import numpy as np
print("Scikit-learn model simulation")
prediction = np.random.randint(0, 2)
confidence = 0.88
print(f"Prediction: {prediction}")
print(f"Confidence: {confidence}")
`;
        break;
    }

    const libraries = ['numpy'];
    const execution = await this.executePythonCode(code, libraries);
    
    // Parse results from output
    const predictionMatch = execution.output.match(/Prediction: ([\d.-]+)/);
    const confidenceMatch = execution.output.match(/Confidence: ([\d.-]+)/);
    
    return {
      prediction: predictionMatch ? parseFloat(predictionMatch[1]) : null,
      confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0,
      modelType,
      processingTime: Date.now() - startTime
    };
  }

  // Get execution history and performance metrics
  getExecutionMetrics() {
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(e => e.status === 'success').length;
    const averageExecutionTime = this.executionHistory.reduce((sum, e) => sum + e.executionTime, 0) / (totalExecutions || 1);
    const totalMemoryUsage = this.executionHistory.reduce((sum, e) => sum + e.memoryUsage, 0);

    return {
      totalExecutions,
      successfulExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
      averageExecutionTime,
      totalMemoryUsage,
      activeProcesses: this.activeProcesses.size,
      recentExecutions: this.executionHistory.slice(-5)
    };
  }

  private cleanup(executionId: string, tempFile: string) {
    this.activeProcesses.delete(executionId);
    if (existsSync(tempFile)) {
      unlinkSync(tempFile);
    }
  }

  // Kill all active processes
  killAllProcesses() {
    this.activeProcesses.forEach((process) => {
      process.kill();
    });
    this.activeProcesses.clear();
  }
}

export const pythonWrapper = PythonWrapper.getInstance();