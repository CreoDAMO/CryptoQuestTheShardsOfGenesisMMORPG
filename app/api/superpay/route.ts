import { NextRequest, NextResponse } from 'next/server';
import { superPayService } from '@/lib/superpay';

export async function GET() {
  try {
    const [invoices, balance] = await Promise.all([
      superPayService.getAllInvoices(),
      superPayService.getBalance('ETH')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        invoices,
        balance
      }
    });
  } catch (error) {
    console.error('SuperPay data error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get SuperPay data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    // Initialize SuperPay if not already done
    await superPayService.initialize();

    let result;

    switch (action) {
      case 'sendPayment':
        result = await superPayService.sendPayment(params);
        break;
      
      case 'createInvoice':
        result = await superPayService.createInvoice(params);
        break;
      
      case 'payInvoice':
        result = await superPayService.payInvoice(params.invoiceId, params.payerAddress);
        break;
      
      case 'getBalance':
        result = await superPayService.getBalance(params.currency || 'ETH');
        break;
      
      case 'purchaseGameItem':
        result = await superPayService.purchaseGameItem(params);
        break;
      
      case 'purchaseGuildMembership':
        result = await superPayService.purchaseGuildMembership(params);
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('SuperPay action error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Action failed' },
      { status: 500 }
    );
  }
}