type Message = {
  role: "user" | "assistant";
  content: string;
};

const sessions = new Map<string, Message[]>();

export function addMessage(sessionId: string, message: Message) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }

  const messages = sessions.get(sessionId)!;

  messages.push(message);

  if (messages.length > 20) {
    messages.shift();
  }
}

export function getConversation(sessionId: string) {
  return sessions.get(sessionId) || [];
}
