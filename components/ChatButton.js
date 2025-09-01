import { useState } from "react";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="chat-button"
        onClick={() => setOpen(!open)}
        title="Chat with us"
      >
        <i className="fas fa-comments"></i>
      </button>
      {open && (
        <div className="chat-window">
          <header>Oakline Support</header>
          <div className="chat-messages">
            <p>Hi! How can we help you today?</p>
          </div>
          <input type="text" placeholder="Type your message..." />
        </div>
      )}
    </>
  );
}
