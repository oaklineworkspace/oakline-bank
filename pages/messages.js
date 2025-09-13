
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
  const [sending, setSending] = useState(false);

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
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', userId)
        .single();

      // Fetch user accounts with proper query
      const { data: accounts } = await supabase
        .from('accounts')
        .select('*')
        .eq('application_id', profile?.application_id || userId);

      // Fetch recent transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      let realMessages = [];
      const userName = profile ? `${profile.first_name} ${profile.last_name}` : 'Valued Customer';

      // Welcome message
      realMessages.push({
        id: 'welcome',
        from: 'Oakline Bank Customer Service',
        to: profile?.email || 'Customer',
        subject: `Welcome to Oakline Bank, ${profile?.first_name || 'Valued Customer'}!`,
        message: `Dear ${userName},\n\nWelcome to Oakline Bank! We're thrilled to have you as part of our banking family.\n\nYour account has been successfully set up and is ready to use. You now have access to all our premium banking services including:\n\n• 24/7 Online Banking\n• Mobile Banking App\n• ATM Network Access\n• Customer Support\n• Account Management Tools\n\nIf you have any questions or need assistance, please don't hesitate to reach out to our customer service team.\n\nThank you for choosing Oakline Bank.\n\nBest regards,\nOakline Bank Customer Service Team`,
        date: new Date().toISOString(),
        read: false,
        type: 'welcome',
        priority: 'high'
      });

      // Account setup confirmations
      if (accounts && accounts.length > 0) {
        accounts.forEach((account) => {
          realMessages.push({
            id: `account_${account.id}`,
            from: 'Oakline Bank Account Services',
            to: profile?.email || 'Customer',
            subject: 'Account Setup Confirmation',
            message: `Dear ${userName},\n\nYour ${account.account_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} account has been successfully created.\n\nAccount Details:\n• Account Number: ****${account.account_number.slice(-4)}\n• Routing Number: ${account.routing_number}\n• Account Type: ${account.account_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n• Current Balance: $${parseFloat(account.balance || 0).toFixed(2)}\n• Status: ${account.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\nYou can now start using your account for all your banking needs.\n\nBest regards,\nOakline Bank Account Services`,
            date: account.created_at,
            read: true,
            type: 'account',
            priority: 'normal'
          });
        });
      }

      // Transaction summaries
      if (transactions && transactions.length > 0) {
        const totalCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalDebits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

        if (totalCredits > 0 || totalDebits > 0) {
          realMessages.push({
            id: 'transaction_summary',
            from: 'Oakline Bank Transaction Services',
            to: profile?.email || 'Customer',
            subject: 'Recent Account Activity Summary',
            message: `Dear ${userName},\n\nHere's a summary of your recent account activity:\n\nRecent Transactions: ${transactions.length}\nTotal Credits: $${totalCredits.toFixed(2)}\nTotal Debits: $${totalDebits.toFixed(2)}\n\nRecent Activity:\n${transactions.slice(0, 3).map(t => `• ${t.type === 'credit' ? 'Deposit' : 'Transaction'}: $${Math.abs(parseFloat(t.amount)).toFixed(2)} - ${new Date(t.created_at).toLocaleDateString()}`).join('\n')}\n\nYou can view detailed transaction history in your online banking dashboard.\n\nIf you notice any unauthorized transactions, please contact us immediately.\n\nBest regards,\nOakline Bank Security Team`,
            date: new Date(Date.now() - 86400000).toISOString(),
            read: true,
            type: 'transaction',
            priority: 'normal'
          });
        }
      }

      // Security notice
      realMessages.push({
        id: 'security',
        from: 'Oakline Bank Security Team',
        to: profile?.email || 'Customer',
        subject: 'Important Security Information',
        message: `Dear ${userName},\n\nYour account security is our top priority. Here are some important security reminders:\n\n• Never share your login credentials with anyone\n• Always log out completely when using public computers\n• Monitor your accounts regularly for unauthorized activity\n• Contact us immediately if you suspect any suspicious activity\n• Use strong, unique passwords for your online banking\n\nWe recommend enabling two-factor authentication for additional security. You can set this up in your account settings.\n\nIf you have any security concerns or questions, please contact our security team at security@oaklinebank.com or call our 24/7 security hotline.\n\nStay safe and secure,\nOakline Bank Security Team`,
        date: new Date(Date.now() - 172800000).toISOString(),
        read: true,
        type: 'security',
        priority: 'high'
      });

      realMessages.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMessages(realMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([{
        id: 'fallback',
        from: 'Oakline Bank',
        to: 'Customer',
        subject: 'Welcome to Oakline Bank',
        message: 'Welcome to your secure messaging center. Your messages from Oakline Bank will appear here.',
        date: new Date().toISOString(),
        read: false,
        type: 'system',
        priority: 'normal'
      }]);
    }
  };

  const handleMarkAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const message = {
        id: `customer_${Date.now()}`,
        from: 'You',
        to: 'Oakline Bank Customer Service',
        subject: 'Customer Inquiry',
        message: newMessage,
        date: new Date().toISOString(),
        read: true,
        type: 'customer',
        priority: 'normal'
      };

      setMessages([message, ...messages]);
      setNewMessage('');
      setShowCompose(false);

      setTimeout(() => {
        const autoReply = {
          id: `auto_reply_${Date.now()}`,
          from: 'Oakline Bank Customer Service',
          to: 'You',
          subject: 'Re: Customer Inquiry',
          message: `Thank you for contacting Oakline Bank. We have received your message and will respond within 24 hours.\n\nFor urgent matters, please call our customer service line at 1-800-OAKLINE (1-800-625-5463).\n\nReference Number: CS${Date.now().toString().slice(-6)}\n\nBest regards,\nOakline Bank Customer Service Team`,
          date: new Date(Date.now() + 5000).toISOString(),
          read: false,
          type: 'system',
          priority: 'normal'
        };
        setMessages(prev => [autoReply, ...prev]);
      }, 3000);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading messages...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.content}>
          <div style={styles.loginPrompt}>
            <h1 style={styles.loginTitle}>Access Required</h1>
            <p style={styles.loginMessage}>Please log in to view your messages</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Secure Messages - Oakline Bank</title>
        <meta name="description" content="View and manage your secure banking messages" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>

      <div style={styles.container}>
        <Header />
        
        <main style={styles.main}>
          <div style={styles.header}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>Secure Messages</h1>
              {messages.filter(m => !m.read).length > 0 && (
                <span style={styles.unreadBadge}>
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </div>
            <button 
              onClick={() => setShowCompose(!showCompose)}
              style={styles.composeButton}
              disabled={sending}
            >
              {showCompose ? '✕ Cancel' : '✉ New Message'}
            </button>
          </div>

          {showCompose && (
            <div style={styles.composeSection}>
              <div style={styles.composeHeader}>
                <h3 style={styles.composeTitle}>Send Message to Customer Service</h3>
                <span style={styles.secureIndicator}>🔒 Secure</span>
              </div>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here... Our customer service team will respond within 24 hours."
                style={styles.textarea}
                rows="4"
                disabled={sending}
              />
              <div style={styles.composeActions}>
                <button 
                  onClick={handleSendMessage} 
                  style={{
                    ...styles.sendButton,
                    ...(sending ? styles.sendingButton : {})
                  }}
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
                <button 
                  onClick={() => setShowCompose(false)} 
                  style={styles.cancelButton}
                  disabled={sending}
                >
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
                      <div style={styles.messageFrom}>
                        {message.from}
                        {message.priority === 'high' && (
                          <span style={styles.priorityIndicator}>!</span>
                        )}
                      </div>
                      <div style={styles.messageDate}>
                        {new Date(message.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={styles.messageSubject}>{message.subject}</div>
                    <div style={styles.messagePreview}>
                      {message.message.substring(0, 100)}...
                    </div>
                    <div style={styles.messageFooter}>
                      <span style={styles.messageType}>
                        {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                      </span>
                      {!message.read && <span style={styles.unreadIndicator}>NEW</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📨</div>
                  <h3 style={styles.emptyTitle}>No Messages Yet</h3>
                  <p style={styles.emptyMessage}>Your secure messages from Oakline Bank will appear here</p>
                </div>
              )}
            </div>

            {selectedMessage && (
              <div style={styles.messageDetail}>
                <div style={styles.detailHeader}>
                  <div style={styles.detailTitleSection}>
                    <h3 style={styles.detailTitle}>{selectedMessage.subject}</h3>
                    {selectedMessage.priority === 'high' && (
                      <span style={styles.highPriority}>High Priority</span>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    style={styles.closeButton}
                  >
                    ✕
                  </button>
                </div>
                <div style={styles.detailMeta}>
                  <div style={styles.detailMetaRow}>
                    <span style={styles.metaLabel}>From:</span>
                    <span style={styles.metaValue}>{selectedMessage.from}</span>
                  </div>
                  <div style={styles.detailMetaRow}>
                    <span style={styles.metaLabel}>To:</span>
                    <span style={styles.metaValue}>{selectedMessage.to}</span>
                  </div>
                  <div style={styles.detailMetaRow}>
                    <span style={styles.metaLabel}>Date:</span>
                    <span style={styles.metaValue}>{new Date(selectedMessage.date).toLocaleString()}</span>
                  </div>
                </div>
                <div style={styles.detailContent}>
                  {selectedMessage.message.split('\n').map((line, index) => (
                    <p key={index} style={styles.messageLine}>
                      {line}
                    </p>
                  ))}
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
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  main: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
    padding: '0 0.5rem'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  title: {
    fontSize: 'clamp(1.25rem, 5vw, 2rem)',
    color: '#1e293b',
    margin: 0,
    fontWeight: '700'
  },
  unreadBadge: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    minWidth: '20px',
    textAlign: 'center'
  },
  composeButton: {
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.8rem'
  },
  composeSection: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    margin: '0 0.5rem 1rem 0.5rem'
  },
  composeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  composeTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b'
  },
  secureIndicator: {
    fontSize: '0.8rem',
    color: '#059669',
    fontWeight: '500'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    marginBottom: '0.75rem',
    resize: 'vertical',
    minHeight: '100px',
    lineHeight: '1.5',
    boxSizing: 'border-box'
  },
  composeActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  sendButton: {
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.8rem',
    flex: '1'
  },
  sendingButton: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.8rem',
    flex: '1'
  },
  messagesContainer: {
    display: 'block'
  },
  messagesList: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '0',
    overflow: 'auto',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    margin: '0 0.5rem',
    maxHeight: '70vh'
  },
  messageItem: {
    padding: '1rem',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  selectedMessage: {
    backgroundColor: '#eff6ff',
    borderLeft: '4px solid #1e40af'
  },
  unreadMessage: {
    backgroundColor: '#fefce8',
    borderLeft: '4px solid #f59e0b'
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
    gap: '0.25rem'
  },
  messageFrom: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  priorityIndicator: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  messageDate: {
    color: '#64748b',
    fontSize: '0.7rem'
  },
  messageSubject: {
    fontWeight: '500',
    marginBottom: '0.5rem',
    fontSize: '0.8rem',
    color: '#1e293b',
    lineHeight: '1.3'
  },
  messagePreview: {
    color: '#64748b',
    fontSize: '0.75rem',
    lineHeight: '1.3',
    marginBottom: '0.5rem'
  },
  messageFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageType: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  unreadIndicator: {
    backgroundColor: '#f59e0b',
    color: 'white',
    fontSize: '0.6rem',
    padding: '0.15rem 0.3rem',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  messageDetail: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem 0.5rem 0 0.5rem',
    maxHeight: '60vh'
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1rem 1rem 0.5rem 1rem',
    borderBottom: '1px solid #f1f5f9',
    gap: '0.5rem'
  },
  detailTitleSection: {
    flex: 1
  },
  detailTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: '1.3'
  },
  highPriority: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '600'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: '#64748b',
    padding: '0.2rem',
    borderRadius: '4px',
    flexShrink: 0
  },
  detailMeta: {
    padding: '0 1rem 0.5rem 1rem',
    borderBottom: '1px solid #f1f5f9'
  },
  detailMetaRow: {
    display: 'flex',
    marginBottom: '0.25rem',
    fontSize: '0.8rem'
  },
  metaLabel: {
    fontWeight: '600',
    color: '#374151',
    width: '50px',
    flexShrink: 0
  },
  metaValue: {
    color: '#64748b'
  },
  detailContent: {
    padding: '1rem',
    flex: 1,
    overflow: 'auto'
  },
  messageLine: {
    margin: '0 0 0.75rem 0',
    lineHeight: '1.5',
    color: '#374151',
    fontSize: '0.8rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#64748b'
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  emptyMessage: {
    margin: 0,
    fontSize: '0.9rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #1e40af',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '1rem',
    color: '#64748b',
    fontSize: '1rem'
  },
  loginPrompt: {
    textAlign: 'center',
    padding: '2rem 1rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    margin: '2rem auto',
    maxWidth: '400px'
  },
  loginTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  loginMessage: {
    color: '#64748b',
    margin: 0,
    fontSize: '0.9rem'
  }
};
