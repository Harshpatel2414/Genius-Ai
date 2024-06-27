import { useRouter } from "next/navigation";
import React from "react";

const Conversations = ({ chatHistory ,setOpen}) => {
  const customNames = {
    today: "Today",
    yesterday: "Yesterday",
    twoDaysAgo: "2 Days Ago"
  };
  const router =  useRouter()

  const handleClick = (id)=>{
    router.push(`/?id=${id}`)
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
  }

  const isAllEmpty = Object.values(chatHistory).every((array) => array.length === 0);

  if (!chatHistory || isAllEmpty) {
    return (
      <div className="mt-2 pt-1 space-y-2 overflow-y-auto max-h-80 min-h-40 hide-scrollbar">
        <p className="text-gray-600 text-md ml-2">No conversation</p>
      </div>
    );
  }

  return (
    <div className="mt-2 pt-1 space-y-2 overflow-y-auto max-h-80 min-h-40 hide-scrollbar">
      {Object.entries(chatHistory).map(([key, value]) => (
        <div key={key}>
          {value.length > 0 && (
            <>
              <h3 className="text-sm text-gray-600">{customNames[key]}</h3>
              <ul className="mt-1 space-y-2">
                {value.map((conversation) => (
                  <li
                    onClick={e => handleClick(conversation._id)}
                    key={conversation._id}
                    className="p-2 bg-gray-50 rounded truncate drop-shadow-sm cursor-pointer hover:bg-blue-100"
                  >
                    {conversation.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Conversations;
