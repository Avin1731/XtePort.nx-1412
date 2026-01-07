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
  Heading,
  Img,
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
  
  // 👇 1. URL LOGO: Kita hardcode ke Vercel kamu karena file-nya SUDAH ADA di GitHub
  // Saya cek URL ini valid: https://xte-port-nx-1412.vercel.app/images/logo.jpg
  const baseUrl = "https://xte-port-nx-1412.vercel.app";
  const logoUrl = `${baseUrl}/images/logo.jpg`;

  // 👇 2. SAFE URL LOGIC
  const safePostUrl = postUrl.includes("localhost") 
    ? `${baseUrl}/guestbook` 
    : postUrl;

  return (
    <Html>
      <Head />
      <Preview>New reply from {senderName}</Preview>
      {/* ❌ HAPUS TAILWIND, GANTI BODY STYLE MANUAL 👇 */}
      <Body style={main}>
        <Container style={container}>
          
          {/* HEADER LOGO */}
          <Section style={{ marginTop: "20px", marginBottom: "20px" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Img 
                    src={logoUrl} 
                    width="40" 
                    height="40" 
                    alt="A-1412 Logo" 
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                />
                <div style={{ marginLeft: "12px" }}>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#000", display: "block", lineHeight: "1" }}>
                        A-1412
                    </span>
                    <span style={{ fontSize: "12px", color: "#888", marginTop: "4px", display: "block" }}>
                        Guestbook Notification
                    </span>
                </div>
             </div>
          </Section>

          {/* MAIN HEADING */}
          <Heading style={h1}>
            Hey {recipientName},<br/>
            <span style={{ fontSize: "18px", fontWeight: "normal", color: "#666" }}>
                Someone joined the conversation!
            </span>
          </Heading>
          
          <Text style={text}>
            <strong>{senderName}</strong> just replied to your comment:
          </Text>

          {/* QUOTE BLOCK (Tema User: Abu/Hitam) */}
          <Section style={quoteBox}>
            <Text style={quoteText}>
              &quot;{replyContent}&quot;
            </Text>
          </Section>

          {/* BUTTON (Hitam) */}
          <Section style={{ textAlign: "center" as const, margin: "32px 0" }}>
            <Button style={btn} href={safePostUrl}>
              Reply Back
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          {/* FOOTER */}
          <Text style={footer}>
            You received this email because you participated in a discussion on <Link href={baseUrl} style={{ color: "#666", textDecoration: "underline" }}>a-1412.dev</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// --- STYLES MANUAL (Sama tekniknya kayak Admin, tapi beda warna) ---
const main = {
  backgroundColor: "#f3f4f6",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 40px",
  maxWidth: "480px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  marginTop: "40px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "24px 0",
  lineHeight: "1.3",
};

const text = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "26px",
};

const quoteBox = {
  backgroundColor: "#f9fafb", // Abu sangat muda
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  borderLeft: "4px solid #000000", // Aksen Hitam
  margin: "24px 0",
};

const quoteText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#111827",
  fontStyle: "italic",
  margin: 0,
};

const btn = {
  backgroundColor: "#000000", // Tombol Hitam
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 24px",
  width: "100%",
  boxSizing: "border-box" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "20px",
};