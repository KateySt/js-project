export const unreadNotificationsFun = (notifications) => {
    return notifications.filter((n) => n.isRead === false);
}