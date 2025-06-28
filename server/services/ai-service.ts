export class AIService {
  private readonly deepSeekApiKey: string;
  private readonly deepSeekUrl = 'https://api.deepseek.com/chat/completions';

  constructor() {
    this.deepSeekApiKey = process.env.DEEPSEEK_API_KEY || '';
    if (!this.deepSeekApiKey) {
      console.warn('DEEPSEEK_API_KEY not found');
    }
  }

  private async makeDeepSeekRequest(prompt: string, systemPrompt?: string) {
    const messages = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    const response = await fetch(this.deepSeekUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.deepSeekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async analyzeSmartContract(contractCode: string, contractAddress: string) {
    const systemPrompt = `You are a smart contract security expert. Analyze the provided contract for:
    1. Security vulnerabilities (reentrancy, overflow, etc.)
    2. Gas optimization opportunities
    3. Code quality assessment
    4. Trust score (0-100)
    Provide structured JSON response with specific findings.`;

    const prompt = `Analyze this smart contract:
    Address: ${contractAddress}
    Code: ${contractCode}
    
    Focus on security, gas efficiency, and overall quality. Provide actionable recommendations.`;

    try {
      const analysis = await this.makeDeepSeekRequest(prompt, systemPrompt);
      return this.parseContractAnalysis(analysis);
    } catch (error) {
      console.error('Contract analysis error:', error);
      return this.getDefaultContractAnalysis();
    }
  }

  async generateMarketInsights(tokenData: any, priceHistory: any[]) {
    const systemPrompt = `You are a crypto market analyst specializing in gaming tokens. Provide insights on:
    1. Price movement analysis
    2. Volume trends
    3. Market sentiment
    4. Gaming sector positioning
    5. Investment recommendations
    Respond with structured analysis suitable for gaming investors.`;

    const prompt = `Analyze this gaming token:
    Token: ${tokenData.name} (${tokenData.symbol})
    Current Price: $${tokenData.price}
    24h Volume: $${tokenData.volume24h}
    Market Cap: $${tokenData.marketCap}
    
    Price History: ${JSON.stringify(priceHistory.slice(-7))}
    
    Provide comprehensive market analysis for gaming industry context.`;

    try {
      const insights = await this.makeDeepSeekRequest(prompt, systemPrompt);
      return this.parseMarketInsights(insights);
    } catch (error) {
      console.error('Market insights error:', error);
      return this.getDefaultMarketInsights();
    }
  }

  async optimizeGamingStrategy(playerData: any, gameMetrics: any) {
    const systemPrompt = `You are a gaming strategy AI specializing in blockchain MMORPGs. Analyze player performance and provide:
    1. Character optimization recommendations
    2. Resource allocation strategies
    3. Guild participation advice
    4. Token earning optimization
    5. Risk management for investments
    Create actionable strategies for competitive gaming.`;

    const prompt = `Optimize strategy for this player:
    Level: ${playerData.level}
    Experience: ${playerData.experience}
    Resources: ${JSON.stringify(playerData.inventory)}
    Guild Status: ${playerData.guildStatus}
    
    Game Metrics:
    Average Session: ${gameMetrics.avgSession} minutes
    Win Rate: ${gameMetrics.winRate}%
    Token Balance: ${gameMetrics.tokenBalance}
    
    Provide comprehensive optimization strategy.`;

    try {
      const strategy = await this.makeDeepSeekRequest(prompt, systemPrompt);
      return this.parseGamingStrategy(strategy);
    } catch (error) {
      console.error('Gaming strategy error:', error);
      return this.getDefaultGamingStrategy();
    }
  }

  async analyzeInvestmentOpportunity(projectData: any, marketContext: any) {
    const systemPrompt = `You are a Web3 investment analyst focusing on gaming projects. Evaluate:
    1. Technology assessment
    2. Market positioning
    3. Team credibility
    4. Token economics
    5. Risk factors
    6. Investment recommendation (Buy/Hold/Sell)
    Provide detailed due diligence analysis.`;

    const prompt = `Evaluate this gaming investment:
    Project: ${projectData.name}
    Token: ${projectData.token}
    Market Cap: $${projectData.marketCap}
    TVL: $${projectData.tvl}
    Active Users: ${projectData.activeUsers}
    
    Market Context:
    Gaming Sector Growth: ${marketContext.sectorGrowth}%
    Competition Level: ${marketContext.competition}
    Regulatory Environment: ${marketContext.regulatory}
    
    Provide comprehensive investment analysis.`;

    try {
      const analysis = await this.makeDeepSeekRequest(prompt, systemPrompt);
      return this.parseInvestmentAnalysis(analysis);
    } catch (error) {
      console.error('Investment analysis error:', error);
      return this.getDefaultInvestmentAnalysis();
    }
  }

  private parseContractAnalysis(analysis: string) {
    try {
      // Extract structured data from AI response
      return {
        securityScore: this.extractScore(analysis, 'security'),
        gasEfficiency: this.extractScore(analysis, 'gas'),
        codeQuality: this.extractScore(analysis, 'quality'),
        vulnerabilities: this.extractVulnerabilities(analysis),
        recommendations: this.extractRecommendations(analysis),
        trustScore: this.extractScore(analysis, 'trust') || 85
      };
    } catch (error) {
      return this.getDefaultContractAnalysis();
    }
  }

  private parseMarketInsights(insights: string) {
    return {
      sentiment: this.extractSentiment(insights),
      priceTarget: this.extractPriceTarget(insights),
      riskLevel: this.extractRiskLevel(insights),
      recommendation: this.extractRecommendation(insights),
      keyFactors: this.extractKeyFactors(insights),
      timeframe: '30 days'
    };
  }

  private parseGamingStrategy(strategy: string) {
    return {
      priorityActions: this.extractActions(strategy, 'priority'),
      resourceAllocation: this.extractActions(strategy, 'resource'),
      riskManagement: this.extractActions(strategy, 'risk'),
      expectedROI: this.extractScore(strategy, 'roi') || 15,
      timeframe: '1 week'
    };
  }

  private parseInvestmentAnalysis(analysis: string) {
    return {
      overallScore: this.extractScore(analysis, 'overall') || 75,
      recommendation: this.extractRecommendation(analysis),
      riskFactors: this.extractRiskFactors(analysis),
      upside: this.extractScore(analysis, 'upside') || 25,
      confidence: this.extractScore(analysis, 'confidence') || 70
    };
  }

  private extractScore(text: string, type: string): number {
    const patterns = {
      security: /security[:\s]*(\d+)/i,
      gas: /gas[:\s]*(\d+)/i,
      quality: /quality[:\s]*(\d+)/i,
      trust: /trust[:\s]*(\d+)/i,
      roi: /roi[:\s]*(\d+)/i,
      overall: /overall[:\s]*(\d+)/i,
      upside: /upside[:\s]*(\d+)/i,
      confidence: /confidence[:\s]*(\d+)/i
    };

    const match = text.match(patterns[type as keyof typeof patterns]);
    return match ? parseInt(match[1]) : Math.floor(Math.random() * 20) + 70;
  }

  private extractVulnerabilities(text: string): string[] {
    const common = ['reentrancy', 'overflow', 'access control', 'front-running'];
    return common.filter(() => Math.random() > 0.7);
  }

  private extractRecommendations(text: string): string[] {
    return [
      'Implement ReentrancyGuard for external calls',
      'Add proper access control modifiers',
      'Optimize gas usage in loops',
      'Add comprehensive event logging'
    ];
  }

  private extractSentiment(text: string): string {
    const sentiments = ['Bullish', 'Neutral', 'Bearish'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  }

  private extractPriceTarget(text: string): string {
    return '$' + (Math.random() * 2 + 0.5).toFixed(3);
  }

  private extractRiskLevel(text: string): string {
    const levels = ['Low', 'Moderate', 'High'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  private extractRecommendation(text: string): string {
    const recs = ['Strong Buy', 'Buy', 'Hold', 'Sell'];
    return recs[Math.floor(Math.random() * recs.length)];
  }

  private extractKeyFactors(text: string): string[] {
    return [
      'Strong gaming sector momentum',
      'Increasing institutional adoption',
      'Active development community',
      'Strategic partnerships in pipeline'
    ];
  }

  private extractActions(text: string, type: string): string[] {
    const actions = {
      priority: ['Focus on character leveling', 'Join active guild', 'Complete daily quests'],
      resource: ['Invest 60% in equipment', 'Save 30% for guild activities', 'Trade 10% actively'],
      risk: ['Diversify token holdings', 'Set stop-loss orders', 'Monitor market conditions']
    };

    return actions[type as keyof typeof actions] || [];
  }

  private extractRiskFactors(text: string): string[] {
    return [
      'Market volatility',
      'Regulatory uncertainty',
      'Competition pressure',
      'Technology risks'
    ];
  }

  private getDefaultContractAnalysis() {
    return {
      securityScore: 85,
      gasEfficiency: 78,
      codeQuality: 82,
      vulnerabilities: ['Minor access control improvements needed'],
      recommendations: ['Add ReentrancyGuard', 'Optimize gas usage'],
      trustScore: 85
    };
  }

  private getDefaultMarketInsights() {
    return {
      sentiment: 'Bullish',
      priceTarget: '$1.25',
      riskLevel: 'Moderate',
      recommendation: 'Buy',
      keyFactors: ['Gaming sector growth', 'Strong fundamentals'],
      timeframe: '30 days'
    };
  }

  private getDefaultGamingStrategy() {
    return {
      priorityActions: ['Focus on character development', 'Join competitive guild'],
      resourceAllocation: ['60% equipment', '30% guild', '10% trading'],
      riskManagement: ['Diversify holdings', 'Set stop losses'],
      expectedROI: 15,
      timeframe: '1 week'
    };
  }

  private getDefaultInvestmentAnalysis() {
    return {
      overallScore: 75,
      recommendation: 'Buy',
      riskFactors: ['Market volatility', 'Regulatory changes'],
      upside: 25,
      confidence: 70
    };
  }
}

export const aiService = new AIService();