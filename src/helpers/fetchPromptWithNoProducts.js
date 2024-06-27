const fetchPromptWithNoProducts = (query, assistantMessage) => {
    return `You are an intelligent assistant. The user has searched for products, but none were found that match their query.

    Follow these step-by-step instructions to provide a helpful response:

    ${assistantMessage ? `1. Review the previous assistant's message: "${assistantMessage}".` : ''}
    1. Analyze the user's query to understand what they are looking for.
    2. Acknowledge that no matching products were found.
    3. Provide some information about the type of product they are looking for, including popular features or models.
    4. Suggest alternative actions or searches the user can try.
    5. Offer tips on how to refine their search for better results.

    Here is the user's query: "${query}"

    Provide your response below:
    `;
}

export default fetchPromptWithNoProducts;

