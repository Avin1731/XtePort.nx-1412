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
  Tailwind,
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
  
  // 👇 1. GUNAKAN URL VERCEL LANGSUNG (Supaya gambar muncul saat testing di Localhost)
  // Jangan pakai process.env.NEXT_PUBLIC_APP_URL dulu biar aman.
  const baseUrl = "https://xte-port-nx-1412.vercel.app"; 
  
  // Pastikan file public/images/logo.jpg sudah ada dan ter-deploy ke Vercel
  const logoUrl = `${baseUrl}/images/logo.jpg`;
  
  // Jika logo belum ada di Vercel, pakai placeholder ini sementara:
  // const logoUrl = "https://github.com/shadcn.png"; 

  // 👇 2. SAFE URL LOGIC (Agar tombol tidak mengarah ke localhost)
  const safePostUrl = postUrl.includes("localhost") 
    ? `${baseUrl}/guestbook` 
    : postUrl;

  return (
    <Html>
      <Head />
      <Preview>New reply from {senderName}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 my-auto mx-auto font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[480px] shadow-sm">
            
            {/* ✅ HEADER DENGAN LOGO */}
            <Section className="mt-[10px] mb-[20px]">
                <div className="flex items-center gap-3">
                    <Img 
                        src={logoUrl} 
                        width="40" 
                        height="40" 
                        alt="A-1412 Logo" 
                        className="rounded-md object-cover border border-gray-100"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-gray-900 leading-none">A-1412</span>
                        <span className="text-gray-400 text-xs">Guestbook Notification</span>
                    </div>
                </div>
            </Section>

            {/* Main Heading */}
            <Heading className="text-gray-900 text-[22px] font-bold p-0 my-[20px] mx-0 leading-tight">
              Hey {recipientName},<br/>
              <span className="text-gray-500 font-normal text-[18px]">Someone joined the conversation!</span>
            </Heading>
            
            <Text className="text-gray-600 text-[15px] leading-[24px]">
              <strong>{senderName}</strong> just replied to your comment. Here is what they said:
            </Text>

            {/* Quote Block */}
            <Section className="my-[20px] bg-gray-50 p-6 rounded-xl border border-gray-100 relative">
                <Text className="absolute top-2 left-4 text-gray-200 text-[40px] leading-none font-serif">“</Text>
                <Text className="text-gray-700 text-[15px] leading-[24px] m-0 italic relative z-10 pl-2">
                    {replyContent}
                </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-gray-900 text-white rounded-md text-[14px] font-semibold no-underline text-center px-6 py-3 w-full sm:w-auto hover:bg-gray-800 transition-colors"
                href={safePostUrl}
              >
                Reply Back
              </Button>
            </Section>
            
            <Hr className="border-gray-200 my-[26px] mx-0 w-full" />
            
            {/* Footer */}
            <Text className="text-gray-400 text-[12px] leading-[20px] text-center">
              You received this email because you participated in a discussion on <Link href={baseUrl} className="text-gray-500 underline">a-1412.dev</Link>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}