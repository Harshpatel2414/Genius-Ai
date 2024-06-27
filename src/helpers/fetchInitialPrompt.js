const fetchInitialPrompt = (query, assistantMessage) => {
    return `You are an intelligent assistant. Your task is to analyze the user's query and determine if they are asking for product suggestions.

    Follow these step-by-step instructions to analyze the query:
    ${assistantMessage ? `1. Review the previous assistant's message: "${assistantMessage}".\n` : ''}
    1. Read the user's query carefully: "${query}".
    2. Identify keywords or phrases that indicate the user is asking for product suggestions. These may include words like "recommend", "suggest", "looking for", "best", "options for", etc.
    3. Determine the context of the query to understand if it relates to products. For example, look for mentions of product types, brands, specific features, or price ranges.
    4. Assess if the user's query is seeking advice or information on purchasing or choosing a product.
    
    Based on your analysis, respond with either:
    - "general response needed" if the query does not involve seeking product recommendations.
    - "product suggestions needed" if the query involves seeking product recommendations.

    Provide your response below:`;
}
export default fetchInitialPrompt;