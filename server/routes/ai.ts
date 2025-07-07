import { Request, Response, Router } from 'express';
import { aiOrchestrator } from '../../lib/ai-orchestrator';

const router = Router();

// Get AI system status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = aiOrchestrator.getSystemStatus();
    const agents = aiOrchestrator.getAgents();
    
    res.json({
      success: true,
      data: {
        ...status,
        agents: agents.map(agent => ({
          id: agent.id,
          name: agent.name,
          status: agent.status,
          successRate: agent.successRate,
          lastAction: agent.lastAction
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get recent AI decisions
router.get('/decisions', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const decisions = aiOrchestrator.getRecentDecisions(limit);
    
    res.json({
      success: true,
      data: decisions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute a specific decision
router.post('/decisions/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await aiOrchestrator.executeDecision(id);
    
    res.json({
      success,
      message: success ? 'Decision executed successfully' : 'Failed to execute decision'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// AI voice interaction
router.post('/interact', async (req: Request, res: Response) => {
  try {
    const { query, agentId } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    const interaction = await aiOrchestrator.processVoiceInteraction(query, agentId);
    
    res.json({
      success: true,
      data: interaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate video content
router.post('/generate-video', async (req: Request, res: Response) => {
  try {
    const { topic, style = 'educational' } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    const videoScript = await aiOrchestrator.generateVideoContent(topic, style);
    
    res.json({
      success: true,
      data: {
        topic,
        style,
        script: videoScript,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get market analysis
router.get('/market-analysis', async (req: Request, res: Response) => {
  try {
    const analysis = await aiOrchestrator.analyzeMarketConditions();
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Code optimization
router.post('/optimize-code', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const optimization = await aiOrchestrator.optimizeCode(code);
    
    res.json({
      success: true,
      data: optimization
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get recent interactions
router.get('/interactions', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const interactions = aiOrchestrator.getRecentInteractions(limit);
    
    res.json({
      success: true,
      data: interactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Control autonomous mode
router.post('/autonomous', async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    
    aiOrchestrator.setAutonomousMode(enabled);
    
    res.json({
      success: true,
      message: `Autonomous mode ${enabled ? 'enabled' : 'disabled'}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Manual override controls
router.post('/override/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { enable } = req.body;
    
    if (enable) {
      aiOrchestrator.enableManualOverride(type);
    } else {
      aiOrchestrator.disableManualOverride(type);
    }
    
    res.json({
      success: true,
      message: `Manual override for ${type} ${enable ? 'enabled' : 'disabled'}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;