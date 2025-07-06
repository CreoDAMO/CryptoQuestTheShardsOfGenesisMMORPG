import { NextRequest, NextResponse } from 'next/server';
import { cryptoQuestAgent } from '@/lib/agentkit';

export async function GET() {
  try {
    const status = await cryptoQuestAgent.getAgentStatus();
    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('AgentKit status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get agent status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, params } = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    // Initialize agent if not already done
    if (!await cryptoQuestAgent.getAgentStatus().then(s => s.initialized)) {
      await cryptoQuestAgent.initialize();
    }

    const result = await cryptoQuestAgent.executeAction(action, params);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('AgentKit action error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Action failed' },
      { status: 500 }
    );
  }
}