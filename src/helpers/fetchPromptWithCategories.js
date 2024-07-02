const fetchPromptWithCategories = (query, categories) => {
    const categoryList = categories.join(", ");

    return `You are an intelligent assistant. Your task is to analyze the user's query and generate a list of related words or categories as a comma-separated string.

    Step-by-step instructions:

    1. Carefully read and analyze the user's query: "${query}".
    2. Identify the key terms and phrases in the query that indicate specific products (e.g., "shoes", "shirts").
    3. From the identified key terms, focus on extracting directly related product categories.
    4. Match these key terms with the most relevant words or categories from the following list: ${categoryList}.
    5. Exclude any categories that are not directly related to the specific products mentioned in the query.
    6. Generate a concise, comma-separated string of the most relevant words or categories based on the user's query.

    Begin your response below:
    `;
}

export default fetchPromptWithCategories;