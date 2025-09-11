
import { useState, useEffect, useRef } from 'react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Oakline Bank. How can I assist you today?",
      sender: 'agent',
      timestamp: new Date(),
      agentName: 'Sarah Wilson'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate agent response
      setTimeout(() => {
        setIsTyping(false);
        const agentResponse = {
          id: messages.length + 2,
          text: getAgentResponse(newMessage),
          sender: 'agent',
          timestamp: new Date(),
          agentName: 'Sarah Wilson'
        };
        setMessages(prev => [...prev, agentResponse]);
      }, 2000);
    }
  };

  const getAgentResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    if (message.includes('balance') || message.includes('account')) {
      return "I'd be happy to help you with your account balance. For security purposes, please log into your account or visit our nearest branch. Is there anything else I can help you with?";
    } else if (message.includes('loan') || message.includes('credit')) {
      return "We offer various loan products including personal loans, auto loans, and mortgages. Would you like me to connect you with our loan specialist or would you prefer to schedule an appointment?";
    } else if (message.includes('card') || message.includes('debit') || message.includes('credit card')) {
      return "We have several card options available. Our premium debit cards come with exclusive benefits. Would you like to learn more about our card products or apply for a new card?";
    } else if (message.includes('hours') || message.includes('location') || message.includes('branch')) {
      return "Our branches are open Monday-Friday 9AM-6PM, Saturday 9AM-2PM. You can find your nearest branch using our branch locator. Would you like me to help you find a branch near you?";
    } else if (message.includes('investment') || message.includes('savings')) {
      return "We offer competitive savings accounts and investment options. Our financial advisors can help you create a personalized investment strategy. Would you like to schedule a consultation?";
    } else {
      return "Thank you for your question. I'm here to help with any banking needs you may have. You can also call us at 1-800-OAKLINE for immediate assistance. What else can I help you with today?";
    }
  };

  const quickReplies = [
    "Check account balance",
    "Apply for a loan",
    "Find branch locations",
    "Speak to a specialist"
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.chatButton}
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span style={styles.chatBadge}>Live Chat</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Chat Header */}
          <div style={styles.chatHeader}>
            <div style={styles.agentInfo}>
              <div style={styles.agentAvatar}>🏦</div>
              <div>
                <div style={styles.agentName}>Oakline Bank Support</div>
                <div style={styles.agentStatus}>
                  <span style={{...styles.statusDot, backgroundColor: isConnected ? '#10b981' : '#ef4444'}}></span>
                  {isConnected ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeButton}>✕</button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((message) => (
              <div key={message.id} style={styles.messageWrapper}>
                <div style={{
                  ...styles.message,
                  ...(message.sender === 'user' ? styles.userMessage : styles.agentMessage)
                }}>
                  {message.sender === 'agent' && (
                    <div style={styles.agentMessageHeader}>
                      <span style={styles.agentNameSmall}>{message.agentName}</span>
                      <span style={styles.timestamp}>
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  )}
                  <div style={styles.messageText}>{message.text}</div>
                  {message.sender === 'user' && (
                    <div style={styles.userTimestamp}>
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={styles.messageWrapper}>
                <div style={{...styles.message, ...styles.agentMessage}}>
                  <div style={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div style={styles.quickReplies}>
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => setNewMessage(reply)}
                style={styles.quickReplyButton}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              style={styles.messageInput}
            />
            <button onClick={handleSendMessage} style={styles.sendButton}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  chatButton: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 20px',
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    fontWeight: '600',
  },
  chatBadge: {
    fontSize: '14px',
    fontWeight: '600',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '100px',
    right: '24px',
    width: '380px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.15)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  chatHeader: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  agentAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  agentName: {
    fontWeight: '600',
    fontSize: '14px',
  },
  agentStatus: {
    fontSize: '12px',
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px',
  },
  messagesContainer: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#f9fafb',
  },
  messageWrapper: {
    marginBottom: '16px',
  },
  message: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '18px',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  userMessage: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    marginLeft: 'auto',
    borderBottomRightRadius: '6px',
  },
  agentMessage: {
    backgroundColor: 'white',
    color: '#374151',
    marginRight: 'auto',
    border: '1px solid #e5e7eb',
    borderBottomLeftRadius: '6px',
  },
  agentMessageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
    fontSize: '12px',
  },
  agentNameSmall: {
    fontWeight: '600',
    color: '#1e3a8a',
  },
  timestamp: {
    color: '#9ca3af',
  },
  userTimestamp: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    marginTop: '4px',
  },
  messageText: {
    margin: 0,
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  quickReplies: {
    padding: '12px 16px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    borderTop: '1px solid #e5e7eb',
  },
  quickReplyButton: {
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.2s ease',
  },
  inputContainer: {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '8px',
    backgroundColor: 'white',
  },
  messageInput: {
    flex: 1,
    border: '1px solid #d1d5db',
    borderRadius: '20px',
    padding: '10px 16px',
    fontSize: '14px',
    outline: 'none',
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
