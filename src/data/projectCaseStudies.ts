import { Cpu, Diamond, Network } from "lucide-react";

export interface ProjectCaseStudy {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  teamSize: string;
  client: string;
  technologies: string[];
  icon: any;
  description: string;
  metrics: {
    label: string;
    value: string;
    improvement?: string;
  }[];
  content: string;
  visualComponent?: string;
}

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    id: 1,
    slug: "neural-commerce-platform",
    title: "Neural Commerce Platform",
    subtitle: "AI-powered e-commerce transformation",
    duration: "8 months",
    teamSize: "12 engineers",
    client: "Fortune 500 Retailer", 
    technologies: ["TensorFlow", "React", "Kubernetes", "AWS"],
    icon: Cpu,
    description: "AI-powered e-commerce platform processing $2M daily transactions with 99.99% uptime. Deep learning personalization achieving 340% ROI.",
    metrics: [
      { label: "Daily Revenue", value: "$2M", improvement: "240%" },
      { label: "Conversion Rate", value: "4.1%", improvement: "242%" },
      { label: "Response Time", value: "<50ms", improvement: "75%" },
      { label: "Uptime", value: "99.99%", improvement: "5%" }
    ],
    content: `
# Neural Commerce Platform

## Executive Summary

Developed an AI-powered e-commerce platform processing $2M daily transactions with 99.99% uptime. The system uses deep learning for personalization, achieving 340% ROI through increased conversion rates and reduced cart abandonment.

## The Challenge

Our client, a Fortune 500 retailer, faced declining online conversion rates despite increasing traffic. Their legacy platform couldn't provide real-time personalization, resulting in generic experiences for 50M+ annual visitors. Cart abandonment exceeded 70%, with mobile conversion below 1%.

**Key Problems:**
- Generic user experiences across 50M+ visitors
- 70% cart abandonment rate
- Mobile conversion below 1%
- Legacy systems unable to scale personalization
- Revenue stagnation despite traffic growth

## Technical Solution

### AI Recommendation Engine
Built a transformer-based architecture processing 2B user interactions with real-time embedding generation for 10M products. Our contextual bandits algorithm balances exploration and exploitation for optimal recommendations.

**Key Features:**
- Real-time personalization (<50ms response)
- Advanced session analysis and user behavior tracking
- Dynamic pricing optimization
- Cross-platform consistency (web, mobile, API)

### Infrastructure Architecture
Implemented Kubernetes orchestration across 3 regions with Redis cluster for session management supporting 1M concurrent users. PostgreSQL with read replicas handles transactional data while Elasticsearch powers sub-second search across 10M items.

**Technical Specifications:**
- Kubernetes clusters in US-East, US-West, EU-Central
- Redis Cluster: 12 nodes, 1TB memory, 1M concurrent sessions
- PostgreSQL: Primary + 6 read replicas, 99.99% availability
- Elasticsearch: 15 nodes, 10M products, sub-second search

### Frontend Innovation
Leveraged React 18 with Server Components for optimal performance, implementing progressive enhancement for 2G connections. WebAssembly enables client-side ML inference while maintaining Core Web Vitals standards.

## Results & Impact

### Quantitative Outcomes
- **Conversion rate**: 1.2% → 4.1% (242% increase)
- **Cart abandonment**: 70% → 45% (36% reduction)  
- **Average order value**: $67 → $124 (85% increase)
- **Page load time**: 3.2s → 0.8s (75% improvement)
- **Customer lifetime value**: $340 → $892 (162% increase)

### Qualitative Improvements
- Customer satisfaction (NPS): +47 points
- Mobile experience rating: 4.8/5.0
- Accessibility compliance: WCAG AAA
- Developer productivity: 3x faster feature deployment

### Business Impact
The platform now processes over $2M in daily transactions with 99.99% uptime. The client reported a 340% ROI within the first year, with ongoing revenue growth of 25% quarter-over-quarter.
    `,
    visualComponent: "AIArchitecture"
  },
  {
    id: 2,
    slug: "quantum-finance-dashboard",
    title: "Quantum Finance Dashboard",
    subtitle: "Quantum-classical hybrid portfolio optimization",
    duration: "6 months",
    teamSize: "8 specialists",
    client: "Investment Management Firm",
    technologies: ["Qiskit", "Python", "C++", "React", "D3.js"],
    icon: Diamond,
    description: "Quantum-classical hybrid system managing $5B in assets with real-time rebalancing. 10,000x faster than traditional methods.",
    metrics: [
      { label: "Assets Managed", value: "$5B", improvement: "100%" },
      { label: "Processing Speed", value: "4 min", improvement: "1,080x" },
      { label: "Accuracy", value: "±0.3%", improvement: "94%" },
      { label: "Sharpe Ratio", value: "2.1", improvement: "75%" }
    ],
    content: `
# Quantum Finance Dashboard

## Executive Summary

Built a quantum-classical hybrid system for portfolio optimization and risk analysis, processing complex financial models 10,000x faster than traditional methods. The platform manages $5B in assets with real-time rebalancing across 50,000+ instruments.

## The Challenge

Traditional Monte Carlo simulations for portfolio optimization required 72 hours for comprehensive risk analysis across global markets. Regulatory requirements demanded daily stress testing across 100 scenarios—computationally impossible with classical systems. Market volatility made hourly rebalancing critical for alpha generation.

**Key Challenges:**
- 72-hour optimization cycles insufficient for volatile markets
- 100+ regulatory stress test scenarios daily
- Real-time rebalancing across 50,000+ instruments
- Risk calculation accuracy requirements (±0.1%)
- Multi-asset class correlation analysis

## Technical Solution

### Quantum Processing Core
Utilized IBM Quantum System One (127 qubits) with Variational Quantum Eigensolver (VQE) for optimization. Our Quantum Approximate Optimization Algorithm (QAOA) achieves 99.2% fidelity through advanced error mitigation.

**Quantum Algorithms:**
- VQE for ground state optimization
- QAOA for combinatorial optimization
- Quantum machine learning for pattern recognition
- Error mitigation achieving 99.2% fidelity

### Classical Integration
Built a C++ engine for pre/post-processing with CUDA acceleration for parallel computations. Redis caches quantum circuits while Kafka ingests real-time market data at 1M events/second.

**Hybrid Architecture:**
- C++ processing engine (10,000x speedup)
- CUDA-accelerated parallel processing
- Redis quantum circuit caching
- Kafka real-time market data (1M events/sec)

### Visualization Platform
Created a React-based dashboard with D3.js for complex financial visualizations. WebGL renders 3D risk surfaces with real-time updates via WebSocket, optimized for trading floor tablets.

## Results & Impact

### Performance Metrics
- **Portfolio optimization**: 72 hours → 4 minutes (1,080x speedup)
- **Risk calculation accuracy**: ±5% → ±0.3%
- **Sharpe ratio improvement**: 1.2 → 2.1
- **Maximum drawdown reduction**: 18% → 11%
- **Alpha generation**: +340 basis points annually

### Operational Benefits
- Regulatory reports: Real-time generation
- Stress testing: 100 scenarios in 10 minutes
- Trade execution: Optimal timing with quantum prediction
- Cost reduction: $2M annually in compute resources

### Business Value
The quantum advantage enabled the firm to optimize $5B in assets with previously impossible speed and accuracy. The 340 basis points of additional alpha generated $170M in additional returns for clients.
    `,
    visualComponent: "QuantumCircuit"
  },
  {
    id: 3,
    slug: "smart-city-infrastructure",
    title: "Smart City Infrastructure", 
    subtitle: "IoT ecosystem for urban optimization",
    duration: "12 months",
    teamSize: "15 engineers",
    client: "Metropolitan Government",
    technologies: ["Azure IoT", "Python", "TensorFlow", "Power BI"],
    icon: Network,
    description: "IoT ecosystem managing 10,000+ sensors across the city. Reducing traffic congestion by 34% and saving $50M annually.",
    metrics: [
      { label: "Sensors Deployed", value: "10,000+", improvement: "100%" },
      { label: "Traffic Reduction", value: "34%", improvement: "34%" },
      { label: "Energy Savings", value: "$15M/yr", improvement: "20%" },
      { label: "Response Time", value: "5 min", improvement: "38%" }
    ],
    content: `
# Smart City Infrastructure

## Executive Summary

Implemented an IoT ecosystem managing 10,000+ sensors across the city, reducing traffic congestion by 34%, energy consumption by 20%, and emergency response times by 38%. The platform saves $50M annually in operational costs.

## The Challenge

The city faced massive urbanization challenges: traffic gridlock costing $100M annually in lost productivity, energy waste in 500 municipal buildings, 8-minute average emergency response times, and deteriorating air quality affecting public health.

**Urban Challenges:**
- $100M annual loss from traffic congestion
- Energy waste across 500 municipal buildings
- 8-minute emergency response times
- Deteriorating air quality (AQI consistently >150)
- Aging infrastructure with reactive maintenance

## Technical Solution

### Sensor Network
Deployed 10,000 IoT sensors citywide with edge computing for real-time processing. 5G connectivity ensures low latency while solar-powered, weather-resistant units operate independently.

**Network Specifications:**
- 10,000 sensors across 500 square miles
- Edge computing nodes (100ms processing)
- 5G connectivity (<10ms latency)
- Solar-powered with 7-day battery backup
- IP67 weather resistance

### AI Analytics Platform
Built traffic flow prediction achieving 92% accuracy using neural networks. Energy demand forecasting with LSTM networks optimizes consumption while anomaly detection prevents infrastructure failures.

**AI Capabilities:**
- Traffic prediction: 92% accuracy, 15-minute horizon
- Energy forecasting: LSTM networks, hourly optimization
- Anomaly detection: 99.7% accuracy, real-time alerts
- Emergency classification: 95% automated triage

### Command Center Dashboard
Created real-time city visualization with predictive maintenance alerts and automated resource allocation. Mobile apps enable field teams to respond efficiently to incidents.

## Results & Impact

### Operational Metrics
- **Traffic reduction**: 34% during peak hours
- **Energy savings**: 20% reduction ($15M/year)
- **Emergency response**: 8 min → 5 min average
- **Air quality**: 25% improvement in problem areas
- **Crime reduction**: 18% in monitored areas
- **ROI**: $50M saved in first year

### Quality of Life
- Citizen satisfaction up 42%
- Public transit ridership increased 28%
- Business district foot traffic up 35%
- Tourist satisfaction rating: 4.7/5.0

### Environmental Impact
The 20% energy reduction eliminated 50,000 tons of CO2 annually. Improved traffic flow reduced emissions by additional 15,000 tons, contributing to the city's carbon neutrality goals.
    `,
    visualComponent: "CityNetwork"
  }
];

export const projectTechnologies = [
  "TensorFlow", "React", "Kubernetes", "AWS", "Qiskit", "Python", 
  "C++", "D3.js", "Azure IoT", "Power BI", "PostgreSQL", "Redis",
  "Elasticsearch", "WebGL", "CUDA", "Kafka"
];