// components/FloatingChat.js
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  // Fab,
  Fade,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Bot, Minimize2, Send, User, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import apiService from "../services/apiService";

// Custom AI Medical Coder Assistant Icon Component
const AICoderIcon = ({ size = 48, onClick }) => {
  const uniqueId = React.useId(); // Generate unique ID for each icon instance

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        display: "inline-block",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "scale(1.6)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "scale(1.5)";
        }
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient
            id={`chatGradient-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#2563eb", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#1d4ed8", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id={`shadow-${uniqueId}`}>
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background Circle with Shadow */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill={`url(#chatGradient-${uniqueId})`}
          filter={`url(#shadow-${uniqueId})`}
        />

        {/* Main Chat Bubble */}
        <path
          d="M45 60 L145 60 Q160 60 160 75 L160 115 Q160 130 145 130 L75 130 L55 150 L55 130 Q45 130 45 115 L45 75 Q45 60 60 60 Z"
          fill="white"
        />

        {/* Medical Cross Icon */}
        <rect x="70" y="85" width="16" height="4" fill="#059669" rx="1" />
        <rect x="72" y="83" width="12" height="8" fill="#059669" rx="1" />

        {/* Code Brackets */}
        <text
          x="95"
          y="95"
          fontFamily="monospace"
          fontSize="14"
          fill="#6366f1"
          fontWeight="bold"
        >
          &lt; /&gt;
        </text>

        {/* Medical Code */}
        <text x="75" y="110" fontFamily="monospace" fontSize="8" fill="#64748b">
          ICD-10
        </text>

        {/* AI Indicator Dots */}
        <circle cx="110" cy="108" r="2" fill="#10b981" />
        <circle cx="118" cy="108" r="2" fill="#10b981" />
        <circle cx="126" cy="108" r="2" fill="#10b981" />

        {/* Small Medical Symbol in Corner */}
        <g transform="translate(140, 70)">
          <circle cx="0" cy="0" r="8" fill="#ef4444" opacity="0.9" />
          <rect x="-3" y="-1" width="6" height="2" fill="white" rx="0.5" />
          <rect x="-1" y="-3" width="2" height="6" fill="white" rx="0.5" />
        </g>
      </svg>
    </div>
  );
};

const formatMarkdown = (text) => {
  return text
    .replace(
      /### Supported CPT Codes/g,
      '<div class="chat-section-title supported-codes">Supported CPT Codes</div>'
    )
    .replace(
      /### Unsupported CPT Codes/g,
      '<div class="chat-section-title unsupported-codes">Unsupported CPT Codes</div>'
    )
    .replace(
      /### Final CPT Codes/g,
      '<div class="chat-section-title final-codes">Final CPT Codes</div>'
    )
    .replace(
      /### Supported ICD Codes/g,
      '<div class="chat-section-title supported-codes">Supported ICD Codes</div>'
    )
    .replace(
      /### Unsupported ICD Codes/g,
      '<div class="chat-section-title unsupported-codes">Unsupported ICD Codes</div>'
    )
    .replace(
      /### Final ICD Codes/g,
      '<div class="chat-section-title final-codes">Final ICD Codes</div>'
    )
    .replace(/### (.*?)\n/g, '<div class="chat-section-title">$1</div>')
    .replace(/## (.*?)\n/g, '<div class="chat-section-title">$1</div>')
    .replace(
      /\*\*(CPT Code:.*?)\*\*/g,
      '<span class="chat-cpt-label">$1</span>'
    )
    .replace(
      /\*\*(ICD Code:.*?)\*\*/g,
      '<span class="chat-icd-label">$1</span>'
    )
    .replace(
      /\*\*(Description:.*?)\*\*/g,
      '<span class="chat-description-label">$1</span>'
    )
    .replace(
      /\*\*(Reason:.*?)\*\*/g,
      '<span class="chat-reason-label">$1</span>'
    )
    .replace(/\*\*(.*?)\*\*/g, '<span class="chat-strong">$1</span>')
    .replace(/\*(.*?)\*/g, '<span class="chat-emphasis">$1</span>')
    .replace(/---/g, '<hr class="chat-divider">')
    .replace(/\n\n/g, '<div class="chat-paragraph-break"></div>')
    .replace(/<\/div>\n/g, "</div>");
};

const TypingIndicator = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
    <CircularProgress size={16} />
    <Typography variant="body2" color="textSecondary">
      AI is typing...
    </Typography>
  </Box>
);

const MessageBubble = ({ message, isUser }) => (
  <Box
    sx={{
      display: "flex",
      mb: 1.5,
      justifyContent: isUser ? "flex-end" : "flex-start",
    }}
  >
    <Box
      sx={{
        display: "flex",
        maxWidth: "85%",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: "primary.main", width: 24, height: 24 }}>
          <Bot size={14} />
        </Avatar>
      )}

      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          backgroundColor: isUser ? "primary.main" : "grey.100",
          color: isUser ? "white" : "text.primary",
          borderRadius: 2,
          fontSize: "0.875rem",
        }}
      >
        {typeof message.content === "string" ? (
          <Typography variant="body2">{message.content}</Typography>
        ) : React.isValidElement(message.content) ? (
          message.content
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: formatMarkdown(message.content),
            }}
          />
        )}
      </Paper>

      {isUser && (
        <Avatar sx={{ bgcolor: "grey.400", width: 24, height: 24 }}>
          <User size={14} />
        </Avatar>
      )}
    </Box>
  </Box>
);

const FloatingChat = ({ documentId, onNewChatMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !documentId || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message
    const newMessages = [...messages, { type: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Notify parent component about new chat message
    if (onNewChatMessage) {
      onNewChatMessage(userMessage);
    }

    try {
      // Add typing indicator
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: <TypingIndicator /> },
      ]);

      const response = await apiService.sendChatMessage(
        documentId,
        userMessage
      );
      const reader = response.body.getReader();
      let accumulatedResponse = "";

      // Remove typing indicator
      setMessages((prev) => prev.slice(0, -1));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.text) {
                accumulatedResponse += data.text;

                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (newMessages[newMessages.length - 1]?.type === "bot") {
                    newMessages[newMessages.length - 1] = {
                      type: "bot",
                      content: accumulatedResponse,
                    };
                  } else {
                    newMessages.push({
                      type: "bot",
                      content: accumulatedResponse,
                    });
                  }
                  return newMessages;
                });
              }

              if (data.error) {
                throw new Error(data.error);
              }
            } catch (jsonError) {
              console.error("Error parsing SSE data:", jsonError);
              if (line.trim() && !line.includes("undefined")) {
                accumulatedResponse += line.slice(6);
                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (newMessages[newMessages.length - 1]?.type === "bot") {
                    newMessages[newMessages.length - 1] = {
                      type: "bot",
                      content: accumulatedResponse,
                    };
                  } else {
                    newMessages.push({
                      type: "bot",
                      content: accumulatedResponse,
                    });
                  }
                  return newMessages;
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1]?.type === "bot") {
          newMessages[newMessages.length - 1] = {
            type: "bot",
            content:
              "Sorry, there was an error processing your message. Please try again.",
          };
        } else {
          newMessages.push({
            type: "bot",
            content:
              "Sorry, there was an error processing your message. Please try again.",
          });
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <Fab
        color="primary"
        onClick={handleToggleChat}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          boxShadow: 3,
          "&:hover": {
            boxShadow: 6,
            transform: "scale(1.05)",
          },
        }}
      >
        <MessageCircle size={24} />
      </Fab> */}
      {/* Floating Chat Icon */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AICoderIcon size={56} onClick={handleToggleChat} />
      </div>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            // width: 400,
            // height: isMinimized ? 60 : 500,
            width: isMinimized ? 400 : "50%",
            height: isMinimized ? 60 : "80%",
            zIndex: 1001,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "height 0.3s ease-in-out",
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: isMinimized ? "pointer" : "default",
            }}
            onClick={isMinimized ? handleMaximize : undefined}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* <MessageCircle size={20} /> */}
              <AICoderIcon size={24} />
              <Typography variant="subtitle1" fontWeight="bold">
                AI Medical Coder Assistant
              </Typography>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={handleMinimize}
                sx={{ color: "white", mr: 1 }}
              >
                <Minimize2 size={16} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleToggleChat}
                sx={{ color: "white" }}
              >
                <X size={16} />
              </IconButton>
            </Box>
          </Box>

          {!isMinimized && (
            <>
              {/* Messages */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: "auto",
                  p: 2,
                  backgroundColor: "grey.50",
                }}
              >
                {messages.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Bot size={32} color="#ccc" />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Ask me about CPT codes, ICD codes, or medical
                      documentation
                    </Typography>
                  </Box>
                )}

                {messages.map((message, index) => (
                  <MessageBubble
                    key={index}
                    message={message}
                    isUser={message.type === "user"}
                  />
                ))}

                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <Box sx={{ p: 2, backgroundColor: "white" }}>
                <form onSubmit={handleSendMessage}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      placeholder="Type your question..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isLoading || !documentId}
                      multiline
                      maxRows={2}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        !inputMessage.trim() || isLoading || !documentId
                      }
                      sx={{ minWidth: 50, px: 2 }}
                    >
                      <Send size={16} />
                    </Button>
                  </Box>
                </form>
              </Box>
            </>
          )}
        </Paper>
      </Fade>

      {/* Backdrop */}
      <Backdrop
        open={isOpen && !isMinimized}
        onClick={handleToggleChat}
        sx={{ zIndex: 999 }}
      />
    </>
  );
};

export default FloatingChat;
