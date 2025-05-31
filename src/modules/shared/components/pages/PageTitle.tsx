import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

interface PageTitleProps {
  title: string;
  description: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div>
      <Title level={3} style={{ margin: 0 }}>
        {title}
      </Title>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        {description}
      </Paragraph>
    </div>
  );
}
