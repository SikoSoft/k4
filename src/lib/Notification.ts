import { NotificationProvider } from '@ss/ui/components/notification-provider';
import { NotificationType } from '@ss/ui/components/notification-provider.models';
import '@ss/ui/components/notification-provider';

let notificationProvider: NotificationProvider | null = null;

export function addNotification(
  message: string,
  type: NotificationType = NotificationType.INFO,
) {
  if (!notificationProvider) {
    notificationProvider = document.createElement(
      'notification-provider',
    ) as NotificationProvider;
    document.body.appendChild(notificationProvider);
  }

  notificationProvider.addNotification(message, type);
}
