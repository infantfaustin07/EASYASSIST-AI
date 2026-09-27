export function groupChatsByDate(chats = []) {
  const groups = {
    Today: [],
    Yesterday: [],
    Previous: [],
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  chats.forEach((chat) => {
    const chatDate = new Date(chat.updatedAt || chat.createdAt);

    if (chatDate >= startOfToday) {
      groups.Today.push(chat);
    } else if (chatDate >= startOfYesterday) {
      groups.Yesterday.push(chat);
    } else {
      groups.Previous.push(chat);
    }
  });

  return groups;
}

export function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
