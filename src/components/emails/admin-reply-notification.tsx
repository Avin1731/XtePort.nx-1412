import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
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
  return (
    <Html>
      <Head />
      <Preview>Official response from Admin</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            {/* Header Badge */}
            <Section className="mt-[20px]">
                <div className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit tracking-wide">
                    ADMIN RESPONSE
                </div>
            </Section>

            <Heading className="text-black text-[20px] font-bold p-0 my-[20px] mx-0">
              Hello, {recipientName}
            </Heading>
            
            <Text className="text-gray-600 text-[14px] leading-[24px]">
              The administrator has replied to your guestbook post.
            </Text>

            {/* Quote Block */}
            <Section className="my-[20px] bg-gray-50 p-4 rounded-md border-l-4 border-black">
                <Text className="text-gray-800 text-[14px] leading-[24px] m-0 font-medium">
                    &quot;{replyContent}&quot;
                </Text>
            </Section>

            <Section className="mt-[32px] mb-[32px]">
              <Link
                className="bg-blue-600 rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 block w-full"
                href={postUrl}
              >
                View Discussion
              </Link>
            </Section>
            
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              A-1412 Portfolio • Automated Notification
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AdminReplyNotificationEmail;