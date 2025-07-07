// Uniswap V4 API Routes for CryptoQuest Platform
import { Router, Request, Response } from 'express';
import { UniswapV4Manager } from '../../../lib/uniswap-v4-integration';
import { ethers } from 'ethers';

const router = Router();

// Initialize V4 Manager (in production, use proper provider)
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com');
const v4Manager = new UniswapV4Manager(provider);

// Get V4 pool data
router.get('/pools', async (req: Request, res: Response) => {
  try {
    const { token0, token1, fee } = req.query;
    
    if (!token0 || !token1 || !fee) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: token0, token1, fee'
      });
    }

    // Create token instances
    const cqtToken = v4Manager.createCQTToken();
    const usdcToken = v4Manager.createUSDCToken();
    const wethToken = v4Manager.createWETHToken();

    // Mock pool data for development
    const poolData = {
      pools: [
        {
          id: 'cqt_usdc_v4',
          token0: 'CQT',
          token1: 'USDC',
          fee: 3000,
          liquidity: '2450000',
          volume24h: 125000,
          tvl: 2450000,
          apr: 125.8,
          hookAddress: '0x1234567890123456789012345678901234567890',
          sqrtPriceX96: '1771845812700903892492222464',
          tick: -23027
        },
        {
          id: 'cqt_weth_v4',
          token0: 'CQT',
          token1: 'WETH',
          fee: 3000,
          liquidity: '1850000',
          volume24h: 89000,
          tvl: 1850000,
          apr: 98.5,
          hookAddress: '0x2345678901234567890123456789012345678901',
          sqrtPriceX96: '1771845812700903892492222464',
          tick: -23027
        }
      ]
    };

    res.json({
      success: true,
      data: poolData
    });
  } catch (error) {
    console.error('V4 pools error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch V4 pools'
    });
  }
});

// Get quote for V4 swap
router.post('/quote', async (req: Request, res: Response) => {
  try {
    const { tokenIn, tokenOut, fee, amountIn } = req.body;
    
    if (!tokenIn || !tokenOut || !fee || !amountIn) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // Create token instances
    const tokenInInstance = tokenIn === 'CQT' ? v4Manager.createCQTToken() : v4Manager.createUSDCToken();
    const tokenOutInstance = tokenOut === 'CQT' ? v4Manager.createCQTToken() : v4Manager.createUSDCToken();

    const quote = await v4Manager.getQuote(tokenInInstance, tokenOutInstance, fee, amountIn);
    
    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('V4 quote error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quote'
    });
  }
});

// Execute V4 swap
router.post('/swap', async (req: Request, res: Response) => {
  try {
    const { tokenIn, tokenOut, fee, amountIn, amountOutMinimum, recipient, deadline } = req.body;
    
    if (!tokenIn || !tokenOut || !fee || !amountIn || !amountOutMinimum || !recipient) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // Create token instances
    const tokenInInstance = tokenIn === 'CQT' ? v4Manager.createCQTToken() : v4Manager.createUSDCToken();
    const tokenOutInstance = tokenOut === 'CQT' ? v4Manager.createCQTToken() : v4Manager.createUSDCToken();

    const swapParams = {
      tokenIn: tokenInInstance,
      tokenOut: tokenOutInstance,
      fee,
      recipient,
      deadline: deadline || Math.floor(Date.now() / 1000) + 3600, // 1 hour
      amountIn,
      amountOutMinimum
    };

    const txHash = await v4Manager.executeSwap(swapParams);
    
    res.json({
      success: true,
      data: { txHash }
    });
  } catch (error) {
    console.error('V4 swap error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute swap'
    });
  }
});

// Add liquidity to V4 pool
router.post('/add-liquidity', async (req: Request, res: Response) => {
  try {
    const { 
      token0, 
      token1, 
      fee, 
      tickLower, 
      tickUpper, 
      amount0Desired, 
      amount1Desired, 
      slippageTolerance 
    } = req.body;
    
    if (!token0 || !token1 || !fee || !tickLower || !tickUpper || !amount0Desired || !amount1Desired) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // Create token instances
    const token0Instance = token0 === 'CQT' ? v4Manager.createCQTToken() : v4Manager.createUSDCToken();
    const token1Instance = token1 === 'CQT' ? v4Manager.createCQTToken() : v4Manager.createUSDCToken();

    const result = await v4Manager.addLiquidity(
      token0Instance,
      token1Instance,
      fee,
      tickLower,
      tickUpper,
      amount0Desired,
      amount1Desired,
      { numerator: slippageTolerance || 50, denominator: 10000 } // 0.5% default
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('V4 add liquidity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add liquidity'
    });
  }
});

// Get user positions
router.get('/positions/:userAddress', async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.params;
    
    if (!userAddress || !ethers.isAddress(userAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user address'
      });
    }

    const positions = await v4Manager.getUserPositions(userAddress);
    
    res.json({
      success: true,
      data: { positions }
    });
  } catch (error) {
    console.error('V4 positions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch positions'
    });
  }
});

// Collect fees from position
router.post('/collect-fees', async (req: Request, res: Response) => {
  try {
    const { positionId } = req.body;
    
    if (!positionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing position ID'
      });
    }

    const result = await v4Manager.collectFees(positionId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('V4 collect fees error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect fees'
    });
  }
});

// Get pool analytics
router.get('/analytics/:token0/:token1/:fee', async (req: Request, res: Response) => {
  try {
    const { token0, token1, fee } = req.params;
    
    // Create token instances
    const token0Instance = token0 === 'CQT' ? v4Manager.createCQTToken() : v4Manager.createUSDCToken();
    const token1Instance = token1 === 'CQT' ? v4Manager.createCQTToken() : v4Manager.createUSDCToken();

    const analytics = await v4Manager.getPoolAnalytics(token0Instance, token1Instance, parseInt(fee));
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('V4 analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pool analytics'
    });
  }
});

export default router;