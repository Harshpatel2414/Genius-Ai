const fetchPromptWithCategories = (query, categories) => {
    const categoryList = categories.join(", ");

    return `You are an intelligent assistant. Your job is to understand the user's query and generate a helpful response.
    
    Step-by-step instructions:
    
    1. Analyze the user's query: "${query}".
    2. Determine if the user is asking for product suggestions or recommendations.
    3. If the query is about product suggestions, provide a list of recommended products. Use the available product categories for reference: ${categoryList}.
    4. If the query is not about product suggestions, provide a general, friendly response to the user's query.
    5. Ensure the response is clear, concise, and helpful.
    
    Note: If suggesting products, suggest popular products under the specified category and budget if mentioned.
    
    Begin your response below:
    `;
}

export default fetchPromptWithCategories;