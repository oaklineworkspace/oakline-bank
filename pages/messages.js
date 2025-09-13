
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import Head from 'next/head';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchMessages(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      // Mock messages data - replace with actual Supabase query when messages table exists
      const mockMessages = [
        {
          id: 1,
          from: 'Oakline Bank',
          subject: 'Welcome to Oakline Bank',
          message: 'Thank you for choosing Oakline Bank. Your account has been successfully created.',
          date: new Date().toISOString(),
          read: false,
          type: 'system'
        },
        {
          id: 2,
          from: 'Account Services',
          subject: 'Monthly Statement Available',
          message: 'Your monthly account statement is now available in your dashboard.',
          date: new Date(Date.now() - 86400000).toISOString(),
          read: true,
          type: 'statement'
        },
        {
          id: 3,
          from: 'Security Team',
          subject: 'Login from New Device',
          message: 'We noticed a login from a new device. If this was not you, please contact us immediately.',
          date: new Date(Date.now() - 172800000).toISOString(),
          read: true,
          type: 'security'
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleMarkAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      from: 'You',
      subject: 'Customer Inquiry',
      message: newMessage,
      date: new Date().toISOString(),
      read: true,
      type: 'customer'
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    setShowCompose(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.content}>
          <h1>Please log in to view messages</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Messages - Oakline Bank</title>
        <meta name="description" content="View and manage your banking messages" />
      </Head>

      <div style={styles.container}>
        <Header />
        
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.title}>Messages</h1>
            <button 
              onClick={() => setShowCompose(!showCompose)}
              style={styles.composeButton}
            >
              {showCompose ? 'Cancel' : 'Compose Message'}
            </button>
          </div>

          {showCompose && (
            <div style={styles.composeSection}>
              <h3>Send Message to Support</h3>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                style={styles.textarea}
                rows="4"
              />
              <div style={styles.composeActions}>
                <button onClick={handleSendMessage} style={styles.sendButton}>
                  Send Message
                </button>
                <button onClick={() => setShowCompose(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={styles.messagesContainer}>
            <div style={styles.messagesList}>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    style={{
                      ...styles.messageItem,
                      ...(selectedMessage?.id === message.id ? styles.selectedMessage : {}),
                      ...(message.read ? {} : styles.unreadMessage)
                    }}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) {
                        handleMarkAsRead(message.id);
                      }
                    }}
                  >
                    <div style={styles.messageHeader}>
                      <div style={styles.messageFrom}>{message.from}</div>
                      <div style={styles.messageDate}>
                        {new Date(message.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={styles.messageSubject}>{message.subject}</div>
                    <div style={styles.messagePreview}>
                      {message.message.substring(0, 100)}...
                    </div>
                    {!message.read && <div style={styles.unreadBadge}>NEW</div>}
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <h3>No messages yet</h3>
                  <p>You'll see messages from Oakline Bank here</p>
                </div>
              )}
            </div>

            {selectedMessage && (
              <div style={styles.messageDetail}>
                <div style={styles.detailHeader}>
                  <h3>{selectedMessage.subject}</h3>
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    style={styles.closeButton}
                  >
                    ✕
                  </button>
                </div>
                <div style={styles.detailMeta}>
                  <div>From: {selectedMessage.from}</div>
                  <div>Date: {new Date(selectedMessage.date).toLocaleString()}</div>
                </div>
                <div style={styles.detailContent}>
                  {selectedMessage.message}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F5F6F8'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    color: '#1A3E6F',
    margin: 0
  },
  composeButton: {
    backgroundColor: '#FFC857',
    color: '#1A3E6F',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  composeSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    fontFamily: 'inherit',
    marginBottom: '1rem',
    resize: 'vertical'
  },
  composeActions: {
    display: 'flex',
    gap: '1rem'
  },
  sendButton: {
    backgroundColor: '#1A3E6F',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  cancelButton: {
    backgroundColor: '#7A7A7A',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  messagesContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    height: '600px'
  },
  messagesList: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1rem',
    overflow: 'auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  messageItem: {
    padding: '1rem',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s'
  },
  selectedMessage: {
    backgroundColor: '#f8f9ff'
  },
  unreadMessage: {
    backgroundColor: '#fff8e6',
    borderLeft: '4px solid #FFC857'
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  messageFrom: {
    fontWeight: '600',
    color: '#1A3E6F'
  },
  messageDate: {
    color: '#7A7A7A',
    fontSize: '0.9rem'
  },
  messageSubject: {
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  messagePreview: {
    color: '#7A7A7A',
    fontSize: '0.9rem'
  },
  unreadBadge: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: '#FFC857',
    color: '#1A3E6F',
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  messageDetail: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f0f0f0'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#7A7A7A'
  },
  detailMeta: {
    marginBottom: '1.5rem',
    color: '#7A7A7A',
    fontSize: '0.9rem'
  },
  detailContent: {
    lineHeight: '1.6',
    color: '#1E1E1E'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7A7A7A'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F5F6F8'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1A3E6F',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  content: {
    padding: '2rem',
    textAlign: 'center'
  }
};
