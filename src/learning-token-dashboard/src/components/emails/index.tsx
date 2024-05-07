import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import React from "react";

const codeContainer = {
    borderRadius: "4px",
    margin: "16px auto 14px",
    verticalAlign: "middle",
    width: "380px",
    border: "1px solid navy",
};

const baseUrl = process.env.LT_URL
    ? `https://${process.env.LT_URL}`
    : "";

interface InviteLearnerEmailProps {
    username: string;
    invitedBy: string;
    invitedByEmail: string;
    courseName: string;
    instituteImage: string;
    inviteLink: string;
    instituteName: string;
}

interface InviteLearnerEmailComponent extends React.FC<InviteLearnerEmailProps> {
    PreviewProps: InviteLearnerEmailProps;
  }
  
export const InviteLearnerEmail: InviteLearnerEmailComponent = ({
    username,
    invitedBy,
    invitedByEmail,
    courseName,
    instituteImage,
    inviteLink,
    instituteName,
}) => {
    const previewText = `Join ${invitedBy} on Learning Tokens`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={`${baseUrl}/static/hyperledger-logo.png`}
                                width="200"
                                height="37"
                                alt="hyperledger"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Join <strong>{courseName}</strong> on <strong>{instituteName}</strong>
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {username},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            <strong>{invitedBy}</strong> (
                            <Link
                                href={`mailto:${invitedByEmail}`}
                                className="text-blue-600 no-underline"
                            >
                                {invitedByEmail}
                            </Link>
                            ) has invited you to the <strong>{courseName}</strong> Coursework on{" "}
                            <strong>Learning Tokens</strong>.
                        </Text>
                        <Section>
                            <Container style={codeContainer}>
                                <Row>
                                    <Column align="left">
                                        <img src={instituteImage} alt="Institute" className="h-32 w-32" />
                                    </Column>
                                    <Column>
                                        <div className="border-l border-gray-400 h-full"></div>
                                    </Column>
                                    <Column align="left">
                                        <Text className="text-lg font-semibold mt-1">{courseName}</Text>
                                        <p className="text-sm text-gray-400">{instituteName}</p>
                                        <Button
                                            className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-2"
                                            href={inviteLink}>
                                            Join the course
                                        </Button>
                                    </Column>
                                </Row>
                            </Container>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Or copy and paste this URL into your browser:{" "}
                            <Link href={inviteLink} className="text-blue-600 no-underline">
                                {inviteLink}
                            </Link>
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This invitation was intended for{" "}
                            <span className="text-black">{username}</span>. This invite was
                            sent from <span className="text-black">Learning Tokens</span>{" "}
                            an Open Source Initiative under <span className="text-black">Hyperledger</span> using composable <span className="text-black">IWA TTF.</span>{" "}
                            If you were not expecting this invitation, you can ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

InviteLearnerEmail.PreviewProps = {
    username: "Harsh",
    invitedBy: "Piash",
    instituteName: "Learning Tokens",
    invitedByEmail: "piash@example.com",
    courseName: "Solidity Programming",
    instituteImage: `${baseUrl}/static/institution.png`,
    inviteLink: "http://localhost:5173/login",
};

export default InviteLearnerEmail;