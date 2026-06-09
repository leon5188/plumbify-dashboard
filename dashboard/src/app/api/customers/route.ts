import { NextRequest, NextResponse } from 'next/server';
import { GHLApiClient } from '../../../clients/ghl-api-client';

// Helper to get client
function getClient() {
  const config = {
    accessToken: process.env.GHL_API_KEY || '',
    baseUrl: process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com',
    version: '2021-07-28',
    locationId: process.env.GHL_LOCATION_ID || ''
  };

  if (!config.accessToken || !config.locationId) {
    throw new Error('Missing GoHighLevel configuration in environment');
  }

  return { client: new GHLApiClient(config), locationId: config.locationId };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    const { client, locationId } = getClient();
    console.log(`[Customers API] Fetching contacts for query: "${query}", limit: ${limit}`);

    // If query is present, search contacts
    // otherwise search with empty query or fetch all
    const response = await client.searchContacts({
      locationId,
      query: query || undefined,
      limit: limit
    });

    if (response.success && response.data) {
      return NextResponse.json({
        success: true,
        contacts: response.data.contacts || [],
        total: response.data.total || 0
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to search contacts' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Customers API] Error fetching contacts:', error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { client, locationId } = getClient();

    console.log('[Customers API] Creating new contact:', body);

    const payload = {
      ...body,
      locationId: body.locationId || locationId
    };

    const response = await client.createContact(payload);

    if (response.success && response.data) {
      return NextResponse.json({
        success: true,
        contact: response.data
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Customers API] Error creating contact:', error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create contact' },
      { status: 500 }
    );
  }
}
