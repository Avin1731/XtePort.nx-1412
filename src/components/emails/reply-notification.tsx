import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface ReplyNotificationEmailProps {
  recipientName: string;
  senderName: string;
  replyContent: string;
  postUrl: string;
}

export default function ReplyNotificationEmail({
  recipientName,
  senderName,
  replyContent,
  postUrl,
}: ReplyNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{senderName} replied to your comment on Guestbook</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={heading}>New Reply Received! 💬</Text>
            <Text style={paragraph}>Hi {recipientName},</Text>
            <Text style={paragraph}>
              <strong>{senderName}</strong> just replied to your comment:
            </Text>
            
            <Section style={quoteContainer}>
              <Text style={quote}>&quot;{replyContent}&quot;</Text>
            </Section>

            <Button style={button} href={postUrl}>
              View Discussion
            </Button>
            
            <Hr style={hr} />
            
            <Text style={footer}>
              A-1412.dev Guestbook • <Link href="https://a-1412.dev">Visit Website</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- STYLES ---
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  marginTop: "40px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  maxWidth: "580px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  color: "#333",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#555",
  padding: "0 40px",
};

const quoteContainer = {
  padding: "10px 40px",
};

const quote = {
  backgroundColor: "#f0f0f0",
  padding: "16px",
  borderRadius: "6px",
  fontSize: "14px",
  fontStyle: "italic",
  color: "#333",
  borderLeft: "4px solid #000",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "12px",
  margin: "30px auto",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};