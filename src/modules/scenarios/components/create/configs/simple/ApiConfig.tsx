import { Row, Col } from "antd";
import {
  EndpointInput,
  MethodSelect,
  HeadersInput,
  BodyTypeInput,
  PayloadInput,
} from "./input";

export default function ApiConfig() {
  return (
    <Row gutter={16}>
      {/* API Endpoint */}
      <Col span={12}>
        <EndpointInput />
      </Col>

      {/* HTTP Method */}
      <Col span={12}>
        <MethodSelect />
      </Col>

      {/* Headers */}
      <Col span={24}>
        <HeadersInput />
      </Col>

      <Col span={24}>
        {/* Body Type */}
        <BodyTypeInput />
        {/* Request Body */}
        <PayloadInput />
      </Col>
    </Row>
  );
}
