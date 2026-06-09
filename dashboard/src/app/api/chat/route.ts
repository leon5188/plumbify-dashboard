import { NextRequest, NextResponse } from 'next/server';
import { GHLApiClient } from '../../../clients/ghl-api-client';

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
    const action = searchParams.get('action') || 'list';
    const conversationId = searchParams.get('conversationId') || '';

    const { client, locationId } = getClient();

    if (action === 'list') {
      console.log('[Chat API] Fetching recent conversations...');
      const response = await client.searchConversations({
        locationId,
        status: 'recents',
        limit: 20
      });

      if (response.success && response.data) {
        return NextResponse.json({
          success: true,
          conversations: response.data.conversations || [],
          total: response.data.total || 0
        });
      }
    } else if (action === 'messages') {
      if (!conversationId) {
        return NextResponse.json({ success: false, error: 'conversationId is required' }, { status: 400 });
      }

      console.log(`[Chat API] Fetching messages for conversation: ${conversationId}`);
      const response = await client.getConversationMessages(conversationId, {
        limit: 50
      });

      if (response.success && response.data) {
        // GHL structure wraps messages in a messages array or data object
        const messages = (response.data as any).messages || [];
        return NextResponse.json({
          success: true,
          messages
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'GHL query failed or returned invalid structure' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Chat API] GET handler error:', error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'API operation failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contactId, message, type = 'SMS', threadId } = body;

    if (!contactId || !message) {
      return NextResponse.json(
        { success: false, error: 'contactId and message are required' },
        { status: 400 }
      );
    }

    const { client } = getClient();
    console.log(`[Chat API] Dispatching message type "${type}" to contact: ${contactId}`);

    const response = await client.sendMessage({
      type,
      contactId,
      message,
      threadId
    });

    if (response.success && response.data) {
      return NextResponse.json({
        success: true,
        data: response.data
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send GHL message' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Chat API] POST handler error:', error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch message' },
      { status: 500 }
    );
  }
}
