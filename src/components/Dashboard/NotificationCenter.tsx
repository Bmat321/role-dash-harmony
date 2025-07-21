
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, Calendar, User, AlertTriangle } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'leave',
      title: 'Leave Request Approved',
      message: 'Your vacation request for Feb 15-19 has been approved.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Late Check-in Alert',
      message: 'You checked in 15 minutes late today.',
      time: '1 day ago',
      unread: true
    },
    {
      id: 3,
      type: 'payroll',
      title: 'Payslip Available',
      message: 'Your January payslip is now available for download.',
      time: '3 days ago',
      unread: false
    },
    {
      id: 4,
      type: 'general',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday 2 AM - 4 AM.',
      time: '1 week ago',
      unread: false
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'attendance':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'payroll':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="w-80 shadow-lg border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  notification.unread ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full text-sm">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
