import type { ComponentType } from 'react'
import { ReActVisualizer } from '../components/widgets/ReActVisualizer'
import { ComparisonSlider } from '../components/widgets/ComparisonSlider'
import { AttentionCurve } from '../components/widgets/AttentionCurve'
import { ReflexionFlow } from '../components/widgets/ReflexionFlow'
import { ToTVisualizer } from '../components/widgets/ToTVisualizer'
import { HarnessStateMachine } from '../components/widgets/HarnessStateMachine'
import { Cite } from '../components/article/Cite'

export const mdxComponents: Record<string, ComponentType<any>> = {
  ReActVisualizer,
  ComparisonSlider,
  AttentionCurve,
  ReflexionFlow,
  ToTVisualizer,
  HarnessStateMachine,
  Cite,
}
