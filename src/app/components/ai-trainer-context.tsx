import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface TrainingRequest {
  id: number;
  projectName: string;
  dataset: string;
  createdDate: string;
  creator: string;
  goalSummary: string;
  technicalSpecs: string;
  dataStatus: string;
  status: 'pending' | 'training' | 'completed' | 'rejected';
  rejectReason?: string;
  trainingProgress?: number;
  datasetContent: DatasetRow[];
  results?: TrainingResult[];
}

export interface DatasetRow {
  id: number;
  symptom: string;
  diagnosis: string;
  confidence: number;
  notes: string;
}

export interface TrainingResult {
  label: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  status: 'accepted' | 'rejected' | 'pending';
}

export interface PromptConfig {
  diseaseLabels: string[];
  systemRole: string;
  contextInjection: string;
}

interface AITrainerContextType {
  requests: TrainingRequest[];
  addRequest: (request: Omit<TrainingRequest, 'id' | 'createdDate' | 'status'>) => void;
  updateRequest: (id: number, updates: Partial<TrainingRequest>) => void;
  acceptRequest: (id: number) => void;
  rejectRequest: (id: number, reason: string) => void;
  getTrainingRequest: () => TrainingRequest | undefined;
  completeTraining: (id: number, results: TrainingResult[]) => void;
  updateDatasetContent: (id: number, content: DatasetRow[]) => void;
  updateResultStatus: (requestId: number, label: string, status: 'accepted' | 'rejected') => void;
  promptConfig: PromptConfig;
  updatePromptConfig: (config: Partial<PromptConfig>) => void;
  getAllDiseaseLabels: () => string[];
}

const AITrainerContext = createContext<AITrainerContextType | undefined>(undefined);

const sampleDatasetContent: DatasetRow[] = [
  { id: 1, symptom: 'Sốt cao, ho khan, đau đầu', diagnosis: 'Cảm cúm', confidence: 0.92, notes: 'Triệu chứng điển hình' },
  { id: 2, symptom: 'Đau bụng dưới, buồn nôn', diagnosis: 'Viêm ruột thừa', confidence: 0.85, notes: 'Cần xét nghiệm thêm' },
  { id: 3, symptom: 'Khó thở, đau ngực', diagnosis: 'Viêm phế quản', confidence: 0.88, notes: 'Đã xác nhận qua X-quang' },
  { id: 4, symptom: 'Mẩn đỏ, ngứa', diagnosis: 'Dị ứng da', confidence: 0.95, notes: 'Phản ứng dị ứng thức ăn' },
  { id: 5, symptom: 'Đau khớp, sưng', diagnosis: 'Viêm khớp', confidence: 0.78, notes: 'Triệu chứng mãn tính' }
];

const initialRequests: TrainingRequest[] = [
  {
    id: 1,
    projectName: 'Model chẩn đoán cảm cúm',
    dataset: 'Flu_Diagnosis_v2.csv',
    createdDate: '2026-05-20',
    creator: 'Nguyễn Văn Expert',
    goalSummary: 'Huấn luyện model nhận diện các triệu chứng cảm cúm thông thường và phân biệt với COVID-19',
    technicalSpecs: 'BERT-based, fine-tuning trên 10k mẫu, batch size 32, learning rate 2e-5',
    dataStatus: 'Đã làm sạch và chuẩn hóa',
    status: 'pending',
    datasetContent: sampleDatasetContent
  },
  {
    id: 2,
    projectName: 'Model phân loại bệnh da liễu',
    dataset: 'Dermatology_Dataset_v1.csv',
    createdDate: '2026-05-18',
    creator: 'Lê Văn AI Expert',
    goalSummary: 'Phân loại 15 loại bệnh da phổ biến dựa trên mô tả triệu chứng',
    technicalSpecs: 'CNN + Transformer, augmentation, 5-fold cross-validation',
    dataStatus: 'Cần bổ sung thêm 2000 mẫu',
    status: 'pending',
    datasetContent: sampleDatasetContent.slice(0, 3)
  },
  {
    id: 3,
    projectName: 'Model dự đoán tiểu đường',
    dataset: 'Diabetes_Risk_v3.csv',
    createdDate: '2026-05-15',
    creator: 'Nguyễn Văn Expert',
    goalSummary: 'Đánh giá nguy cơ tiểu đường type 2 từ thông tin bệnh sử và triệu chứng',
    technicalSpecs: 'Random Forest + XGBoost ensemble, SMOTE for balancing',
    dataStatus: 'Hoàn chỉnh',
    status: 'completed',
    datasetContent: sampleDatasetContent,
    results: [
      { label: 'Tiểu đường Type 2', accuracy: 0.94, precision: 0.92, recall: 0.91, f1Score: 0.915, status: 'accepted' },
      { label: 'Tiền tiểu đường', accuracy: 0.88, precision: 0.85, recall: 0.87, f1Score: 0.86, status: 'accepted' },
      { label: 'Bình thường', accuracy: 0.96, precision: 0.95, recall: 0.94, f1Score: 0.945, status: 'accepted' }
    ]
  }
];

export function AITrainerProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<TrainingRequest[]>(initialRequests);
  const [promptConfig, setPromptConfig] = useState<PromptConfig>({
    diseaseLabels: [],
    systemRole: '',
    contextInjection: ''
  });

  const addRequest = (request: Omit<TrainingRequest, 'id' | 'createdDate' | 'status'>) => {
    const newRequest: TrainingRequest = {
      ...request,
      id: Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setRequests(prev => [newRequest, ...prev]);
    toast.success('Đã tạo yêu cầu huấn luyện mới!');
  };

  const updateRequest = (id: number, updates: Partial<TrainingRequest>) => {
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, ...updates } : req))
    );
  };

  const acceptRequest = (id: number) => {
    // Check if there's already a training request
    const hasTraining = requests.some(r => r.status === 'training');
    if (hasTraining) {
      toast.error('Đã có yêu cầu đang được huấn luyện!');
      return;
    }

    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status: 'training' as const, trainingProgress: 0 }
          : req
      )
    );

    // Simulate training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Generate mock results
        const mockResults: TrainingResult[] = [
          {
            label: 'Cảm cúm',
            accuracy: 0.92 + Math.random() * 0.05,
            precision: 0.90 + Math.random() * 0.05,
            recall: 0.88 + Math.random() * 0.05,
            f1Score: 0.89 + Math.random() * 0.05,
            status: 'pending'
          },
          {
            label: 'COVID-19',
            accuracy: 0.95 + Math.random() * 0.04,
            precision: 0.93 + Math.random() * 0.04,
            recall: 0.94 + Math.random() * 0.04,
            f1Score: 0.935 + Math.random() * 0.04,
            status: 'pending'
          },
          {
            label: 'Cảm lạnh thông thường',
            accuracy: 0.87 + Math.random() * 0.05,
            precision: 0.85 + Math.random() * 0.05,
            recall: 0.86 + Math.random() * 0.05,
            f1Score: 0.855 + Math.random() * 0.05,
            status: 'pending'
          }
        ];

        completeTraining(id, mockResults);
      } else {
        setRequests(prev =>
          prev.map(req =>
            req.id === id ? { ...req, trainingProgress: progress } : req
          )
        );
      }
    }, 500);

    toast.success('Đã bắt đầu huấn luyện!');
  };

  const rejectRequest = (id: number, reason: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status: 'rejected' as const, rejectReason: reason }
          : req
      )
    );
    toast.success('Đã từ chối yêu cầu huấn luyện');
  };

  const getTrainingRequest = () => {
    return requests.find(r => r.status === 'training');
  };

  const completeTraining = (id: number, results: TrainingResult[]) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status: 'completed' as const, trainingProgress: 100, results }
          : req
      )
    );
    toast.success('Huấn luyện hoàn thành!');
  };

  const updateDatasetContent = (id: number, content: DatasetRow[]) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, datasetContent: content } : req
      )
    );
  };

  const updateResultStatus = (requestId: number, label: string, status: 'accepted' | 'rejected') => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId && req.results) {
          return {
            ...req,
            results: req.results.map(r =>
              r.label === label ? { ...r, status } : r
            )
          };
        }
        return req;
      })
    );
    toast.success(`Đã ${status === 'accepted' ? 'chấp nhận' : 'từ chối'} kết quả cho nhãn "${label}"`);
  };

  const updatePromptConfig = (config: Partial<PromptConfig>) => {
    setPromptConfig(prev => ({ ...prev, ...config }));
    toast.success('Đã cập nhật cấu hình prompt!');
  };

  const getAllDiseaseLabels = () => {
    const labels = new Set<string>();
    requests.forEach(req => {
      req.datasetContent.forEach(row => {
        if (row.diagnosis) {
          labels.add(row.diagnosis);
        }
      });
      req.results?.forEach(result => {
        labels.add(result.label);
      });
    });
    return Array.from(labels).sort();
  };

  return (
    <AITrainerContext.Provider
      value={{
        requests,
        addRequest,
        updateRequest,
        acceptRequest,
        rejectRequest,
        getTrainingRequest,
        completeTraining,
        updateDatasetContent,
        updateResultStatus,
        promptConfig,
        updatePromptConfig,
        getAllDiseaseLabels
      }}
    >
      {children}
    </AITrainerContext.Provider>
  );
}

export function useAITrainer() {
  const context = useContext(AITrainerContext);
  if (!context) {
    throw new Error('useAITrainer must be used within AITrainerProvider');
  }
  return context;
}
