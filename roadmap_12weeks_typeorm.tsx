import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react';

const Roadmap12Weeks = () => {
  const [expandedWeeks, setExpandedWeeks] = useState([1]);

  const toggleWeek = (week) => {
    setExpandedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const weeks = [
    {
      phase: "FASE 1: FUNDAÇÃO SÓLIDA",
      weeks: [
        {
          week: 1,
          title: "Setup + TypeORM Base",
          backend: [
            "Setup NestJS com estrutura modular",
            "Configurar TypeORM + PostgreSQL",
            "Criar entities User e configurar decorators",
            "Setup de migrations do TypeORM",
            "Configurar Docker Compose (PostgreSQL + Redis)",
            "Variáveis de ambiente estruturadas"
          ],
          mobile: [
            "Setup React Native + Expo",
            "Estrutura de pastas completa",
            "Configurar navegação base",
            "Theme system (cores, tipografia)",
            "Componentes base (Button, Input, Card)"
          ],
          learning: "Dominar decorators do TypeORM e relações"
        },
        {
          week: 2,
          title: "Autenticação Completa",
          backend: [
            "Módulo Auth com JWT + Refresh Token",
            "Guards e Decorators customizados (@CurrentUser)",
            "Entity User com relacionamentos",
            "Password hashing com bcrypt",
            "Refresh token rotation",
            "Testes unitários do Auth"
          ],
          mobile: [
            "AuthContext com AsyncStorage",
            "Telas: Login, Register, Onboarding",
            "Integração com API de auth",
            "Interceptor para refresh automático",
            "Loading states e error handling"
          ],
          learning: "Padrão de guards e interceptors do NestJS"
        },
        {
          week: 3,
          title: "Contas Bancárias",
          backend: [
            "Entity Account com decorators",
            "Relacionamento OneToMany (User → Accounts)",
            "CRUD completo de contas",
            "Validação de ownership",
            "Cálculo automático de saldo",
            "Seeds para desenvolvimento"
          ],
          mobile: [
            "Tela de listagem de contas",
            "Tela adicionar/editar conta",
            "Cards visuais com saldo",
            "useAccounts hook customizado",
            "Pull to refresh"
          ],
          learning: "Relacionamentos OneToMany e ManyToOne"
        }
      ]
    },
    {
      phase: "FASE 2: CORE DO PRODUTO",
      weeks: [
        {
          week: 4,
          title: "Transações - Parte 1 (Manual)",
          backend: [
            "Entity Transaction com todos os campos",
            "Enums (FiscalType, TransactionType, etc)",
            "Relacionamentos com Account e User",
            "CRUD completo com validações",
            "Atualização de saldo ao criar/editar/deletar",
            "Repository pattern para queries customizadas"
          ],
          mobile: [
            "Dashboard com resumo mensal",
            "Lista de transações com filtros",
            "Tela de adicionar transação manual",
            "Formulário com validação (react-hook-form)",
            "useTransactions hook com cache local"
          ],
          learning: "Repository pattern e custom queries"
        },
        {
          week: 5,
          title: "Classificação Fiscal Assistida",
          backend: [
            "Service de classificação fiscal (regras básicas)",
            "Integração com GPT-4 para sugestões",
            "Score de confiança da IA",
            "Histórico de edições do usuário",
            "Cache Redis para classificações frequentes",
            "Endpoint de sugestão de classificação"
          ],
          mobile: [
            "Tela de classificação fiscal",
            "Seletor de tipos fiscais com explicações",
            "Badges de confiança da IA",
            "Confirmação/edição de sugestões",
            "Info tooltips educativos"
          ],
          learning: "Integração com APIs de IA e caching estratégico"
        },
        {
          week: 6,
          title: "Agregações e Relatórios",
          backend: [
            "Query Builder para agregações mensais",
            "Totalizadores por conta, tipo fiscal, período",
            "Repository methods otimizados",
            "Índices de performance no banco",
            "Endpoint de resumo consolidado",
            "Testes de performance"
          ],
          mobile: [
            "Gráficos com react-native-chart-kit",
            "Cards de resumo (receitas, despesas, saldo)",
            "Filtros por período e conta",
            "Visualização por tipo fiscal",
            "Exportação para compartilhar"
          ],
          learning: "Query Builder avançado e otimização"
        }
      ]
    },
    {
      phase: "FASE 3: AUTOMAÇÃO COM IA",
      weeks: [
        {
          week: 7,
          title: "Upload e Storage",
          backend: [
            "Módulo Storage com Multer",
            "Upload local (MVP) com estrutura para S3",
            "Validação de tipos e tamanhos",
            "Compressão de imagens",
            "Cleanup de arquivos órfãos",
            "Rate limiting em uploads"
          ],
          mobile: [
            "Expo Camera integration",
            "Image picker da galeria",
            "Preview antes de enviar",
            "Compressão client-side",
            "Progress indicator",
            "Tratamento de permissões"
          ],
          learning: "File handling e otimização de assets"
        },
        {
          week: 8,
          title: "OCR - Processamento de Documentos",
          backend: [
            "Setup Bull Queue + Redis",
            "Processor para OCR",
            "Integração Google Cloud Vision API",
            "Service para parsing de texto → dados estruturados",
            "Retry logic e error handling",
            "Webhook para notificar cliente do resultado"
          ],
          mobile: [
            "Tela de captura de documento",
            "Loading states assíncronos",
            "Confirmação de dados extraídos",
            "Edição antes de salvar",
            "Visualização do documento original"
          ],
          learning: "Processamento assíncrono com filas"
        },
        {
          week: 9,
          title: "Voice Input - Entrada por Voz",
          backend: [
            "Processor para transcrição de áudio",
            "Integração Whisper API (OpenAI)",
            "NLP para extrair valor, descrição, data",
            "Classificação automática via GPT-4",
            "Armazenamento de transcrição original",
            "Métricas de precisão"
          ],
          mobile: [
            "expo-av para gravação",
            "UI de gravação (waveform, timer)",
            "Upload de áudio",
            "Feedback do processamento",
            "Confirmação da transação extraída"
          ],
          learning: "Speech-to-text e processamento de linguagem natural"
        }
      ]
    },
    {
      phase: "FASE 4: FEATURES AVANÇADAS",
      weeks: [
        {
          week: 10,
          title: "Patrimônio e Assets",
          backend: [
            "Entity Asset com relacionamentos",
            "CRUD completo de bens",
            "Cálculo de variação patrimonial",
            "Upload de documentos (escrituras, etc)",
            "Histórico de valores",
            "Repository para queries de evolução"
          ],
          mobile: [
            "Tela de listagem de patrimônio",
            "Adicionar/editar bens",
            "Visualização de documentos",
            "Gráfico de evolução patrimonial",
            "Categorização por tipo de ativo"
          ],
          learning: "Modelagem de dados temporais"
        },
        {
          week: 11,
          title: "Simulações IRPF",
          backend: [
            "Calculator de IRPF (tabela 2025)",
            "Entity TaxSimulation",
            "Cenários comparativos",
            "Validação de dados de entrada",
            "Disclaimers obrigatórios",
            "Testes unitários extensivos"
          ],
          mobile: [
            "Tela de simulação IRPF",
            "Input de dados para simulação",
            "Visualização de resultados",
            "Comparação de cenários",
            "Disclaimers claros e visíveis"
          ],
          learning: "Cálculos fiscais e compliance"
        },
        {
          week: 12,
          title: "Polish, Testes e Deploy",
          backend: [
            "Testes E2E completos",
            "Documentação Swagger finalizada",
            "Rate limiting em produção",
            "Logs estruturados (Winston)",
            "Health checks",
            "CI/CD com GitHub Actions",
            "Deploy em Railway/Heroku"
          ],
          mobile: [
            "Polish geral de UI/UX",
            "Onboarding melhorado",
            "Error boundaries",
            "Offline support básico",
            "Analytics (Amplitude)",
            "Build com EAS",
            "Submissão para lojas (preparar)"
          ],
          learning: "Deploy e monitoramento em produção"
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Roadmap 12 Semanas - TypeORM Edition
        </h1>
        <p className="text-gray-600 mb-4">
          Desenvolvimento confortável com foco em qualidade e aprendizado
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="text-blue-800 font-semibold">Semanas 1-3</div>
            <div className="text-sm text-blue-700">Fundação sólida</div>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="text-green-800 font-semibold">Semanas 4-6</div>
            <div className="text-sm text-green-700">Core do produto</div>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <div className="text-purple-800 font-semibold">Semanas 7-9</div>
            <div className="text-sm text-purple-700">Automação IA</div>
          </div>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <div className="text-orange-800 font-semibold">Semanas 10-12</div>
            <div className="text-sm text-orange-700">Features avançadas</div>
          </div>
        </div>
      </div>

      {weeks.map((phase, phaseIdx) => (
        <div key={phaseIdx} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-gray-800 text-white px-3 py-1 rounded mr-3 text-sm">
              {phaseIdx + 1}
            </span>
            {phase.phase}
          </h2>

          <div className="space-y-4">
            {phase.weeks.map((weekData) => (
              <div key={weekData.week} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                  onClick={() => toggleWeek(weekData.week)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Circle className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-lg text-gray-900">
                          Semana {weekData.week}
                        </span>
                      </div>
                      <div className="text-gray-700 mt-1">{weekData.title}</div>
                    </div>
                  </div>
                  {expandedWeeks.includes(weekData.week) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {expandedWeeks.includes(weekData.week) && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">Backend</span>
                        </h4>
                        <ul className="space-y-2">
                          {weekData.backend.map((task, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">Mobile</span>
                        </h4>
                        <ul className="space-y-2">
                          {weekData.mobile.map((task, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <div className="text-xs font-semibold text-yellow-800 mb-1">
                        🎯 Aprendizado da Semana
                      </div>
                      <div className="text-sm text-yellow-700">{weekData.learning}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Vantagens do roadmap 12 semanas</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Tempo para aprender TypeORM profundamente</li>
          <li>• Qualidade de código superior (mais testes)</li>
          <li>• Menos pressão, mais learning</li>
          <li>• Features mais polidas</li>
          <li>• Deploy sem correria</li>
        </ul>
      </div>
    </div>
  );
};

export default Roadmap12Weeks;