import { NextRequest, NextResponse } from 'next/server';
import { nvidiaCloudService } from '@/lib/nvidia-cloud';

interface NvidiaRequest {
  action: 'mining' | 'gaming' | 'scale' | 'predict' | 'optimize';
  targetHashrate?: number;
  playerData?: any;
  historicalData?: any[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        const [miningMetrics, gamingMetrics, cloudUsage] = await Promise.all([
          nvidiaCloudService.getMiningMetrics(),
          nvidiaCloudService.getGamingAIMetrics(),
          nvidiaCloudService.getCloudResourceUsage()
        ]);

        return NextResponse.json({
          success: true,
          data: {
            mining: miningMetrics,
            gaming: gamingMetrics,
            cloud: cloudUsage,
            timestamp: new Date().toISOString()
          }
        });

      case 'mining':
        const miningData = await nvidiaCloudService.getMiningMetrics();
        return NextResponse.json({
          success: true,
          data: miningData
        });

      case 'gaming':
        const gamingData = await nvidiaCloudService.getGamingAIMetrics();
        return NextResponse.json({
          success: true,
          data: gamingData
        });

      case 'cloud':
        const cloudData = await nvidiaCloudService.getCloudResourceUsage();
        return NextResponse.json({
          success: true,
          data: cloudData
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Nvidia API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: NvidiaRequest = await request.json();

    switch (body.action) {
      case 'mining':
        const initResult = await nvidiaCloudService.initializeGPUMining();
        return NextResponse.json({
          success: true,
          data: initResult
        });

      case 'scale':
        if (!body.targetHashrate) {
          return NextResponse.json({
            success: false,
            error: 'Target hashrate required for scaling'
          }, { status: 400 });
        }

        const scaleResult = await nvidiaCloudService.scaleMiningOperations(body.targetHashrate);
        return NextResponse.json({
          success: true,
          data: scaleResult
        });

      case 'gaming':
        const enhanceResult = await nvidiaCloudService.enhanceGameplayAI(body.playerData || {});
        return NextResponse.json({
          success: true,
          data: enhanceResult
        });

      case 'predict':
        const predictions = await nvidiaCloudService.predictMarketTrends(body.historicalData || []);
        return NextResponse.json({
          success: true,
          data: predictions
        });

      case 'optimize':
        const optimization = await nvidiaCloudService.optimizeArbitrageStrategy(body);
        return NextResponse.json({
          success: true,
          data: optimization
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Nvidia POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}