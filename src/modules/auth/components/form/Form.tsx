import Link from "next/link";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

export const FormTitle = ({ title }: { title: string }) => {
  return (
    <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
      {title}
    </Title>
  );
};

export const FormDescription = ({ description }: { description: string }) => {
  return (
    <Paragraph style={{ textAlign: "center", color: "#666" }}>
      {description}
    </Paragraph>
  );
};

export const FormFooter = ({
  description,
  link,
  linkText,
}: {
  description: string;
  link: string;
  linkText: string;
}) => {
  return (
    <Paragraph style={{ textAlign: "center", marginTop: 24 }}>
      {description}{" "}
      <Link href={link}>
        <Text strong>{linkText}</Text>
      </Link>
    </Paragraph>
  );
};
