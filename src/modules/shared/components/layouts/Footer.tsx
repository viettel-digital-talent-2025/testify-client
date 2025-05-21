import { Footer as AntFooter } from "antd/es/layout/layout";
import Paragraph from "antd/es/typography/Paragraph";

export default function Footer() {
  return (
    <AntFooter style={{ textAlign: "center" }}>
      <Paragraph style={{ margin: 0 }}>
        &copy; {new Date().getFullYear()} Testify. All rights reserved.
      </Paragraph>
    </AntFooter>
  );
}
