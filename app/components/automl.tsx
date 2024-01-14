import React, { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Radio,
  Modal,
  Spin,
  Table,
  Upload,
  Input,
  Result,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { ossUpload } from "../client/platforms/oss";
import { ServerlessClient } from "../client/platforms/automl";

export function AutoML() {
  const [messageApi, contextHolder] = message.useMessage();

  const [isModeling, setIsModeling] = useState<boolean>(false);

  const [isDeployed, setIsDeployed] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File>();

  const [fileContent, setFileContent] = useState<string>();

  const [selectedFeature, setSelectedFeature] = useState<CheckboxValueType[]>();

  const [selectedTarget, setSelectedTarget] = useState<string>();

  const [description, setDescription] = useState<string>();

  const [modelName, setModelName] = useState<string>();

  const [modelGraphHtml, setModelGraphHtml] = useState<any>("");

  const serverlessClient = useMemo(() => {
    return new ServerlessClient();
  }, []);

  const dataRows = useMemo(() => {
    return fileContent?.split("\n");
  }, [fileContent]);

  const columns = useMemo(() => {
    const head = dataRows?.at(0)?.split(",");
    return head?.map((name) => {
      return {
        title: name,
        dataIndex: name,
        width: 300,
      };
    });
  }, [dataRows]);

  const options = useMemo(() => {
    return columns
      ?.map((c) => {
        return c.title;
      })
      .filter((item) => item);
  }, [columns]);

  const tableData = useMemo(() => {
    return dataRows?.slice(1).map((row) => {
      return row.split(",").reduce((pre, curr, columnIndex) => {
        const label = columns?.[columnIndex].dataIndex;
        if (label) {
          pre[label] = curr;
        }
        return pre;
      }, {} as any);
    });
  }, [dataRows]);

  const onSubmit = async () => {
    if (!(selectedFile && selectedFeature && selectedTarget)) return;
    setIsModeling(true);
    const uploaded = await ossUpload(selectedFile);
    const url = uploaded.url as string;
    const modelGraphHtml = await serverlessClient.runAutoML({
      dataId: url.split("/").at(-1)!,
      feature: selectedFeature as string[],
      target: selectedTarget,
    });
    setIsModeling(false);
    setModelGraphHtml(modelGraphHtml);
  };

  return (
    <Spin
      spinning={isModeling}
      tip="正在自动进行机器学习建模中..."
      size="large"
    >
      {contextHolder}
      <div>
        {isDeployed ? (
          <Result status="success" title="模型已部署"></Result>
        ) : modelGraphHtml ? (
          <>
            <div
              style={{ overflow: "scroll" }}
              dangerouslySetInnerHTML={{
                __html: modelGraphHtml["pipeline_html_repr"],
              }}
            />
            <Button
              type="primary"
              size="large"
              style={{
                width: "100%",
                marginTop: "30px",
              }}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              部署模型
            </Button>
            <Modal
              okText="确认"
              cancelText="取消"
              title="模型描述"
              open={modalOpen}
              onOk={async () => {
                setModalOpen(false);
                const res = await serverlessClient.addModel({
                  name: modelName as string,
                  description: description as string,
                  features: selectedFeature as string[],
                  target: selectedTarget as string,
                  pipeline_id: modelGraphHtml["pipeline_id"],
                });
                setIsDeployed(true);
              }}
              onCancel={() => setModalOpen(false)}
              centered
            >
              <h3>模型名称</h3>
              <Input
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match(/^[a-zA-Z0-9_-]{1,64}$/)) {
                    setModelName(value);
                  } else {
                    messageApi.error("模型名称仅可由英文字母构成");
                  }
                }}
                placeholder="仅限英文"
              ></Input>
              <h3>模型描述</h3>
              <Input.TextArea
                rows={4}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </Modal>
          </>
        ) : !fileContent ? (
          <Upload.Dragger
            customRequest={({ file }) => {
              setSelectedFile(file as File);
              const reader = new FileReader();
              reader.readAsText(file as Blob);
              reader.onload = (e) => {
                const fileContent = e.target?.result;
                setFileContent(fileContent as string);
              };
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">上传数据</p>
            <p className="ant-upload-hint">点击上传, 或将文件拖拽至此</p>
          </Upload.Dragger>
        ) : (
          <>
            <h2>数据</h2>
            <Table size="small" columns={columns} dataSource={tableData} />
            <h2>选择特征列</h2>
            <Checkbox.Group onChange={(value) => setSelectedFeature(value)}>
              {options?.map((option, index) => {
                return (
                  <Checkbox
                    value={option}
                    disabled={selectedTarget?.includes(option)}
                    key={index}
                  >
                    {option}
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
            <h2>选择预测目标列</h2>
            <Radio.Group onChange={(e) => setSelectedTarget(e.target.value)}>
              {options?.map((option, index) => {
                return (
                  <Radio
                    value={option}
                    key={index}
                    disabled={selectedFeature?.includes(option)}
                  >
                    {option}
                  </Radio>
                );
              })}
            </Radio.Group>
            <Button
              onClick={onSubmit}
              type="primary"
              size="large"
              disabled={
                selectedFeature?.length === 0 || selectedTarget?.length === 0
              }
              style={{
                width: "100%",
                marginTop: "30px",
              }}
            >
              提交
            </Button>
          </>
        )}
      </div>
    </Spin>
  );
}
