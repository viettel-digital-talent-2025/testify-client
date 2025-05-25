import { Footer as AntFooter } from "antd/es/layout/layout";
import { colors } from "@/modules/shared/constants/colors";
import Paragraph from "antd/es/typography/Paragraph";

export default function Footer() {
  return (
    <AntFooter
      style={{ textAlign: "center", backgroundColor: colors.background }}
    >
      <Paragraph style={{ margin: 0 }}>
        &copy; {new Date().getFullYear()} Testify. All rights reserved.
      </Paragraph>
    </AntFooter>
  );
}
