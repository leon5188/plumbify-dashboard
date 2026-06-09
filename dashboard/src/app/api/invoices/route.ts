import { NextRequest, NextResponse } from 'next/server';
import { GHLApiClient } from '../../../clients/ghl-api-client';

export async function GET(req: NextRequest) {
  const config = {
    accessToken: process.env.GHL_API_KEY || '',
    baseUrl: process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com',
    version: '2021-07-28',
    locationId: process.env.GHL_LOCATION_ID || ''
  };

  if (!config.accessToken || !config.locationId) {
    return NextResponse.json(
      { success: false, error: 'Missing GoHighLevel configuration in environment' },
      { status: 500 }
    );
  }

  const client = new GHLApiClient(config);

  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';
    const status = searchParams.get('status') || '';

    console.log(`[Invoices API] Listing invoices with limit: ${limit}, offset: ${offset}`);

    const response = await client.listInvoices({ limit, offset });

    if (response.success && response.data?.invoices) {
      let invoices = response.data.invoices;

      // Filter by status if specified
      if (status) {
        invoices = invoices.filter((inv: any) => inv.status?.toLowerCase() === status.toLowerCase());
      }

      return NextResponse.json({
        success: true,
        invoices,
        total: response.data.total || invoices.length
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to retrieve invoices' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Invoices API] Error retrieving invoices:', error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve invoices' },
      { status: 500 }
    );
  }
}
