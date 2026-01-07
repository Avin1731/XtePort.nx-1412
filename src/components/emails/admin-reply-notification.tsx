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
  // 👇 GUNAKAN GAMBAR PUBLIC (Placeholder GitHub) agar Gmail mau merender
  const logoUrl = "https://github.com/shadcn.png"; 
  
  // 👇 Fallback link jika postUrl masih localhost
  const safePostUrl = postUrl.includes("localhost") 
    ? "https://xte-port-nx-1412.vercel.app/guestbook" 
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
                    alt="Logo" 
                    style={{ borderRadius: "8px" }}
                />
                <span style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "10px", color: "#000" }}>
                    A-1412 Admin
                </span>
             </div>
          </Section>

          {/* BADGE ADMIN */}
          <Section style={{ textAlign: "center" as const, marginBottom: "20px" }}>
            <span style={badge}>OFFICIAL RESPONSE</span>
          </Section>

          <Heading style={h1}>Hello, {recipientName}</Heading>
          
          <Text style={text}>
            The administrator has replied to your guestbook post.
          </Text>

          {/* QUOTE BLOCK */}
          <Section style={quoteBox}>
            <Text style={quoteText}>
              &quot;{replyContent}&quot;
            </Text>
          </Section>

          {/* BUTTON */}
          <Section style={{ textAlign: "center" as const, margin: "30px 0" }}>
            <Button style={btn} href={safePostUrl}>
              View Discussion
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            A-1412 Portfolio • Automated Notification
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminReplyNotificationEmail;

// --- STYLES MANUAL (Lebih Aman dari Tailwind untuk Email) ---
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
};

const badge = {
  backgroundColor: "#2563eb", // Biru
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: "bold",
  padding: "6px 12px",
  borderRadius: "99px",
  letterSpacing: "1px",
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
  backgroundColor: "#eff6ff", // Biru muda
  padding: "20px",
  borderRadius: "12px",
  borderLeft: "4px solid #2563eb",
  margin: "20px 0",
};

const quoteText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1e3a8a", // Biru tua
  fontStyle: "italic",
  margin: 0,
};

const btn = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  width: "100%",
  boxSizing: "border-box" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
};