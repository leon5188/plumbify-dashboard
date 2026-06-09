import { NextResponse } from 'next/server';
import { GHLApiClient } from '../../../clients/ghl-api-client';

export async function GET() {
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
    console.log('[Schedule API] Querying GoHighLevel calendars and events...');

    // 1. Fetch Calendars
    let calendars: any[] = [];
    try {
      const calendarsRes = await client.getCalendars({ locationId: config.locationId });
      if (calendarsRes.success && calendarsRes.data?.calendars) {
        calendars = calendarsRes.data.calendars;
      }
    } catch (e: any) {
      console.warn('[Schedule API] Failed to fetch calendars:', e.message || e);
    }

    // 2. Fetch Events (Range: Current Month)
    let events: any[] = [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    try {
      const eventsRes = await client.getCalendarEvents({
        locationId: config.locationId,
        startTime: startOfMonth.getTime().toString(),
        endTime: endOfMonth.getTime().toString()
      });
      if (eventsRes.success && eventsRes.data?.events) {
        events = eventsRes.data.events;
      }
    } catch (e: any) {
      console.warn('[Schedule API] Failed to fetch events:', e.message || e);
    }

    return NextResponse.json({
      success: true,
      calendars,
      events,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[Schedule API] Critical error fetching schedules:', error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}
