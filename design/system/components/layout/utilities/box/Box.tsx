// im-dashboard/src/components/NotificationDropdown.tsx

import React from 'react';
import { Bell } from 'lucide-react';
import { 
  Popover, 
  Listbox,
  ListboxItem,
  IconButtons, 
  Icon, 
  Label, 
  Body, 
  Button,
  Stack,
  Cluster,
  Box
} from '@blimpify-im/ui';

// ===== TYPES =====
export interface NotificationItemProps {
  id: string;
  type: 'chat_message' | 'support_ticket' | 'order_update' | 'website_published' | 'feature_activated' | 'billing' | 'system';
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  source_id?: number;
  source_type?: string;
}

export interface NotificationDropdownProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  notifications: NotificationItemProps[];
  unreadCount: number;
  onNotificationClick?: (notification: NotificationItemProps) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
}

// ===== HELPER FUNCTIONS =====
const getTypeIcon = (type: string) => {
  const icons = {
    chat_message: '💬',
    support_ticket: '🎫',
    order_update: '📦',
    website_published: '🌐',
    feature_activated: '✨',
    billing: '💰',
    system: '🔔'
  };
  return icons[type as keyof typeof icons] || '🔔';
};

const timeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Nu';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m sedan`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h sedan`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d sedan`;
  
  return date.toLocaleDateString('sv-SE');
};

// ===== EMPTY STATE =====
const EmptyNotifications = () => (
  <Box padding="lg" className="notification-empty">
    <Stack spacing="md" align="center">
      <Icon size="xl" color="tertiary">
        <Bell />
      </Icon>
      <Stack spacing="xs" align="center">
        <Body size="sm" weight="medium" color="primary">
          Inga nya notiser
        </Body>
        <Body size="xs" color="secondary">
          Du kommer att se notiser här när de kommer in
        </Body>
      </Stack>
    </Stack>
  </Box>
);

// ===== MAIN COMPONENT =====
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  open,
  onOpenChange,
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange} size="md">
      <Popover.Trigger asChild>
        <IconButtons.Bell
          variant="secondary"
          size="md"
          badge={unreadCount > 0 ? unreadCount : undefined}
          aria-label="Notiser"
        />
      </Popover.Trigger>
      
      <Popover.Positioner>
        <Popover.Content width={380}>
          <Popover.Header>
            <Cluster spacing="md" justify="between" align="center">
              <Label size="lg" weight="bold" color="heading">
                Notiser
              </Label>
              {unreadCount > 0 && onMarkAllAsRead && (
                <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                  <Label size="sm" weight="medium" color="secondary">
                    Markera alla
                  </Label>
                </Button>
              )}
            </Cluster>
          </Popover.Header>
          
          <Popover.Body>
            {notifications.length > 0 ? (
              <Listbox size="md" spacing="xs" role="list">
                {notifications.map((notification) => (
                  <ListboxItem
                    key={notification.id}
                    size="md"
                    interactive
                    onClick={() => {
                      if (!notification.read && onMarkAsRead) {
                        onMarkAsRead(notification.id);
                      }
                      onNotificationClick?.(notification);
                    }}
                    role="listitem"
                    leading={
                      <span style={{ fontSize: '20px' }}>{getTypeIcon(notification.type)}</span>
                    }
                    trailing={
                      !notification.read ? (
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-accent-500)',
                            flexShrink: 0
                          }}
                        />
                      ) : undefined
                    }
                  >
                    <Stack spacing="xs">
                      <Label size="sm" weight="semibold" color="primary">
                        {notification.title}
                      </Label>
                      <Body size="sm" color="secondary" className="notification-content">
                        {notification.content}
                      </Body>
                      <Body size="xs" color="tertiary">
                        {timeAgo(notification.timestamp)}
                      </Body>
                    </Stack>
                  </ListboxItem>
                ))}
              </Listbox>
            ) : (
              <EmptyNotifications />
            )}
          </Popover.Body>
          
          {notifications.length > 0 && onViewAll && (
            <Popover.Footer>
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAll}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Label size="sm" weight="medium" color="secondary">
                  Visa alla notiser
                </Label>
              </Button>
            </Popover.Footer>
          )}
        </Popover.Content>
      </Popover.Positioner>
    </Popover>
  );
};