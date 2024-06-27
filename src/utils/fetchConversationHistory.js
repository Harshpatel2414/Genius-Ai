const fetchConversationHistory = async (userId, setChatHistory) => {
  try {
    const response = await fetch("/api/fetch-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    if (response.ok) {
      const data = await response.json();
      setChatHistory(data);
    } else {
      console.error("Failed to fetch chat history:", response.status);
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
  }
};

export default fetchConversationHistory;
