import { InAppNotification, NotificationDispatch, NotificationType, DispatchStatus } from '../src/types/notifications';

// ----------------------------------------------------
// Server-Side In-Memory Stores
// ----------------------------------------------------
export const serverInAppNotifications: Map<string, InAppNotification> = new Map();
export const serverDispatches: Map<string, NotificationDispatch> = new Map();
export const processedIdempotencyKeys: Map<string, { status: DispatchStatus; dispatchId: string; timestamp: string }> = new Map();

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

// ----------------------------------------------------
// Server-Side Email Adapter (SendGrid / SMTP Abstraction)
// ----------------------------------------------------
export class EmailAdapter {
  static async send(payload: {
    to: string;
    recipientName: string;
    subject: string;
    textBody: string;
    htmlBody?: string;
    simulateFailure?: boolean;
  }): Promise<{ success: boolean; messageId: string; latencyMs: number; error?: string }> {
    const startTime = Date.now();
    // Simulate brief network latency (50-120ms)
    await new Promise((r) => setTimeout(r, 80));
    const latencyMs = Date.now() - startTime;

    if (payload.simulateFailure) {
      return {
        success: false,
        messageId: '',
        latencyMs,
        error: 'SMTP Connection Reset: Remote host 198.51.100.25 (mail.relay) dropped connection after DATA command.',
      };
    }

    const messageId = `sg_msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    return {
      success: true,
      messageId,
      latencyMs,
    };
  }

  static renderStageChangeHtml(params: {
    candidateName: string;
    vacancyTitle: string;
    department: string;
    toStage: string;
    fromStage?: string;
    note?: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #0f172a; padding: 24px 32px; color: #ffffff; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #10b981; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; }
          .content { padding: 32px; }
          .stage-pill { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 8px; margin: 20px 0; display: flex; align-items: center; justify-content: space-between; }
          .btn { display: inline-block; background: #10b981; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">TalentaSync Notification</span>
            <h2 style="margin: 12px 0 0 0; font-size: 20px; font-weight: 700;">Recruitment Pipeline Update</h2>
          </div>
          <div class="content">
            <p style="font-size: 15px; margin-top: 0;">Hello <strong>${params.candidateName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              We are pleased to inform you that your application for <strong>${params.vacancyTitle}</strong> (${params.department}) has progressed to a new stage.
            </p>
            <div class="stage-pill">
              <div>
                <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Status</span>
                <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 2px;">${params.toStage}</div>
              </div>
              <span style="color: #10b981; font-weight: 700;">✓ Active Step</span>
            </div>
            ${params.note ? `<p style="font-size: 13px; color: #64748b; font-style: italic;">Note from hiring team: "${params.note}"</p>` : ''}
            <a href="https://flowhire.internal/portal" class="btn">View Candidate Portal & Progress</a>
          </div>
          <div class="footer">
            Sent securely via TalentaSync Server Dispatch Adapter · Level-1 DFD Compliant
          </div>
        </div>
      </body>
      </html>
    `.trim();
  }

  static renderInterviewHtml(params: {
    candidateName: string;
    interviewerName: string;
    vacancyTitle: string;
    timeSlot: string;
    format: string;
    meetingUrl?: string;
    notes?: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #1e293b; padding: 24px 32px; color: #ffffff; border-bottom: 3px solid #3b82f6; }
          .content { padding: 32px; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #edf2f7; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .label { color: #64748b; font-weight: 600; }
          .val { font-weight: 600; color: #0f172a; }
          .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Interview Scheduled · ${params.vacancyTitle}</h2>
          </div>
          <div class="content">
            <p style="font-size: 15px; margin-top: 0;">Hi <strong>${params.candidateName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Your upcoming recruitment evaluation session with <strong>${params.interviewerName}</strong> has been confirmed.
            </p>
            <div class="meta-box">
              <div class="row">
                <span class="label">Date & Time Slot</span>
                <span class="val">${params.timeSlot}</span>
              </div>
              <div class="row">
                <span class="label">Session Format</span>
                <span class="val">${params.format}</span>
              </div>
              <div class="row">
                <span class="label">Primary Interviewer</span>
                <span class="val">${params.interviewerName}</span>
              </div>
            </div>
            ${params.notes ? `<p style="font-size: 13px; color: #475569;">Preparation: ${params.notes}</p>` : ''}
            <a href="${params.meetingUrl || 'https://meet.google.com/xyz-flow-hire'}" class="btn">Join Video Room & Calendar Event</a>
          </div>
          <div class="footer">
            Dispatched through TalentaSync Level-1 DFD Process 5.0 Gateway Adapter
          </div>
        </div>
      </body>
      </html>
    `.trim();
  }
}

// ----------------------------------------------------
// Server-Side SMS Adapter (Twilio Abstraction)
// ----------------------------------------------------
export class SmsAdapter {
  static async send(payload: {
    to: string;
    recipientName: string;
    body: string;
    simulateFailure?: boolean;
  }): Promise<{ success: boolean; messageId: string; latencyMs: number; error?: string }> {
    const startTime = Date.now();
    await new Promise((r) => setTimeout(r, 60));
    const latencyMs = Date.now() - startTime;

    if (payload.simulateFailure) {
      return {
        success: false,
        messageId: '',
        latencyMs,
        error: 'Twilio Gateway Error: HTTP 504 Gateway Timeout while dispatching to carrier routing node.',
      };
    }

    const messageId = `SM${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
    return {
      success: true,
      messageId,
      latencyMs,
    };
  }

  static formatStageChangeSms(candidateName: string, vacancyTitle: string, toStage: string): string {
    return `TalentaSync Update: Hi ${candidateName.split(' ')[0]}, your application for ${vacancyTitle} is now '${toStage}'. Check status: flowhire.io/p`;
  }

  static formatInterviewSms(candidateName: string, timeSlot: string, format: string): string {
    return `TalentaSync Interview: Hi ${candidateName.split(' ')[0]}, your ${format} interview is scheduled for ${timeSlot}. Check calendar: flowhire.io/c`;
  }
}

// ----------------------------------------------------
// Server-Side Notification Dispatch Engine & Safe Retry
// ----------------------------------------------------
export class NotificationEngine {
  /**
   * Safely dispatches stage changes to in-app records and external adapters (Email/SMS)
   * Enforces idempotency to prevent duplicate transmissions.
   */
  static async dispatchStageChange(params: {
    applicationId: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone?: string;
    vacancyTitle: string;
    department: string;
    fromStage?: string;
    toStage: string;
    note?: string;
    channels?: ('in_app' | 'email' | 'sms')[];
    idempotencyKey?: string;
    simulateFailure?: boolean;
  }): Promise<{
    inApp?: InAppNotification;
    dispatches: NotificationDispatch[];
    idempotentMatch?: boolean;
  }> {
    const channels = params.channels || ['in_app', 'email', 'sms'];
    const idempotencyKey = params.idempotencyKey || `idem_stage_${params.applicationId}_${params.toStage}`;

    // 1. Check Idempotency Guard
    if (processedIdempotencyKeys.has(idempotencyKey)) {
      const existing = processedIdempotencyKeys.get(idempotencyKey)!;
      if (existing.status === 'sent') {
        const found = serverDispatches.get(existing.dispatchId);
        if (found) {
          return {
            dispatches: [found],
            idempotentMatch: true,
          };
        }
      }
    }

    const dispatches: NotificationDispatch[] = [];
    let inAppNotification: InAppNotification | undefined;

    // 2. Create In-App Notification Record
    if (channels.includes('in_app')) {
      const inAppId = generateId('NOTIF');
      inAppNotification = {
        id: inAppId,
        recipientId: params.candidateId,
        recipientEmail: params.candidateEmail,
        recipientName: params.candidateName,
        recipientRole: 'JOB_SEEKER',
        type: 'STAGE_CHANGE',
        title: `Application Stage: ${params.toStage}`,
        message: `Your application for ${params.vacancyTitle} (${params.department}) transitioned to ${params.toStage}.`,
        entityType: 'application',
        entityId: params.applicationId,
        isRead: false,
        createdAt: new Date().toISOString(),
        linkTab: 'pipeline',
        metadata: {
          candidateName: params.candidateName,
          candidateEmail: params.candidateEmail,
          vacancyTitle: params.vacancyTitle,
          department: params.department,
          fromStage: params.fromStage,
          toStage: params.toStage,
        },
      };

      serverInAppNotifications.set(inAppId, inAppNotification);
    }

    // 3. Dispatch Email through EmailAdapter
    if (channels.includes('email')) {
      const dispatchId = generateId('DISP-EML');
      const emailIdemKey = `${idempotencyKey}_email`;

      const subject = `Application Update: ${params.vacancyTitle} — ${params.toStage}`;
      const textBody = `Hello ${params.candidateName}, your application for ${params.vacancyTitle} is now in stage '${params.toStage}'.`;
      const htmlBody = EmailAdapter.renderStageChangeHtml({
        candidateName: params.candidateName,
        vacancyTitle: params.vacancyTitle,
        department: params.department,
        toStage: params.toStage,
        fromStage: params.fromStage,
        note: params.note,
      });

      const emailResult = await EmailAdapter.send({
        to: params.candidateEmail,
        recipientName: params.candidateName,
        subject,
        textBody,
        htmlBody,
        simulateFailure: params.simulateFailure,
      });

      const emailDispatch: NotificationDispatch = {
        id: dispatchId,
        inAppNotificationId: inAppNotification?.id,
        channel: 'email',
        recipient: params.candidateEmail,
        recipientName: params.candidateName,
        subject,
        body: textBody,
        htmlBody,
        status: emailResult.success ? 'sent' : 'failed',
        attempts: 1,
        maxRetries: 3,
        idempotencyKey: emailIdemKey,
        createdAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        deliveredAt: emailResult.success ? new Date().toISOString() : undefined,
        errorDetails: emailResult.error,
        provider: 'SendGridAdapter',
        providerMessageId: emailResult.messageId,
        latencyMs: emailResult.latencyMs,
        metadata: { applicationId: params.applicationId, toStage: params.toStage },
      };

      serverDispatches.set(dispatchId, emailDispatch);
      processedIdempotencyKeys.set(emailIdemKey, {
        status: emailDispatch.status,
        dispatchId,
        timestamp: new Date().toISOString(),
      });
      dispatches.push(emailDispatch);
    }

    // 4. Dispatch SMS through SmsAdapter
    if (channels.includes('sms')) {
      const dispatchId = generateId('DISP-SMS');
      const smsIdemKey = `${idempotencyKey}_sms`;
      const recipientPhone = params.candidatePhone || '+1 (555) 234-5678';
      const body = SmsAdapter.formatStageChangeSms(params.candidateName, params.vacancyTitle, params.toStage);

      const smsResult = await SmsAdapter.send({
        to: recipientPhone,
        recipientName: params.candidateName,
        body,
        simulateFailure: false, // keep SMS passing by default
      });

      const smsDispatch: NotificationDispatch = {
        id: dispatchId,
        inAppNotificationId: inAppNotification?.id,
        channel: 'sms',
        recipient: recipientPhone,
        recipientName: params.candidateName,
        subject: `SMS Alert: ${params.toStage}`,
        body,
        status: smsResult.success ? 'sent' : 'failed',
        attempts: 1,
        maxRetries: 3,
        idempotencyKey: smsIdemKey,
        createdAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        deliveredAt: smsResult.success ? new Date().toISOString() : undefined,
        errorDetails: smsResult.error,
        provider: 'TwilioSmsAdapter',
        providerMessageId: smsResult.messageId,
        latencyMs: smsResult.latencyMs,
        metadata: { applicationId: params.applicationId, toStage: params.toStage },
      };

      serverDispatches.set(dispatchId, smsDispatch);
      processedIdempotencyKeys.set(smsIdemKey, {
        status: smsDispatch.status,
        dispatchId,
        timestamp: new Date().toISOString(),
      });
      dispatches.push(smsDispatch);
    }

    return {
      inApp: inAppNotification,
      dispatches,
      idempotentMatch: false,
    };
  }

  /**
   * Safely dispatches interview scheduling and event alerts
   */
  static async dispatchInterviewEvent(params: {
    interviewId: string;
    eventType: NotificationType;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone?: string;
    interviewerName: string;
    interviewerEmail: string;
    vacancyTitle: string;
    timeSlot: string;
    format: string;
    meetingUrl?: string;
    notes?: string;
    channels?: ('in_app' | 'email' | 'sms')[];
    idempotencyKey?: string;
    simulateFailure?: boolean;
  }): Promise<{
    inApp?: InAppNotification;
    dispatches: NotificationDispatch[];
    idempotentMatch?: boolean;
  }> {
    const channels = params.channels || ['in_app', 'email', 'sms'];
    const idempotencyKey = params.idempotencyKey || `idem_int_${params.interviewId}_${params.eventType}_${Date.now()}`;

    // 1. Check Idempotency Guard
    if (processedIdempotencyKeys.has(idempotencyKey)) {
      const existing = processedIdempotencyKeys.get(idempotencyKey)!;
      if (existing.status === 'sent') {
        const found = serverDispatches.get(existing.dispatchId);
        if (found) {
          return {
            dispatches: [found],
            idempotentMatch: true,
          };
        }
      }
    }

    const dispatches: NotificationDispatch[] = [];
    let inAppNotification: InAppNotification | undefined;

    // 2. Create In-App Notification Record
    if (channels.includes('in_app')) {
      const inAppId = generateId('NOTIF');
      const title =
        params.eventType === 'INTERVIEW_RESCHEDULED'
          ? 'Interview Rescheduled'
          : params.eventType === 'INTERVIEW_CANCELLED'
          ? 'Interview Cancelled'
          : 'Interview Confirmed';

      inAppNotification = {
        id: inAppId,
        recipientId: params.candidateId,
        recipientEmail: params.candidateEmail,
        recipientName: params.candidateName,
        recipientRole: 'JOB_SEEKER',
        type: params.eventType,
        title,
        message: `${title} for ${params.vacancyTitle} with ${params.interviewerName} (${params.timeSlot}).`,
        entityType: 'interview',
        entityId: params.interviewId,
        isRead: false,
        createdAt: new Date().toISOString(),
        linkTab: 'calendar',
        metadata: {
          candidateName: params.candidateName,
          candidateEmail: params.candidateEmail,
          vacancyTitle: params.vacancyTitle,
          timeSlot: params.timeSlot,
          format: params.format,
          interviewerName: params.interviewerName,
          interviewerEmail: params.interviewerEmail,
          meetingUrl: params.meetingUrl || 'https://meet.google.com/xyz-flow-hire',
        },
      };

      serverInAppNotifications.set(inAppId, inAppNotification);
    }

    // 3. Dispatch Email through EmailAdapter
    if (channels.includes('email')) {
      const dispatchId = generateId('DISP-EML');
      const emailIdemKey = `${idempotencyKey}_email`;

      const subject = `Interview Confirmation: ${params.vacancyTitle} (${params.timeSlot})`;
      const textBody = `Hi ${params.candidateName}, your interview for ${params.vacancyTitle} is scheduled on ${params.timeSlot}.`;
      const htmlBody = EmailAdapter.renderInterviewHtml({
        candidateName: params.candidateName,
        interviewerName: params.interviewerName,
        vacancyTitle: params.vacancyTitle,
        timeSlot: params.timeSlot,
        format: params.format,
        meetingUrl: params.meetingUrl,
        notes: params.notes,
      });

      const emailResult = await EmailAdapter.send({
        to: params.candidateEmail,
        recipientName: params.candidateName,
        subject,
        textBody,
        htmlBody,
        simulateFailure: params.simulateFailure,
      });

      const emailDispatch: NotificationDispatch = {
        id: dispatchId,
        inAppNotificationId: inAppNotification?.id,
        channel: 'email',
        recipient: params.candidateEmail,
        recipientName: params.candidateName,
        subject,
        body: textBody,
        htmlBody,
        status: emailResult.success ? 'sent' : 'failed',
        attempts: 1,
        maxRetries: 3,
        idempotencyKey: emailIdemKey,
        createdAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        deliveredAt: emailResult.success ? new Date().toISOString() : undefined,
        errorDetails: emailResult.error,
        provider: 'SendGridAdapter',
        providerMessageId: emailResult.messageId,
        latencyMs: emailResult.latencyMs,
        metadata: { interviewId: params.interviewId, timeSlot: params.timeSlot },
      };

      serverDispatches.set(dispatchId, emailDispatch);
      processedIdempotencyKeys.set(emailIdemKey, {
        status: emailDispatch.status,
        dispatchId,
        timestamp: new Date().toISOString(),
      });
      dispatches.push(emailDispatch);
    }

    // 4. Dispatch SMS
    if (channels.includes('sms')) {
      const dispatchId = generateId('DISP-SMS');
      const smsIdemKey = `${idempotencyKey}_sms`;
      const recipientPhone = params.candidatePhone || '+1 (555) 987-6543';
      const body = SmsAdapter.formatInterviewSms(params.candidateName, params.timeSlot, params.format);

      const smsResult = await SmsAdapter.send({
        to: recipientPhone,
        recipientName: params.candidateName,
        body,
        simulateFailure: false,
      });

      const smsDispatch: NotificationDispatch = {
        id: dispatchId,
        inAppNotificationId: inAppNotification?.id,
        channel: 'sms',
        recipient: recipientPhone,
        recipientName: params.candidateName,
        subject: `SMS Invite: ${params.timeSlot}`,
        body,
        status: smsResult.success ? 'sent' : 'failed',
        attempts: 1,
        maxRetries: 3,
        idempotencyKey: smsIdemKey,
        createdAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        deliveredAt: smsResult.success ? new Date().toISOString() : undefined,
        errorDetails: smsResult.error,
        provider: 'TwilioSmsAdapter',
        providerMessageId: smsResult.messageId,
        latencyMs: smsResult.latencyMs,
        metadata: { interviewId: params.interviewId, timeSlot: params.timeSlot },
      };

      serverDispatches.set(dispatchId, smsDispatch);
      processedIdempotencyKeys.set(smsIdemKey, {
        status: smsDispatch.status,
        dispatchId,
        timestamp: new Date().toISOString(),
      });
      dispatches.push(smsDispatch);
    }

    return {
      inApp: inAppNotification,
      dispatches,
      idempotentMatch: false,
    };
  }

  /**
   * Safe Retry Handler
   * Retries failed or queued notifications with idempotency and attempt caps
   */
  static async retrySafely(dispatchId: string): Promise<{
    success: boolean;
    dispatch?: NotificationDispatch;
    error?: string;
  }> {
    const dispatch = serverDispatches.get(dispatchId);
    if (!dispatch) {
      return { success: false, error: 'Dispatch record not found in queue.' };
    }

    // Already delivered
    if (dispatch.status === 'sent') {
      return {
        success: true,
        dispatch,
        error: 'Message already delivered. Idempotency guard avoided duplicate re-transmission.',
      };
    }

    // Attempt limit check
    if (dispatch.attempts >= dispatch.maxRetries) {
      return {
        success: false,
        dispatch,
        error: `Exceeded maximum retry attempts (${dispatch.maxRetries}). Manual carrier investigation required.`,
      };
    }

    // Increment attempts
    dispatch.attempts += 1;
    dispatch.lastAttemptAt = new Date().toISOString();
    dispatch.status = 'queued';

    // Execute adapter re-send
    if (dispatch.channel === 'email') {
      const res = await EmailAdapter.send({
        to: dispatch.recipient,
        recipientName: dispatch.recipientName,
        subject: dispatch.subject,
        textBody: dispatch.body,
        htmlBody: dispatch.htmlBody,
        simulateFailure: false, // Recover on retry!
      });

      if (res.success) {
        dispatch.status = 'sent';
        dispatch.deliveredAt = new Date().toISOString();
        dispatch.errorDetails = undefined;
        dispatch.providerMessageId = res.messageId;
        dispatch.latencyMs = res.latencyMs;

        processedIdempotencyKeys.set(dispatch.idempotencyKey, {
          status: 'sent',
          dispatchId: dispatch.id,
          timestamp: dispatch.deliveredAt,
        });

        return { success: true, dispatch };
      } else {
        dispatch.status = 'failed';
        dispatch.errorDetails = res.error;
        return { success: false, dispatch, error: res.error };
      }
    } else {
      const res = await SmsAdapter.send({
        to: dispatch.recipient,
        recipientName: dispatch.recipientName,
        body: dispatch.body,
        simulateFailure: false,
      });

      if (res.success) {
        dispatch.status = 'sent';
        dispatch.deliveredAt = new Date().toISOString();
        dispatch.errorDetails = undefined;
        dispatch.providerMessageId = res.messageId;
        dispatch.latencyMs = res.latencyMs;

        processedIdempotencyKeys.set(dispatch.idempotencyKey, {
          status: 'sent',
          dispatchId: dispatch.id,
          timestamp: dispatch.deliveredAt,
        });

        return { success: true, dispatch };
      } else {
        dispatch.status = 'failed';
        dispatch.errorDetails = res.error;
        return { success: false, dispatch, error: res.error };
      }
    }
  }

  /**
   * Safe batch retry for all failed dispatches
   */
  static async retryAllFailed(): Promise<{
    retriedCount: number;
    successCount: number;
    failedCount: number;
    dispatches: NotificationDispatch[];
  }> {
    const failedList = Array.from(serverDispatches.values()).filter(
      (d) => d.status === 'failed' && d.attempts < d.maxRetries
    );

    let successCount = 0;
    let failedCount = 0;

    for (const d of failedList) {
      const result = await this.retrySafely(d.id);
      if (result.success) {
        successCount++;
      } else {
        failedCount++;
      }
    }

    return {
      retriedCount: failedList.length,
      successCount,
      failedCount,
      dispatches: Array.from(serverDispatches.values()),
    };
  }
}

// ----------------------------------------------------
// Seed Initial Historical Notifications & Queue Records
// ----------------------------------------------------
export function seedNotificationData() {
  if (serverInAppNotifications.size > 0) return;

  const initialInApp: InAppNotification[] = [
    {
      id: 'NOTIF-101',
      recipientId: 'user-jobseeker-1',
      recipientEmail: 'sophia.chen@devmail.org',
      recipientName: 'Sophia Chen',
      recipientRole: 'JOB_SEEKER',
      type: 'STAGE_CHANGE',
      title: 'Shortlisted for Technical Interview',
      message: 'Your application for Staff Distributed Systems Engineer has moved to the Interview stage.',
      entityType: 'application',
      entityId: 'APP-504',
      isRead: false,
      createdAt: '2026-10-28T14:30:00.000Z',
      linkTab: 'pipeline',
      metadata: {
        candidateName: 'Sophia Chen',
        candidateEmail: 'sophia.chen@devmail.org',
        vacancyTitle: 'Staff Distributed Systems Engineer',
        department: 'Cloud Infrastructure',
        fromStage: 'UNDER_REVIEW',
        toStage: 'SHORTLISTED',
      },
    },
    {
      id: 'NOTIF-102',
      recipientId: 'user-recruiter-1',
      recipientEmail: 'elena.rostova@techflow.internal',
      recipientName: 'Elena Rostova',
      recipientRole: 'RECRUITER',
      type: 'INTERVIEW_SCHEDULED',
      title: 'Interview Scheduled: Sophia Chen',
      message: 'Marcus Vance confirmed Technical Architecture Pairing on Wednesday 09:00 am.',
      entityType: 'interview',
      entityId: 'INT-801',
      isRead: false,
      createdAt: '2026-10-28T15:10:00.000Z',
      linkTab: 'calendar',
      metadata: {
        candidateName: 'Sophia Chen',
        interviewerName: 'Marcus Vance',
        vacancyTitle: 'Staff Distributed Systems Engineer',
        timeSlot: 'Wed, Oct 29 · 09:00 am - 10:00 am',
        format: 'TECHNICAL_PAIRING',
      },
    },
    {
      id: 'NOTIF-103',
      recipientId: 'user-admin-master',
      recipientEmail: 'admin@flowhire.io',
      recipientName: 'Super Admin',
      recipientRole: 'ADMIN',
      type: 'OFFER_EXTENDED',
      title: 'Offer Extended: Darius Vance-Kowalski',
      message: 'Offer package generated for Senior AI Research Scientist ($210k - $240k base).',
      entityType: 'application',
      entityId: 'APP-505',
      isRead: true,
      createdAt: '2026-10-27T10:00:00.000Z',
      linkTab: 'pipeline',
      metadata: {
        candidateName: 'Darius Vance-Kowalski',
        vacancyTitle: 'Senior AI Research Scientist',
        toStage: 'OFFERED',
      },
    },
  ];

  initialInApp.forEach((n) => serverInAppNotifications.set(n.id, n));

  const initialDispatches: NotificationDispatch[] = [
    {
      id: 'DISP-EML-001',
      inAppNotificationId: 'NOTIF-101',
      channel: 'email',
      recipient: 'sophia.chen@devmail.org',
      recipientName: 'Sophia Chen',
      subject: 'Application Update: Staff Distributed Systems Engineer — SHORTLISTED',
      body: 'Hello Sophia Chen, your application for Staff Distributed Systems Engineer is now in stage SHORTLISTED.',
      htmlBody: EmailAdapter.renderStageChangeHtml({
        candidateName: 'Sophia Chen',
        vacancyTitle: 'Staff Distributed Systems Engineer',
        department: 'Cloud Infrastructure',
        toStage: 'SHORTLISTED',
        fromStage: 'UNDER_REVIEW',
        note: 'Exceptional background in distributed consensus algorithms.',
      }),
      status: 'sent',
      attempts: 1,
      maxRetries: 3,
      idempotencyKey: 'idem_app504_stage_SHORTLISTED_email',
      createdAt: '2026-10-28T14:30:05.000Z',
      lastAttemptAt: '2026-10-28T14:30:05.000Z',
      deliveredAt: '2026-10-28T14:30:06.000Z',
      provider: 'SendGridAdapter',
      providerMessageId: 'sg_msg_98234190_ack881',
      latencyMs: 94,
    },
    {
      id: 'DISP-SMS-002',
      inAppNotificationId: 'NOTIF-101',
      channel: 'sms',
      recipient: '+1 (555) 349-8812',
      recipientName: 'Sophia Chen',
      subject: 'SMS Alert: SHORTLISTED',
      body: 'TalentaSync Update: Hi Sophia, your application for Staff Distributed Systems Engineer is now SHORTLISTED. Check status: flowhire.io/p',
      status: 'sent',
      attempts: 1,
      maxRetries: 3,
      idempotencyKey: 'idem_app504_stage_SHORTLISTED_sms',
      createdAt: '2026-10-28T14:30:06.000Z',
      lastAttemptAt: '2026-10-28T14:30:06.000Z',
      deliveredAt: '2026-10-28T14:30:07.000Z',
      provider: 'TwilioSmsAdapter',
      providerMessageId: 'SM90f84a1d7c38ba109f',
      latencyMs: 72,
    },
    {
      id: 'DISP-EML-003',
      inAppNotificationId: 'NOTIF-102',
      channel: 'email',
      recipient: 'sophia.chen@devmail.org',
      recipientName: 'Sophia Chen',
      subject: 'Interview Confirmation: Staff Distributed Systems Engineer',
      body: 'Hi Sophia, your interview with Marcus Vance is scheduled for Wed, Oct 29 09:00 am.',
      htmlBody: EmailAdapter.renderInterviewHtml({
        candidateName: 'Sophia Chen',
        interviewerName: 'Marcus Vance',
        vacancyTitle: 'Staff Distributed Systems Engineer',
        timeSlot: 'Wed, Oct 29 · 09:00 am - 10:00 am',
        format: 'TECHNICAL_PAIRING',
        notes: 'Bring questions regarding high-throughput Kafka ingestion architectures.',
      }),
      status: 'sent',
      attempts: 1,
      maxRetries: 3,
      idempotencyKey: 'idem_int801_invite_email',
      createdAt: '2026-10-28T15:10:02.000Z',
      lastAttemptAt: '2026-10-28T15:10:02.000Z',
      deliveredAt: '2026-10-28T15:10:03.000Z',
      provider: 'SendGridAdapter',
      providerMessageId: 'sg_msg_98234255_ack992',
      latencyMs: 110,
    },
    {
      id: 'DISP-SMS-004',
      channel: 'sms',
      recipient: '+1 (555) 441-2990',
      recipientName: 'Daniel Roberts',
      subject: 'SMS Alert: Interview Reminder',
      body: 'TalentaSync Interview: Hi Daniel, your TECHNICAL_PAIRING interview is scheduled for Tuesday 10:30 am. Check: flowhire.io/c',
      status: 'failed',
      attempts: 1,
      maxRetries: 3,
      idempotencyKey: 'idem_int802_sms_reminder',
      createdAt: '2026-10-28T16:00:00.000Z',
      lastAttemptAt: '2026-10-28T16:00:00.000Z',
      errorDetails: 'Twilio Gateway Error: HTTP 504 Gateway Timeout while dispatching to carrier routing node.',
      provider: 'TwilioSmsAdapter',
      latencyMs: 310,
    },
    {
      id: 'DISP-EML-005',
      channel: 'email',
      recipient: 'gabriel.evans@devmail.org',
      recipientName: 'Gabriel Evans',
      subject: 'Application Queued for Review: Security Engineer',
      body: 'Hi Gabriel, your application is queued for preliminary screening.',
      status: 'queued',
      attempts: 0,
      maxRetries: 3,
      idempotencyKey: 'idem_app502_queued_email',
      createdAt: '2026-10-28T16:45:00.000Z',
      provider: 'SendGridAdapter',
    },
  ];

  initialDispatches.forEach((d) => {
    serverDispatches.set(d.id, d);
    processedIdempotencyKeys.set(d.idempotencyKey, {
      status: d.status,
      dispatchId: d.id,
      timestamp: d.createdAt,
    });
  });
}
