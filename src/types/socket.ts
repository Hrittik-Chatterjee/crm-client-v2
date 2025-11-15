/**
 * Socket.io Event Types
 * Real-time event interfaces
 */

export interface SocketContentEvent {
  type?: string;
  business?: string;
  message?: string;
  addedBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
