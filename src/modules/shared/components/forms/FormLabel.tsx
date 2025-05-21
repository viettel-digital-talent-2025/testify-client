import Paragraph from "antd/es/typography/Paragraph";

export default function FormLabel({ label }: { label: string }) {
  return (
    <Paragraph strong style={{ marginBottom: 0 }}>
      {label}
    </Paragraph>
  );
}
