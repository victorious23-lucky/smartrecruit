import { UserRole } from './dfd';

export type NotificationType =
  | 'STAGE_CHANGE'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_RESCHEDULED'
  | 'INTERVIEW_CANCELLED'
  | 'OFFER_EXTENDED'
  | 'APPLICATION_RECEIVED';

export type NotificationChannel = 'in_app' | 'email' | 'sms';

export type DispatchStatus = 'queued' | 'sent' | 'failed';

export interface InAppNotification {
  id: string;
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  recipientRole: UserRole;
  type: NotificationType;
  title: string;
  message: string;
  entityType: 'application' | 'interview' | 'vacancy';
  entityId: string;
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
  metadata?: {
    candidateName?: string;
    candidateEmail?: string;
    vacancyTitle?: string;
    department?: string;
    fromStage?: string;
    toStage?: string;
    timeSlot?: string;
    format?: string;
    interviewerName?: string;
    interviewerEmail?: string;
    meetingUrl?: string;
  };
}

export interface NotificationDispatch {
  id: string;
  inAppNotificationId?: string;
  channel: 'email' | 'sms';
  recipient: string;
  recipientName: string;
  subject: string;
  body: string;
  htmlBody?: string;
  status: DispatchStatus;
  attempts: number;
  maxRetries: number;
  idempotencyKey: string;
  createdAt: string;
  lastAttemptAt?: string;
  deliveredAt?: string;
  errorDetails?: string;
  provider: 'SendGridAdapter' | 'TwilioSmsAdapter' | 'AmazonSES' | 'InternalGateway';
  providerMessageId?: string;
  latencyMs?: number;
  metadata?: Record<string, any>;
}

export interface NotificationStats {
  totalInApp: number;
  unreadInApp: number;
  totalDispatches: number;
  queuedCount: number;
  sentCount: number;
  failedCount: number;
}
