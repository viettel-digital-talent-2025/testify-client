import { Space } from "antd";

interface LayoutProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const LayoutStatic = ({ children, style }: LayoutProps) => {
  return (
    <div className="flex h-full flex-col gap-4" style={style}>
      {children}
    </div>
  );
};

export const LayoutScroll = ({ children, style }: LayoutProps) => {
  return (
    <div
      className="flex h-full flex-col overflow-x-clip overflow-y-auto px-8 pb-4"
      style={style}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {children}
      </Space>
    </div>
  );
};

export const ComponentScroll = ({ children, style }: LayoutProps) => {
  return (
    <div
      className="scrollbar-hide flex flex-1 flex-col space-y-4 overflow-y-auto"
      style={style}
    >
      {children}
    </div>
  );
};
