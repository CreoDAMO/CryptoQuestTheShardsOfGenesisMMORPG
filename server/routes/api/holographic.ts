// Holographic Visualization API Routes for CryptoQuest Platform
import { Router, Request, Response } from 'express';
import { HolographicEngine, HolographicGameUtils } from '../../../lib/holographic-engine';

const router = Router();

// Initialize holographic engine
const holographicConfig = {
  reconstruction: 'angular_spectrum' as const,
  propagationDistance: 0.1, // 10cm
  wavelength: 532e-9, // Green laser wavelength
  pixelPitch: 10e-6, // 10 micrometers
  filterType: 'gaussian' as const,
  phaseUnwrapping: true,
  noiseReduction: true
};

const holoEngine = new HolographicEngine(holographicConfig);

// Generate financial hologram
router.post('/financial', async (req: Request, res: Response) => {
  try {
    const { priceData, volumeData, timeLabels, config } = req.body;
    
    if (!priceData || !volumeData || !Array.isArray(priceData) || !Array.isArray(volumeData)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid price or volume data'
      });
    }

    // Generate holographic representation of financial data
    const hologramData = HolographicGameUtils.createFinancialHologram(
      priceData,
      volumeData,
      timeLabels || []
    );

    // Apply reconstruction algorithm
    const reconstructed = holoEngine.reconstructHologram(hologramData);
    
    // Convert to displayable format
    const displayData = {
      width: reconstructed.width,
      height: reconstructed.height,
      amplitudeData: Array.from(reconstructed.amplitude),
      phaseData: Array.from(reconstructed.phase),
      wavelength: reconstructed.wavelength,
      pixelSize: reconstructed.pixelSize
    };

    res.json({
      success: true,
      data: {
        hologram: displayData,
        config: holographicConfig,
        reconstruction: 'angular_spectrum'
      }
    });
  } catch (error) {
    console.error('Financial hologram error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate financial hologram'
    });
  }
});

// Generate arbitrage opportunities hologram
router.post('/arbitrage', async (req: Request, res: Response) => {
  try {
    const { opportunities, config } = req.body;
    
    if (!opportunities || !Array.isArray(opportunities)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid opportunities data'
      });
    }

    // Generate holographic representation of arbitrage opportunities
    const hologramData = HolographicGameUtils.createArbitrageHologram(opportunities);

    // Apply reconstruction algorithm
    const reconstructed = holoEngine.reconstructHologram(hologramData);
    
    // Convert to displayable format
    const displayData = {
      width: reconstructed.width,
      height: reconstructed.height,
      amplitudeData: Array.from(reconstructed.amplitude),
      phaseData: Array.from(reconstructed.phase),
      wavelength: reconstructed.wavelength,
      pixelSize: reconstructed.pixelSize
    };

    res.json({
      success: true,
      data: {
        hologram: displayData,
        config: holographicConfig,
        opportunities: opportunities.length
      }
    });
  } catch (error) {
    console.error('Arbitrage hologram error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate arbitrage hologram'
    });
  }
});

// Generate synthetic test hologram
router.post('/synthetic', async (req: Request, res: Response) => {
  try {
    const { width = 256, height = 256, wavelength = 532e-9, pixelSize = 10e-6 } = req.body;
    
    // Generate synthetic hologram for testing
    const syntheticHologram = holoEngine.generateSyntheticHologram(
      width,
      height,
      wavelength,
      pixelSize
    );

    // Apply reconstruction
    const reconstructed = holoEngine.reconstructHologram(syntheticHologram);
    
    const displayData = {
      width: reconstructed.width,
      height: reconstructed.height,
      amplitudeData: Array.from(reconstructed.amplitude),
      phaseData: Array.from(reconstructed.phase),
      wavelength: reconstructed.wavelength,
      pixelSize: reconstructed.pixelSize
    };

    res.json({
      success: true,
      data: {
        hologram: displayData,
        type: 'synthetic',
        reconstruction: holographicConfig.reconstruction
      }
    });
  } catch (error) {
    console.error('Synthetic hologram error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate synthetic hologram'
    });
  }
});

// Update holographic configuration
router.post('/config', async (req: Request, res: Response) => {
  try {
    const { 
      reconstruction, 
      propagationDistance, 
      wavelength, 
      pixelPitch, 
      filterType, 
      phaseUnwrapping, 
      noiseReduction 
    } = req.body;
    
    const newConfig = {
      reconstruction: reconstruction || holographicConfig.reconstruction,
      propagationDistance: propagationDistance || holographicConfig.propagationDistance,
      wavelength: wavelength || holographicConfig.wavelength,
      pixelPitch: pixelPitch || holographicConfig.pixelPitch,
      filterType: filterType || holographicConfig.filterType,
      phaseUnwrapping: phaseUnwrapping !== undefined ? phaseUnwrapping : holographicConfig.phaseUnwrapping,
      noiseReduction: noiseReduction !== undefined ? noiseReduction : holographicConfig.noiseReduction
    };

    // Update global config
    Object.assign(holographicConfig, newConfig);

    res.json({
      success: true,
      data: {
        config: holographicConfig,
        message: 'Holographic configuration updated'
      }
    });
  } catch (error) {
    console.error('Config update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update configuration'
    });
  }
});

// Get holographic configuration
router.get('/config', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      config: holographicConfig,
      availableAlgorithms: ['fresnel', 'angular_spectrum', 'convolution'],
      availableFilters: ['none', 'gaussian', 'butterworth'],
      supportedWavelengths: {
        red: 632e-9,
        green: 532e-9,
        blue: 488e-9
      }
    }
  });
});

// Process real-time market data for holographic display
router.post('/market-visualization', async (req: Request, res: Response) => {
  try {
    const { marketData, visualizationType, intensity } = req.body;
    
    if (!marketData) {
      return res.status(400).json({
        success: false,
        error: 'Market data required'
      });
    }

    let hologramData;
    
    switch (visualizationType) {
      case 'price_flow':
        hologramData = HolographicGameUtils.createFinancialHologram(
          marketData.prices || [],
          marketData.volumes || [],
          marketData.timestamps || []
        );
        break;
        
      case 'arbitrage_opportunities':
        hologramData = HolographicGameUtils.createArbitrageHologram(
          marketData.opportunities || []
        );
        break;
        
      default:
        hologramData = holoEngine.generateSyntheticHologram(256, 256, 532e-9, 10e-6);
    }

    // Adjust intensity
    if (intensity && intensity !== 1.0) {
      for (let i = 0; i < hologramData.amplitude.length; i++) {
        hologramData.amplitude[i] *= intensity;
      }
    }

    const reconstructed = holoEngine.reconstructHologram(hologramData);
    
    const displayData = {
      width: reconstructed.width,
      height: reconstructed.height,
      amplitudeData: Array.from(reconstructed.amplitude),
      phaseData: Array.from(reconstructed.phase),
      type: visualizationType,
      intensity: intensity || 1.0
    };

    res.json({
      success: true,
      data: displayData
    });
  } catch (error) {
    console.error('Market visualization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create market visualization'
    });
  }
});

export default router;