"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { FormInstance } from "antd/es/form/Form";
import { Form } from "antd";
import { ScenarioType, ScenarioFlowType } from "@/scenarios/types/scenario";
import { getScenarioStrategy, ScenarioStrategy } from "@/scenarios/strategies";

interface EditingStepProps {
  flowName: number;
  name: number;
}

interface ScenarioFormContextType {
  form: FormInstance;
  strategy: ScenarioStrategy;
  setStrategy: (strategy: ScenarioStrategy) => void;
  editingStep: EditingStepProps;
  handleEditStep: (step: EditingStepProps) => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  lockedIndexes: number[];
  setLockedIndexes: (indexes: number[]) => void;
}

const FormContext = createContext<ScenarioFormContextType | null>(null);

export const useScenarioFormContext = (): ScenarioFormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return context;
};

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  const type = Form.useWatch("type", form);
  const [strategy, setStrategy] = useState<ScenarioStrategy>(
    getScenarioStrategy(ScenarioType.WEB),
  );
  const [editingStep, setEditingStep] = useState<EditingStepProps>({
    flowName: 0,
    name: 0,
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lockedIndexes, setLockedIndexes] = useState<number[]>([]);

  useEffect(() => {
    const setDefaultValues = async () => {
      const [type, flow] = await Promise.all([
        form.getFieldValue("type"),
        form.getFieldValue("flow"),
      ]);
      if (!type || !flow) {
        await form.setFieldsValue({
          type: ScenarioType.WEB,
          flowType: ScenarioFlowType.SIMPLE,
        });
      }
    };

    setDefaultValues();
  }, [form]);

  useEffect(() => {
    setStrategy(getScenarioStrategy(type));
  }, [type]);

  const handleEditStep = useCallback(
    (step: EditingStepProps) => {
      setEditingStep(step);
      setModalVisible(true);
    },
    [setEditingStep, setModalVisible],
  );

  return (
    <FormContext.Provider
      value={{
        form,
        strategy,
        setStrategy,
        editingStep,
        handleEditStep,
        modalVisible,
        setModalVisible,
        lockedIndexes,
        setLockedIndexes,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
