import { NextRequest, NextResponse } from 'next/server';
import { GHLApiClient } from '../../../clients/ghl-api-client';

// Helper to get GHL API Client
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

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('[Onboarding Webhook] Failed to parse JSON body:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    console.log('[Onboarding Webhook] Received payload:', body);

    // Extract contactId from payload, supporting multiple webhook format structures
    const contactId = body.contactId || body.contact_id || body.id || body.contact?.id;

    if (!contactId) {
      console.warn('[Onboarding Webhook] No contact ID found in payload');
      return NextResponse.json(
        { success: false, error: 'Missing contactId in payload' },
        { status: 400 }
      );
    }

    const { client, locationId } = getClient();
    console.log(`[Onboarding Webhook] Retrieving details for contact ID: ${contactId}`);

    // Fetch contact details from GHL to get the phone number, email, and name
    const contactResponse = await client.getContact(contactId);
    if (!contactResponse.success || !contactResponse.data) {
      throw new Error(`Failed to retrieve contact details: ${contactResponse.error?.message || 'Unknown error'}`);
    }

    const contact = contactResponse.data;
    const firstName = contact.firstName || 'there';
    const email = contact.email;
    const phone = contact.phone;

    console.log(`[Onboarding Webhook] Onboarding client: ${firstName} (Email: ${email || 'none'}, Phone: ${phone || 'none'})`);

    // 1. Assign tags indicating completed onboarding and portal activation
    console.log(`[Onboarding Webhook] Tagging contact ${contactId} with onboarding tags`);
    const tagResponse = await client.addContactTags(contactId, ['onboarded', 'client-portal-active']);
    if (!tagResponse.success) {
      console.warn(`[Onboarding Webhook] Warning: Failed to add tags: ${tagResponse.error?.message}`);
    }

    // 2. Send welcome SMS message if a phone number is registered
    if (phone) {
      console.log(`[Onboarding Webhook] Sending onboarding text to: ${phone}`);
      const smsMessage = `Hi ${firstName}! Welcome to Plumbify. Your account onboarding is complete. We will follow up with your booking schedule shortly.`;
      const smsResponse = await client.sendSMS(contactId, smsMessage);
      if (!smsResponse.success) {
        console.warn(`[Onboarding Webhook] Warning: Failed to send SMS: ${smsResponse.error?.message}`);
      }
    } else {
      console.log('[Onboarding Webhook] Skipping SMS welcome: No phone number present');
    }

    // 3. Send welcome email message if an email address is registered
    if (email) {
      console.log(`[Onboarding Webhook] Sending onboarding welcome email to: ${email}`);
      const emailSubject = 'Welcome to Plumbify!';
      const emailBodyHtml = `
        <p>Hi ${firstName},</p>
        <p>Welcome to Plumbify! Your client onboarding has been processed automatically.</p>
        <p>You can access your scheduler, invoices, and messaging directly from your client portal.</p>
        <p>If you have any questions, feel free to reply to this email or send us a text message.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>The Plumbify Team</strong></p>
      `;
      const emailResponse = await client.sendEmail(contactId, emailSubject, undefined, emailBodyHtml);
      if (!emailResponse.success) {
        console.warn(`[Onboarding Webhook] Warning: Failed to send email: ${emailResponse.error?.message}`);
      }
    } else {
      console.log('[Onboarding Webhook] Skipping Email welcome: No email address present');
    }

    // 4. Create opportunity in the [PLMB] Onboarding Pipeline (ckxHKSLsbidJcrf4r8Le)
    // inside the first stage "Account Created" (0b51c229-4c0b-4f32-a765-cc372fcf1995)
    console.log(`[Onboarding Webhook] Creating opportunity in Onboarding Pipeline for contact ${contactId}`);
    const lastName = contact.lastName || '';
    const opportunityName = `${firstName} ${lastName}`.trim() + ' - Onboarding';
    
    const opportunityResponse = await client.createOpportunity({
      name: opportunityName,
      pipelineId: 'ckxHKSLsbidJcrf4r8Le',
      pipelineStageId: '0b51c229-4c0b-4f32-a765-cc372fcf1995',
      contactId: contactId,
      status: 'open',
      locationId: locationId
    });

    if (!opportunityResponse.success) {
      console.warn(`[Onboarding Webhook] Warning: Failed to create onboarding opportunity: ${opportunityResponse.error?.message}`);
    } else {
      console.log(`[Onboarding Webhook] Onboarding opportunity created successfully with ID: ${opportunityResponse.data?.id}`);
    }

    return NextResponse.json({
      success: true,
      message: `Onboarding completed successfully for ${firstName}`,
      contactId
    });

  } catch (error: any) {
    console.error('[Onboarding Webhook] Error processing onboarding:', error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process onboarding' },
      { status: 500 }
    );
  }
}
