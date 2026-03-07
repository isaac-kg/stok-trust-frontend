"use client";

export default function NotificationPage(): React.ReactElement {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Notifications</h2>
        <p className="text-muted-foreground">
          View and manage your notifications
        </p>
      </div>
      <div className="text-center py-12 text-muted-foreground">
        <p>No notifications</p>
      </div>
    </div>
  );
}
