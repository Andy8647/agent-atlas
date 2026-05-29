import type { TreeData } from '../lib/types'

export const treeData: TreeData = {
  "clusters": [
    {
      "id": "foundations",
      "title": "Agent 基础概念",
      "color": "#cba6f7",
      "nodes": [
        {
          "slug": "what-is-agent",
          "title": "什么是 Agent",
          "order": 1,
          "prerequisites": [],
          "estimatedMinutes": 10,
          "summary": "从 stateless function 到 agent 主循环 — 把'agent 到底是什么'这条线找准"
        },
        {
          "slug": "workflow-vs-agent",
          "title": "Workflow vs Agent",
          "order": 2,
          "prerequisites": [
            "what-is-agent"
          ],
          "estimatedMinutes": 12,
          "summary": "控制权分水岭：代码调度 vs 模型自主决策 — 以及五种 workflow 的样子"
        },
        {
          "slug": "agent-architecture",
          "title": "Agent 架构双视角",
          "order": 3,
          "prerequisites": [
            "workflow-vs-agent"
          ],
          "estimatedMinutes": 12,
          "summary": "三件套 vs Model+Harness — 同一个 agent，学界和工业界各有一套常用切法"
        }
      ]
    },
    {
      "id": "single-agent-reasoning",
      "title": "单 Agent 推理范式",
      "color": "#fab387",
      "nodes": [
        {
          "slug": "react-core",
          "title": "ReAct: 推理与行动交替",
          "order": 4,
          "prerequisites": [
            "agent-architecture"
          ],
          "estimatedMinutes": 12,
          "summary": "单 Agent 最基础的决策范式：让模型在每次行动前先用自然语言'想一句'"
        },
        {
          "slug": "react-failures",
          "title": "ReAct 的失败模式",
          "order": 5,
          "prerequisites": [
            "react-core"
          ],
          "estimatedMinutes": 12,
          "summary": "0% 幻觉的另一面 — Reasoning error 47% / Repetitive loop / 工具拉胯导致的 derail"
        },
        {
          "slug": "plan-and-solve",
          "title": "Plan-and-Solve",
          "order": 6,
          "prerequisites": [
            "react-core"
          ],
          "estimatedMinutes": 10,
          "summary": "用一句 prompt 逼模型先规划再执行 — zero-shot 追平 few-shot 的轻量解药"
        },
        {
          "slug": "tree-of-thoughts",
          "title": "Tree of Thoughts",
          "order": 7,
          "prerequisites": [
            "plan-and-solve"
          ],
          "estimatedMinutes": 12,
          "summary": "把线性推理变成可探索、可回溯的搜索树 — System 1 外挂 System 2"
        },
        {
          "slug": "reflexion",
          "title": "Reflexion: 语言式 RL",
          "order": 8,
          "prerequisites": [
            "react-failures"
          ],
          "estimatedMinutes": 12,
          "summary": "用自然语言反思代替梯度 — agent 失败后写一句教训，存进记忆，下次重来"
        }
      ]
    },
    {
      "id": "tools-and-memory",
      "title": "工具与记忆",
      "color": "#a6e3a1",
      "nodes": [
        {
          "slug": "function-calling",
          "title": "Function Calling 机制",
          "order": 9,
          "prerequisites": [
            "react-core"
          ],
          "estimatedMinutes": 11,
          "summary": "ReAct 的 Action 升级版 — 一个 tool 是什么、一轮 tool use 怎么跑"
        },
        {
          "slug": "toolformer",
          "title": "Toolformer",
          "order": 10,
          "prerequisites": [
            "function-calling"
          ],
          "estimatedMinutes": 11,
          "summary": "模型自监督学会何时调工具 — 监督信号是「这个工具的结果能否让后文更好预测」"
        },
        {
          "slug": "aci",
          "title": "ACI: 为 Agent 设计工具",
          "order": 11,
          "prerequisites": [
            "function-calling"
          ],
          "estimatedMinutes": 12,
          "summary": "Agent-Computer Interface — 工具设计的好不好决定 agent 成不成（6.7% → 68.3% 的实证）"
        },
        {
          "slug": "memory-basics",
          "title": "记忆系统基础",
          "order": 12,
          "prerequisites": [
            "react-core"
          ],
          "estimatedMinutes": 11,
          "summary": "短期 vs 长期记忆 — RAG 管道 + 一个必须破除的误解（记忆 ≠ 容量）"
        },
        {
          "slug": "memgpt",
          "title": "MemGPT: LLM 即操作系统",
          "order": 13,
          "prerequisites": [
            "memory-basics",
            "function-calling"
          ],
          "estimatedMinutes": 12,
          "summary": "把 context 当 RAM、外部存储当硬盘、用分页机制做长期记忆 — 8K 窗口跑出 93% DMR"
        }
      ]
    },
    {
      "id": "context-engineering",
      "title": "上下文工程",
      "color": "#89b4fa",
      "nodes": [
        {
          "slug": "context-engineering",
          "title": "Context Engineering 总论",
          "order": 14,
          "prerequisites": [
            "memory-basics"
          ],
          "estimatedMinutes": 11,
          "summary": "注意力预算 + context rot — 从「写 prompt」到「策划整个 context 配置」"
        },
        {
          "slug": "context-design",
          "title": "Context 设计原则",
          "order": 15,
          "prerequisites": [
            "context-engineering"
          ],
          "estimatedMinutes": 11,
          "summary": "按需检索 + progressive disclosure — 落到 system prompt / tools / examples 三大部件"
        },
        {
          "slug": "long-running-techniques",
          "title": "长程任务三大技术",
          "order": 16,
          "prerequisites": [
            "context-design",
            "memgpt"
          ],
          "estimatedMinutes": 12,
          "summary": "Compaction / Note-taking / Sub-agent — 当 token 总量超过窗口时"
        },
        {
          "slug": "context-failure-modes",
          "title": "四种崩法: Context 管不好的后果",
          "order": 17,
          "prerequisites": [
            "long-running-techniques"
          ],
          "estimatedMinutes": 13,
          "summary": "Poisoning / Distraction / Confusion / Clash — Drew Breunig 的四种失败模式 + 学术祖宗"
        },
        {
          "slug": "context-fixes-evidence",
          "title": "治法与学术证据",
          "order": 18,
          "prerequisites": [
            "context-failure-modes"
          ],
          "estimatedMinutes": 12,
          "summary": "六种治法对症下药 + Chroma 18 模型实证 + 工具数量崩坏曲线"
        }
      ]
    },
    {
      "id": "multi-agent-production",
      "title": "多 Agent 与工程落地",
      "color": "#f5c2e7",
      "nodes": [
        {
          "slug": "multi-agent-debate",
          "title": "多 Agent 大辩论",
          "order": 19,
          "prerequisites": [
            "reflexion",
            "context-engineering"
          ],
          "estimatedMinutes": 10,
          "summary": "Anthropic vs Cognition: rot vs fragmentation"
        },
        {
          "slug": "harness-overview",
          "title": "Harness Engineering 总论",
          "order": 20,
          "prerequisites": [
            "agent-architecture",
            "function-calling",
            "reflexion"
          ],
          "estimatedMinutes": 10,
          "summary": "Agent=Model+Harness,5%loop 95%infra"
        },
        {
          "slug": "harness-loop",
          "title": "主循环与请求构造",
          "order": 21,
          "prerequisites": [
            "harness-overview"
          ],
          "estimatedMinutes": 10,
          "summary": "Claude Code nO,Codex turn.rs"
        },
        {
          "slug": "harness-tools-context",
          "title": "工具流水线与 Context Manager",
          "order": 22,
          "prerequisites": [
            "harness-loop",
            "aci"
          ],
          "estimatedMinutes": 10,
          "summary": "6步执行管线,token感知截断"
        },
        {
          "slug": "harness-agents-safety",
          "title": "子 Agent 与安全",
          "order": 23,
          "prerequisites": [
            "harness-tools-context"
          ],
          "estimatedMinutes": 10,
          "summary": "Controlled sub-agent,Guardian,MCP"
        },
        {
          "slug": "evaluation",
          "title": "评估: Agent 好不好",
          "order": 24,
          "prerequisites": [
            "harness-loop"
          ],
          "estimatedMinutes": 10,
          "summary": "pass@k vs pass^k,τ-bench"
        },
        {
          "slug": "prompt-caching-infra",
          "title": "推理成本与 Prompt Caching",
          "order": 25,
          "prerequisites": [
            "harness-loop",
            "context-engineering"
          ],
          "estimatedMinutes": 10,
          "summary": "三层缓存,PagedAttention→RadixAttention"
        }
      ]
    }
  ]
}
