import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Button,
  Img,
  Link,
} from "@react-email/components";
import * as React from "react";

interface AdminReplyEmailProps {
  recipientName: string;
  replyContent: string;
  postUrl: string;
}

export const AdminReplyNotificationEmail = ({
  recipientName,
  replyContent,
  postUrl,
}: AdminReplyEmailProps) => {
  
  // 👇 1. CONFIG URL: Hardcode ke Vercel agar gambar RELIABLE
  const baseUrl = "https://xte-port-nx-1412.vercel.app";
  
  // URL Logo Project Kamu (bukan placeholder lagi)
  const logoUrl = `${baseUrl}/images/logo.jpg`;
  
  // 👇 2. SAFE URL LOGIC
  const safePostUrl = postUrl.includes("localhost") 
    ? `${baseUrl}/guestbook` 
    : postUrl;

  return (
    <Html>
      <Head />
      <Preview>Official response from Admin</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* LOGO SECTION */}
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
                        A-1412 Admin
                    </span>
                    <span style={{ fontSize: "12px", color: "#2563eb", marginTop: "4px", display: "block", fontWeight: "600" }}>
                        Official Response
                    </span>
                </div>
             </div>
          </Section>

          {/* BADGE ADMIN */}
          <Section style={{ textAlign: "center" as const, marginBottom: "24px" }}>
            <span style={badge}>OFFICIAL ADMIN RESPONSE</span>
          </Section>

          {/* HEADING */}
          <Heading style={h1}>Hello, {recipientName}</Heading>
          
          <Text style={text}>
            The administrator has replied to your guestbook post.
          </Text>

          {/* QUOTE BLOCK (Tema Biru) */}
          <Section style={quoteBox}>
            <Text style={quoteText}>
              &quot;{replyContent}&quot;
            </Text>
          </Section>

          {/* BUTTON (Biru) */}
          <Section style={{ textAlign: "center" as const, margin: "32px 0" }}>
            <Button style={btn} href={safePostUrl}>
              View Discussion
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          {/* FOOTER */}
          <Text style={footer}>
            A-1412 Portfolio • <Link href={baseUrl} style={{ color: "#9ca3af", textDecoration: "underline" }}>Visit Website</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminReplyNotificationEmail;

// --- STYLES MANUAL (Admin Theme: Blue/Clean) ---
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
  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)", // Shadow biru tipis
};

const badge = {
  backgroundColor: "#2563eb", // Biru Elektrik
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: "bold",
  padding: "6px 12px",
  borderRadius: "99px",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
};

const h1 = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "20px 0",
};

const text = {
  color: "#4b5563",
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const quoteBox = {
  backgroundColor: "#eff6ff", // Biru sangat muda
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #dbeafe",
  borderLeft: "4px solid #2563eb", // Aksen Biru
  margin: "24px 0",
};

const quoteText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1e3a8a", // Biru Tua
  fontStyle: "italic",
  margin: 0,
};

const btn = {
  backgroundColor: "#2563eb", // Tombol Biru
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